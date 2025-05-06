import sqlite3
import joblib
import io
import numpy as np
import json
from sklearn.metrics import mean_absolute_error, mean_squared_error
from pprint import pprint

models_from_db = ['precipitation', 'pressure', 'rain', 'snowfall', 'temperature']

def compute_margin_error(metrics, yearly_data, db_data):
    margin_error = {}

    json_keys = {
        'precipitation': 'precipitation',
        'temperature': 'temperature_2m',
        'rain': 'rain',
        'snowfall': 'snowfall',
        'pressure': 'pressure_msl'
    }

    start_year, end_year = 1940, 2025
    years = np.arange(start_year, end_year + 1).reshape(-1, 1)

    for metric in metrics:
        model_col = f"{metric}_model"
        json_key  = json_keys.get(metric)

        margin_error[metric] = None

        if model_col in db_data and json_key in yearly_data:
            try:
                blob  = db_data[model_col]
                model = joblib.load(io.BytesIO(blob))

                yearly_dict = yearly_data[json_key]

                actual_list = [
                    yearly_dict.get(str(y), None)
                    for y in range(start_year, end_year + 1)
                ]

                actuals = np.array([
                    float(v) if v is not None else np.nan
                    for v in actual_list
                ])
                preds = model.predict(years).flatten()

                # Filter out missing values
                mask = ~np.isnan(actuals)
                y_true = actuals[mask]
                y_pred = preds[mask]

                if len(y_true) == 0:
                    continue

                # Min-max normalization
                min_val = min(y_true.min(), y_pred.min())
                max_val = max(y_true.max(), y_pred.max())

                if max_val - min_val == 0:
                    continue  # Avoid divide-by-zero

                y_true_norm = (y_true - min_val) / (max_val - min_val)
                y_pred_norm = (y_pred - min_val) / (max_val - min_val)

                mae = mean_absolute_error(y_true_norm, y_pred_norm)
                mse = mean_squared_error (y_true_norm, y_pred_norm)

                margin_error[metric] = {
                    'mae': round(mae, 4),
                    'mse': round(mse, 4)
                }

            except Exception as e:
                print(f"Error computing margin for {metric}: {e}")
                margin_error[metric] = None

    return margin_error




def update_margin_errors(db_path="./database.sqlite"):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    try:
        cursor.execute("ALTER TABLE models ADD COLUMN margin_error TEXT")
    except sqlite3.OperationalError:
        pass

    cursor.execute(f"""
        SELECT location_id, yearly_averages_json, 
        {', '.join(f'{m}_model' for m in models_from_db)}
        FROM models
    """)
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    print(columns)


    for row in rows:
        try:
            record = dict(zip(columns, row))


            location_id = record["location_id"]

            yearly_json = record["yearly_averages_json"]
            if not yearly_json:
                print(f"No yearly data for {location_id}")
                continue

            yearly_data = json.loads(yearly_json)
            margin_error = compute_margin_error(models_from_db, yearly_data, record)
            

            cursor.execute(
                "UPDATE models SET margin_error = ? WHERE location_id = ?",
                (json.dumps(margin_error), location_id)
            )
            print(f"Updated margin_error for {location_id}")
        except Exception as e:
            print(f"Error processing {record['location_id']}: {e}")

    conn.commit()
    conn.close()

def calculate_average_error(db_path="./database.sqlite"):
    metrics = ['precipitation', 'pressure', 'rain', 'snowfall', 'temperature']

    sum_mae   = {m: 0.0 for m in metrics}
    sum_mse   = {m: 0.0 for m in metrics}
    count     = {m: 0   for m in metrics}

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT margin_error FROM models")
    for (me_json,) in cursor.fetchall():
        if not me_json:
            continue
        me = json.loads(me_json)

        for m in metrics:
            entry = me.get(m)
            if isinstance(entry, dict):
                mae = entry.get('mae')
                mse = entry.get('mse')
                if mae is not None:
                    sum_mae[m] += mae
                if mse is not None:
                    sum_mse[m] += mse
                if mae is not None or mse is not None:
                    count[m] += 1

    conn.close()

    per_metric = {}
    total_mae = total_mse = total_count = 0
    for m in metrics:
        if count[m]:
            avg_mae = sum_mae[m] / count[m]
            avg_mse = sum_mse[m] / count[m]
            per_metric[m] = {
                'mae': round(avg_mae, 4),
                'mse': round(avg_mse, 4)
            }
            total_mae   += avg_mae
            total_mse   += avg_mse
            total_count += 1
        else:
            per_metric[m] = None

    overall = {
        'mae': round(total_mae / total_count, 4) if total_count else None,
        'mse': round(total_mse / total_count, 4) if total_count else None
    }

    return {
        'per_metric': per_metric,
        'overall': overall
    }


if __name__ == "__main__":
    #update_margin_errors()
    pprint(calculate_average_error())
