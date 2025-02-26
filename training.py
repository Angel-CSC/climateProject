import numpy as np
import pandas as pd
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import EarlyStopping
from sklearn.preprocessing import MinMaxScaler
import joblib
from main import get_data



# Get lat/lon and fetch data
data = get_data(51, 50)
data.dropna(inplace=True)

target_columns = ['temperature_2m', 'precipitation', 'rain', 'snowfall', 'pressure_msl']

# Normalize data
scaler = MinMaxScaler()
data[target_columns] = scaler.fit_transform(data[target_columns])
joblib.dump(scaler, "scaler.pkl")  # Save scaler for later use

# Prepare sequence data
sequence_length = 6
features = len(target_columns)

def create_sequences(data, seq_length):
    X, y = [], []
    for i in range(len(data) - seq_length):
        X.append(data[i:i+seq_length])
        y.append(data[i+seq_length])
    return np.array(X), np.array(y)

X, y = create_sequences(data[target_columns].values, sequence_length)

# Split data (80% train, 20% test)
split = int(0.8 * len(X))
X_train, X_test = X[:split], X[split:]
y_train, y_test = y[:split], y[split:]

# Build efficient LSTM model
model = Sequential([
    LSTM(32, activation="relu", return_sequences=False, input_shape=(sequence_length, features), unroll=True),
    Dense(16, activation='relu'),
    Dense(features)  # Predict all features
])

model.compile(optimizer='adam', loss='mse')

early_stopping = EarlyStopping(monitor='val_loss', patience=2, restore_best_weights=True)

# Train fast with optimized settings
model.fit(X_train, y_train, epochs=5, batch_size=128, validation_data=(X_test, y_test),
          callbacks=[early_stopping], verbose=1)

# Save model for deployment
model.save("climate_model.h5")
