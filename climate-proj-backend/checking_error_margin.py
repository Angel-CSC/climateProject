import sqlite3
import joblib
import io
import numpy as np
import json
from sklearn.metrics import mean_absolute_error, mean_squared_error

# List of metrics we care about
models_from_db = ['precipitation', 'pressure', 'rain', 'snowfall', 'temperature']

def compute_margin_error(metrics, yearly_data, db_data):
    margin_error = {}

    # map our metric names → JSON keys in yearly_data
    json_keys = {
        'precipitation': 'precipitation',
        'temperature': 'temperature_2m',
        'rain': 'rain',
        'snowfall': 'snowfall',
        'pressure': 'pressure_msl'
    }

    # define our year range once
    start_year, end_year = 1940, 2025
    years = np.arange(start_year, end_year + 1).reshape(-1, 1)

    for metric in metrics:
        model_col = f"{metric}_model"
        json_key   = json_keys.get(metric)

        # default to None if anything’s missing
        margin_error[metric] = None

        if model_col in db_data and json_key in yearly_data:
            try:
                # load the model
                blob  = db_data[model_col]
                model = joblib.load(io.BytesIO(blob))

                # pull the { year_str: value } dict
                yearly_dict = yearly_data[json_key]

                # build a list of actuals; missing → None
                actual_list = [
                    yearly_dict.get(str(y), None)
                    for y in range(start_year, end_year + 1)
                ]
                # map None → np.nan and cast to float array
                actuals = np.array([
                    float(v) if v is not None else np.nan
                    for v in actual_list
                ])

                # get predictions
                preds = model.predict(years).flatten()

                # mask out any years where we have no actual
                mask = ~np.isnan(actuals)
                y_true = actuals[mask]
                y_pred = preds  [mask]

                # compute metrics
                mae = mean_absolute_error(y_true, y_pred)
                mse = mean_squared_error (y_true, y_pred)

                # store both (rounded)
                margin_error[metric] = {
                    'mae': round(mae, 4),
                    'mse': round(mse, 4)
                }

            except Exception as e:
                print(f"Error computing margin for {metric}: {e}")
                margin_error[metric] = None

    return margin_error



# Main function that processes the database
def update_margin_errors(db_path="./database.sqlite"):
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Try to add the margin_error column
    try:
        cursor.execute("ALTER TABLE models ADD COLUMN margin_error TEXT")
    except sqlite3.OperationalError:
        pass  # Column already exists

    # Fetch all needed data
    cursor.execute(f"""
        SELECT location_id, yearly_averages_json, 
        {', '.join(f'{m}_model' for m in models_from_db)}
        FROM models
    """)
    rows = cursor.fetchall()
    columns = [desc[0] for desc in cursor.description]
    print(columns)


    # Process each row
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
            

            # Update margin_error column
            cursor.execute(
                "UPDATE models SET margin_error = ? WHERE location_id = ?",
                (json.dumps(margin_error), location_id)
            )
            print(f"✅ Updated margin_error for {location_id}")
        except Exception as e:
            print(f"❌ Error processing {record['location_id']}: {e}")

    conn.commit()
    conn.close()
    print("🎉 Done updating margin_error for all records.")

# Only run if script is called directly
if __name__ == "__main__":
    update_margin_errors()
