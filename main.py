#will now be testing future climate data

import numpy as np
import joblib

# Future year to predict
future_year = np.array([[2030]])  # Must be 2D for sklearn

# Columns to predict
columns = ['temperature_2m', 'precipitation', 'rain', 'snowfall', 'pressure_msl']

# Load models and make predictions
future_predictions = {}
for col in columns:
    model = joblib.load(f"./models/{col}_linear_model.pkl")  # Load saved model
    prediction = model.predict(future_year)
    future_predictions[col] = prediction[0][0]  # Extract the predicted value

# Print predictions
print(f"Predictions for year {future_year[0][0]}:")
for col, value in future_predictions.items():
    print(f"{col}: {value}")
