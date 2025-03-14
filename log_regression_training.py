import numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from get_functions import get_yearly

# Load data
data = get_yearly(75.525547, -43.453885)

# Extract year and target variables
X = data[['year']].values  # Feature (independent variable)
X_log = np.log(X)  # Apply logarithmic transformation to X

columns = ['temperature_2m', 'precipitation', 'rain', 'snowfall', 'pressure_msl']

# Initialize plot
fig, axes = plt.subplots(len(columns), 1, figsize=(8, 12), sharex=True)

# Train and plot regression for each column
for i, col in enumerate(columns):
    y = data[col].values.reshape(-1, 1)  # Target (dependent variable)

    # Train logarithmic regression model
    model = LinearRegression()
    model.fit(X_log, y)  # Fit model using log-transformed X
    y_pred = model.predict(X_log)

    # Plot actual data and regression curve
    axes[i].scatter(X, y, color='blue', label='Actual Data', alpha=0.5)
    axes[i].plot(X, y_pred, color='red', linewidth=2, label='Logarithmic Fit')
    axes[i].set_ylabel(col)
    axes[i].legend()
    axes[i].grid()

axes[-1].set_xlabel('Year')
plt.tight_layout()
plt.show()
