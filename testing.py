from tensorflow.keras.models import load_model
import joblib
import numpy as np
import pandas as pd
from main import get_data

# Load the trained model
model = load_model("climate_model.keras")

# Load the scaler
scaler = joblib.load("scaler.pkl")

# Fetch data for a specific location (latitude, longitude)
lat = 51  # Example latitude
long = 50  # Example longitude
data = get_data(lat, long)
data.dropna(inplace=True)  # Drop missing values

# Define the target columns (features the model was trained on)
target_columns = ['temperature_2m', 'precipitation', 'rain', 'snowfall', 'pressure_msl']

# Normalize the data using the saved scaler
data[target_columns] = scaler.transform(data[target_columns])

# Prepare the sequence data
sequence_length = 6
features = len(target_columns)

def create_sequences(data, seq_length):
    X = []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length])
    return np.array(X)

X = create_sequences(data[target_columns].values, sequence_length)

# Use the model to make predictions for the next time step
predictions = model.predict(X[-1].reshape(1, sequence_length, features))

# Inverse transform the predictions to get them back to the original scale
predicted_values = scaler.inverse_transform(predictions)

# Print the predicted values
print(f"Predicted values for the next time step (latitude: {lat}, longitude: {long}):")
print(f"Temperature: {predicted_values[0][0]}°C")
print(f"Precipitation: {predicted_values[0][1]} mm")
print(f"Rain: {predicted_values[0][2]} mm")
print(f"Snowfall: {predicted_values[0][3]} mm")
print(f"Pressure: {predicted_values[0][4]} hPa")