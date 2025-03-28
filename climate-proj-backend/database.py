import sqlite3
import os
import joblib
import pickle
import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from get_functions import get_yearly

conn = sqlite3.connect("database.sqlite")
cursor = conn.cursor()

coordinates = [
    [-90 + row * 20, -180 + col * 36] 
    for row in range(10) 
    for col in range(10)
]

print(len(coordinates))

cursor.execute("""
    CREATE TABLE IF NOT EXISTS models (
        location_id TEXT PRIMARY KEY,      -- Concatenated lat_long string, e.g., "32.7767_-96.7970"
        precipitation_model BLOB,
        pressure_model BLOB,           
        rain_model BLOB,           
        snowfall_model BLOB,           
        temperature_model BLOB,
        precipitation_image BLOB,           
        pressure_image BLOB,           
        rain_image BLOB,           
        snowfall_image BLOB,           
        temperature_image BLOB,
        float1 REAL,           -- e.g., model coefficient or another metric
        float2 REAL            -- e.g., model intercept or another metric
    )
""")

conn.commit()

def retrieve_data(lat, long):
    """Retrieve models and images for a given location from the SQLite database.
       If the files already exist on disk, they won't be overwritten."""
    
    location_id = f"{lat}_{long}"
    
    # Define file paths for models and images
    prec_model_file = f"./models/retrieved_{location_id}_prec_model.pkl"
    press_model_file = f"./models/retrieved_{location_id}_press_model.pkl"
    rain_model_file = f"./models/retrieved_{location_id}_rain_model.pkl"
    snow_model_file = f"./models/retrieved_{location_id}_snow_model.pkl"
    temp_model_file = f"./models/retrieved_{location_id}_temp_model.pkl"
    prec_img_file = f"./plots/retrieved_{location_id}_prec_image.png"
    press_img_file = f"./plots/retrieved_{location_id}_press_image.png"
    rain_img_file = f"./plots/retrieved_{location_id}_rain_image.png"
    snow_img_file = f"./plots/retrieved_{location_id}_snow_image.png"
    temp_img_file = f"./plots/retrieved_{location_id}_temp_image.png"
    
    # If all files already exist, return their paths without re-writing
    if all(os.path.exists(f) for f in [prec_model_file, press_model_file, rain_model_file, 
                                        snow_model_file, temp_model_file, prec_img_file, 
                                        press_img_file, rain_img_file, snow_img_file, temp_img_file]):
        print(f"Files already exist for {location_id}.")
        return {
            "prec_model_file": prec_model_file,
            "press_model_file": press_model_file,
            "rain_model_file": rain_model_file,
            "snow_model_file": snow_model_file,
            "temp_model_file": temp_model_file,
            "prec_img_file": prec_img_file,
            "press_img_file": press_img_file,
            "rain_img_file": rain_img_file,
            "snow_img_file": snow_img_file,
            "temp_img_file": temp_img_file
        }
    
    # Otherwise, retrieve data from the database and create any missing files.
    cursor.execute("""
        SELECT 
            precipitation_model, pressure_model, rain_model, snowfall_model, temperature_model,
            precipitation_image, pressure_image, rain_image, snowfall_image, temperature_image,
            float1, float2
        FROM models
        WHERE location_id = ?
    """, (location_id,))
    
    record = cursor.fetchone()
    
    if record:
        (prec_model_blob, press_model_blob, rain_model_blob, snow_model_blob, temp_model_blob,
         prec_img_blob, press_img_blob, rain_img_blob, snow_img_blob, temp_img_blob,
         float1, float2) = record
        
        # Write out each file only if it doesn't exist
        if not os.path.exists(prec_model_file):
            with open(prec_model_file, "wb") as f:
                f.write(prec_model_blob)
        if not os.path.exists(press_model_file):
            with open(press_model_file, "wb") as f:
                f.write(press_model_blob)
        if not os.path.exists(rain_model_file):
            with open(rain_model_file, "wb") as f:
                f.write(rain_model_blob)
        if not os.path.exists(snow_model_file):
            with open(snow_model_file, "wb") as f:
                f.write(snow_model_blob)
        if not os.path.exists(temp_model_file):
            with open(temp_model_file, "wb") as f:
                f.write(temp_model_blob)
                
        if not os.path.exists(prec_img_file):
            with open(prec_img_file, "wb") as f:
                f.write(prec_img_blob)
        if not os.path.exists(press_img_file):
            with open(press_img_file, "wb") as f:
                f.write(press_img_blob)
        if not os.path.exists(rain_img_file):
            with open(rain_img_file, "wb") as f:
                f.write(rain_img_blob)
        if not os.path.exists(snow_img_file):
            with open(snow_img_file, "wb") as f:
                f.write(snow_img_blob)
        if not os.path.exists(temp_img_file):
            with open(temp_img_file, "wb") as f:
                f.write(temp_img_blob)
        
        print(f"Retrieved data for {location_id}: float1 = {float1}, float2 = {float2}")
        return {
            "prec_model_file": prec_model_file,
            "press_model_file": press_model_file,
            "rain_model_file": rain_model_file,
            "snow_model_file": snow_model_file,
            "temp_model_file": temp_model_file,
            "prec_img_file": prec_img_file,
            "press_img_file": press_img_file,
            "rain_img_file": rain_img_file,
            "snow_img_file": snow_img_file,
            "temp_img_file": temp_img_file,
            "float1": float1,
            "float2": float2
        }
    else:
        print("No data found for this location.")
        return None


'''
def retrieve_data(lat, long):
    """Retrieve models and images for a given location from the SQLite database."""
    
    location_id = f"{lat}_{long}"
    
    cursor.execute("""
        SELECT 
            precipitation_model, pressure_model, rain_model, snowfall_model, temperature_model,
            precipitation_image, pressure_image, rain_image, snowfall_image, temperature_image,
            float1, float2
        FROM models
        WHERE location_id = ?
    """, (location_id,))
    
    record = cursor.fetchone()

    
    if record:
        (prec_model_blob, press_model_blob, rain_model_blob, snow_model_blob, temp_model_blob,
         prec_img_blob, press_img_blob, rain_img_blob, snow_img_blob, temp_img_blob,
         float1, float2) = record
        
        # Write out each model file
        prec_model_file = f"retrieved_{location_id}_prec_model.pkl"
        with open(prec_model_file, "wb") as f:
            f.write(prec_model_blob)
        
        press_model_file = f"retrieved_{location_id}_press_model.pkl"
        with open(press_model_file, "wb") as f:
            f.write(press_model_blob)
        
        rain_model_file = f"retrieved_{location_id}_rain_model.pkl"
        with open(rain_model_file, "wb") as f:
            f.write(rain_model_blob)
        
        snow_model_file = f"retrieved_{location_id}_snow_model.pkl"
        with open(snow_model_file, "wb") as f:
            f.write(snow_model_blob)
        
        temp_model_file = f"retrieved_{location_id}_temp_model.pkl"
        with open(temp_model_file, "wb") as f:
            f.write(temp_model_blob)
        
        # Write out each image file
        prec_img_file = f"retrieved_{location_id}_prec_image.png"
        with open(prec_img_file, "wb") as f:
            f.write(prec_img_blob)
        
        press_img_file = f"retrieved_{location_id}_press_image.png"
        with open(press_img_file, "wb") as f:
            f.write(press_img_blob)
        
        rain_img_file = f"retrieved_{location_id}_rain_image.png"
        with open(rain_img_file, "wb") as f:
            f.write(rain_img_blob)
        
        snow_img_file = f"retrieved_{location_id}_snow_image.png"
        with open(snow_img_file, "wb") as f:
            f.write(snow_img_blob)
        
        temp_img_file = f"retrieved_{location_id}_temp_image.png"
        with open(temp_img_file, "wb") as f:
            f.write(temp_img_blob)
        
        print(f"Retrieved data for {location_id}: float1 = {float1}, float2 = {float2}")
        
        # Optionally, load a model (for example, the precipitation model) using joblib:
        # model = joblib.load(prec_model_file)
        # return model, float1, float2
        
        # For now, we return the file paths and metrics.
        return {
            "prec_model_file": prec_model_file,
            "press_model_file": press_model_file,
            "rain_model_file": rain_model_file,
            "snow_model_file": snow_model_file,
            "temp_model_file": temp_model_file,
            "prec_img_file": prec_img_file,
            "press_img_file": press_img_file,
            "rain_img_file": rain_img_file,
            "snow_img_file": snow_img_file,
            "temp_img_file": temp_img_file,
            "float1": float1,
            "float2": float2
        }
    else:
        print("No data found for this location.")
        return None'
'''



def store_data(
    lat, long,
    prec_model_path, press_model_path, rain_model_path, snow_model_path, temp_model_path,
    prec_img_path, press_img_path, rain_img_path, snow_img_path, temp_img_path,
    float1, float2
):
    """Store models and images for a given location into the SQLite database."""
    
    location_id = f"{lat}_{long}"
    
    # Read model files as binary
    with open(prec_model_path, "rb") as f:
        precipitation_model_blob = f.read()
    with open(press_model_path, "rb") as f:
        pressure_model_blob = f.read()
    with open(rain_model_path, "rb") as f:
        rain_model_blob = f.read()
    with open(snow_model_path, "rb") as f:
        snowfall_model_blob = f.read()
    with open(temp_model_path, "rb") as f:
        temperature_model_blob = f.read()
    
    # Read image files as binary
    with open(prec_img_path, "rb") as f:
        precipitation_image_blob = f.read()
    with open(press_img_path, "rb") as f:
        pressure_image_blob = f.read()
    with open(rain_img_path, "rb") as f:
        rain_image_blob = f.read()
    with open(snow_img_path, "rb") as f:
        snowfall_image_blob = f.read()
    with open(temp_img_path, "rb") as f:
        temperature_image_blob = f.read()
    
    # Insert or update the record in the table
    cursor.execute("""
        INSERT INTO models (
            location_id, 
            precipitation_model, pressure_model, rain_model, snowfall_model, temperature_model,
            precipitation_image, pressure_image, rain_image, snowfall_image, temperature_image,
            float1, float2
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(location_id) DO UPDATE SET 
            precipitation_model = excluded.precipitation_model,
            pressure_model = excluded.pressure_model,
            rain_model = excluded.rain_model,
            snowfall_model = excluded.snowfall_model,
            temperature_model = excluded.temperature_model,
            precipitation_image = excluded.precipitation_image,
            pressure_image = excluded.pressure_image,
            rain_image = excluded.rain_image,
            snowfall_image = excluded.snowfall_image,
            temperature_image = excluded.temperature_image,
            float1 = excluded.float1,
            float2 = excluded.float2
    """, (
        location_id, 
        precipitation_model_blob, pressure_model_blob, rain_model_blob, snowfall_model_blob, temperature_model_blob,
        precipitation_image_blob, pressure_image_blob, rain_image_blob, snowfall_image_blob, temperature_image_blob,
        float1, float2
    ))
    conn.commit()
    print(f"Data stored for {location_id}")




def train():
    print("inside the train un")
    i = 0
    while i < len(coordinates):

        lat, long = coordinates[i]

        if retrieve_data(lat, long) != None:
            i += 1
            continue

    
        try:
            data = get_yearly(lat, long)
            if data is None:
                print("No data retrieved for the given coordinates.")

            X = data[['year']].values
            variables = {
                'temperature_2m': 'temperature',
                'precipitation': 'precipitation',
                'rain': 'rain',
                'snowfall': 'snowfall',
                'pressure_msl': 'pressure'
            }

            model_files = {}
            image_files = {}

            for var, col_name in variables.items():
                y = data[var].values.reshape(-1, 1)
                model = LinearRegression()
                model.fit(X, y)
                y_pred = model.predict(X)

                model_path = f"./models/{col_name}_{lat}_{long}_model.pkl"
                image_path = f"./plots/{col_name}_{lat}_{long}_regression.png"

                joblib.dump(model, model_path)
                model_files[col_name] = model_path

                fig, ax = plt.subplots(figsize=(8, 6))
                ax.scatter(X, y, color='blue', label='Actual Data', alpha=0.5)
                ax.plot(X, y_pred, color='red', linewidth=2, label='Linear Fit')
                ax.set_xlabel('Year')
                ax.set_ylabel(var)
                ax.legend()
                ax.grid()
                plt.tight_layout()
                plt.savefig(image_path)
                plt.close()
                image_files[col_name] = image_path

            temp_model = joblib.load(model_files['temperature'])
            float1 = temp_model.coef_[0][0]
            float2 = temp_model.intercept_[0]

            store_data(
                lat, long,
                prec_model_path = model_files['precipitation'],
                press_model_path = model_files['pressure'],
                rain_model_path = model_files['rain'],
                snow_model_path = model_files['snowfall'],
                temp_model_path = model_files['temperature'],
                prec_img_path = image_files['precipitation'],
                press_img_path = image_files['pressure'],
                rain_img_path = image_files['rain'],
                snow_img_path = image_files['snowfall'],
                temp_img_path = image_files['temperature'],
                float1 = float1,
                float2 = float2
            )

            print("Models trained, plots generated, and all data stored in SQLite.")
            i += 1
        except Exception as e:
            print(e)


train()