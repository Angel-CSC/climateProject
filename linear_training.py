import pandas as pd
from sklearn.linear_model import LinearRegression, LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, accuracy_score, log_loss
import numpy as np
import matplotlib.pyplot as plt
from main import get_data


# Get lat/lon and fetch data
data = get_data(51, 50)
data.dropna(inplace=True)

target_columns = ['temperature_2m', 'precipitation', 'rain', 'snowfall', 'pressure_msl']

# Normalize data
scaler = MinMaxScaler()
data[target_columns] = scaler.fit_transform(data[target_columns])
joblib.dump(scaler, "scaler.pkl")