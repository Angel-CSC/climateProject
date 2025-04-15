import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import joblib
from sklearn.linear_model import LinearRegression
from get_functions import get_yearly

def train(lat, long):
    data = get_yearly(lat, long)

    if data is None:
        print("No data retrieved for the given coordinates.")
        return

    X = data[['year']].values
    columns = ['temperature_2m', 'precipitation', 'rain', 'snowfall', 'pressure_msl']
    models = {}

    for col in columns:
        y = data[col].values.reshape(-1, 1)
        model = LinearRegression()
        model.fit(X, y)
        y_pred = model.predict(X)
        models[col] = model
        joblib.dump(model, f"./models/{col}_linear_model.pkl")

        # Create a separate figure for each model
        fig, ax = plt.subplots(figsize=(8, 6))
        ax.scatter(X, y, color='blue', label='Actual Data', alpha=0.5)
        ax.plot(X, y_pred, color='red', linewidth=2, label='Linear Fit')
        ax.set_ylabel(col)
        ax.set_xlabel('Year')
        ax.legend()
        ax.grid()
        plt.tight_layout()
        plt.savefig(f"./plots/{col}_linear_regression.png")
        plt.close()

    print("Models saved and individual plots generated successfully.")
