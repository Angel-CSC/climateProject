from tensorflow.keras.models import load_model
import joblib
import numpy as np
import pandas as pd
from get_functions import get_yearly

model = load_model("climate_model.keras")
scaler = joblib.load("scaler.pkl")

lat, long = 32.9126, -96.6389
data = get_yearly(lat, long)
data.dropna(inplace=True)

target_columns = ['temperature_2m', 'precipitation', 'rain', 'snowfall', 'pressure_msl']

data[target_columns] = scaler.transform(data[target_columns])

sequence_length = 6
features = len(target_columns)

def predict_future(data, model, scaler, days=365):
    input_sequence = data[target_columns].values[-sequence_length:]
    predictions = []

    for _ in range(days):
        input_reshaped = input_sequence.reshape(1, sequence_length, features)
        pred = model.predict(input_reshaped)

        predictions.append(pred[0])

        input_sequence = np.vstack([input_sequence[1:], pred])

    return np.array(predictions)

predictions = predict_future(data, model, scaler, 2000)

predicted_values = scaler.inverse_transform(predictions)

future_dates = pd.date_range(start=pd.to_datetime("today"), periods=365, freq='D')
df_predictions = pd.DataFrame(predicted_values, columns=target_columns, index=future_dates)

print("Predicted Climate Conditions for the Next Year:")
print(df_predictions.head(10))

df_predictions.to_csv("yearly_predictions.csv")
