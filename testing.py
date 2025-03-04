from tensorflow.keras.models import load_model
import joblib
import numpy as np
import pandas as pd
from get_functions import get_yearly

# Load the trained model and scaler
model = load_model("climate_model.keras")  # Update to .keras format
scaler = joblib.load("scaler.pkl")

# Fetch the most recent data
lat, long = 32.9126, -96.6389  # Example location
data = get_yearly(lat, long)
data.dropna(inplace=True)

# Target features
target_columns = ['temperature_2m', 'precipitation', 'rain', 'snowfall', 'pressure_msl']

# Normalize data
data[target_columns] = scaler.transform(data[target_columns])

# Sequence settings
sequence_length = 6
features = len(target_columns)

# Function to generate a year of predictions
def predict_future(data, model, scaler, days=365):
    input_sequence = data[target_columns].values[-sequence_length:]  # Last 6 days
    predictions = []

    for _ in range(days):
        # Reshape input and predict the next day
        input_reshaped = input_sequence.reshape(1, sequence_length, features)
        pred = model.predict(input_reshaped)

        # Store the predicted values
        predictions.append(pred[0])  # Store as a 1D array

        # Update the input sequence by appending the new prediction
        input_sequence = np.vstack([input_sequence[1:], pred])  # Shift left and add new pred

    return np.array(predictions)

# Generate predictions for the next 365 days
predictions = predict_future(data, model, scaler, 2000)

# Inverse transform to get real values
predicted_values = scaler.inverse_transform(predictions)

# Convert to DataFrame for better readability
future_dates = pd.date_range(start=pd.to_datetime("today"), periods=365, freq='D')
df_predictions = pd.DataFrame(predicted_values, columns=target_columns, index=future_dates)

# Print sample output
print("Predicted Climate Conditions for the Next Year:")
print(df_predictions.head(10))  # Print first 10 days

# Save to CSV for analysis
df_predictions.to_csv("yearly_predictions.csv")
