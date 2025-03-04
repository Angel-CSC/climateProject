import numpy as np
import matplotlib.pyplot as plt
import joblib  # To save and load models
from sklearn.linear_model import LinearRegression
from get_functions import get_yearly

# Load data
data = get_yearly(32.850165, -96.627178)

# Extract year and target variables
X = data[['year']].values  # Feature (independent variable)
columns = ['temperature_2m', 'precipitation', 'rain', 'snowfall', 'pressure_msl']

# Dictionary to store trained models
models = {}

# Initialize plot
fig, axes = plt.subplots(len(columns), 1, figsize=(8, 12), sharex=True)

# Train and store models
for i, col in enumerate(columns):
    y = data[col].values.reshape(-1, 1)  # Target (dependent variable)

    # Train linear regression model
    model = LinearRegression()
    model.fit(X, y)
    y_pred = model.predict(X)

    # Store the trained model
    models[col] = model
    joblib.dump(model, f"./models/{col}_linear_model.pkl")  # Save model to a file

    # Plot actual data and regression line
    axes[i].scatter(X, y, color='blue', label='Actual Data', alpha=0.5)
    axes[i].plot(X, y_pred, color='red', linewidth=2, label='Linear Fit')
    axes[i].set_ylabel(col)
    axes[i].legend()
    axes[i].grid()

axes[-1].set_xlabel('Year')
plt.tight_layout()
plt.show()

print("Models saved successfully.")
