import numpy as np
import joblib

future_year = np.array([[2030]])

columns = ['temperature_2m', 'precipitation', 'rain', 'snowfall', 'pressure_msl']

future_predictions = {}
for col in columns:
    model = joblib.load(f"./models/{col}_linear_model.pkl")
    prediction = model.predict(future_year)
    future_predictions[col] = prediction[0][0]

print(f"Predictions for year {future_year[0][0]}:")
for col, value in future_predictions.items():
    print(f"{col}: {value}")
