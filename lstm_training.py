import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from get_functions import get_yearly

# Load data
data = get_yearly(51, 50)

# Define target columns
target_columns = ['temperature_2m', 'precipitation', 'rain', 'snowfall', 'pressure_msl']

# Function to create sequences
def create_sequences(data, seq_length=5):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length])
        y.append(data[i+seq_length])
    return np.array(X), np.array(y)

# Define sequence length
seq_length = 5  # Use 5 years of data to predict the next year

# Train a separate LSTM model for each column
for target_column in target_columns:
    print(f"\nTraining LSTM for: {target_column}")

    # Normalize data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data[[target_column]])

    # Create sequences
    X, y = create_sequences(scaled_data, seq_length)

    # Split data into training and testing sets
    train_size = int(len(X) * 0.8)
    X_train, y_train = X[:train_size], y[:train_size]
    X_test, y_test = X[train_size:], y[train_size:]

    # Reshape for LSTM input (samples, time steps, features)
    X_train = X_train.reshape(X_train.shape[0], X_train.shape[1], 1)
    X_test = X_test.reshape(X_test.shape[0], X_test.shape[1], 1)

    # Build LSTM model
    model = Sequential([
        LSTM(50, return_sequences=True, input_shape=(seq_length, 1)),
        LSTM(50, return_sequences=False),
        Dense(25, activation='relu'),
        Dense(1)
    ])

    model.compile(optimizer='adam', loss='mean_squared_error')

    # Train model
    model.fit(X_train, y_train, epochs=50, batch_size=1, validation_data=(X_test, y_test), verbose=0)

    # Predict
    y_pred = model.predict(X_test)
    y_pred = scaler.inverse_transform(y_pred)  # Convert back to original scale
    y_test = scaler.inverse_transform(y_test.reshape(-1, 1))  # Convert back

    # Plot results
    plt.figure(figsize=(10, 5))
    plt.plot(data['year'][-len(y_test):], y_test, label='Actual Data', color='blue')
    plt.plot(data['year'][-len(y_pred):], y_pred, label='LSTM Prediction', color='red', linestyle='dashed')
    plt.xlabel('Year')
    plt.ylabel(target_column)
    plt.title(f'LSTM Prediction for {target_column}')
    plt.legend()
    plt.grid()
    plt.show()
