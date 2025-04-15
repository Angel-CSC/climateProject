from fastapi import FastAPI, Body
from pydantic import BaseModel
import sqlite3
import math
from fastapi.middleware.cors import CORSMiddleware
import joblib
import numpy as np
import io
import base64


#if __name__ == "__main__":
#    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True)

app = FastAPI()

origins = [
    "*"
]

print("running")


# Add CORS middleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Coordinates(BaseModel):
    lat: float
    long: float


@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}



@app.post("/send-data/")
def send_data(coords: dict = Body(...)):
    closest_coordinate = float('inf')

    hot_spots = [
        [-90 + row * 20, -180 + col * 36] 
        for row in range(10) 
        for col in range(10)
    ]

    closest_lat, closest_long = hot_spots[0][0], hot_spots[0][1]

    lat, long = float(coords["lat"]), float(coords["long"])

    for hot_spot in hot_spots:
        difference = math.sqrt((lat - hot_spot[0]) ** 2 + (long - hot_spot[1]) ** 2)
    
        if difference < closest_coordinate:
            closest_coordinate = difference
            closest_lat = hot_spot[0]
            closest_long = hot_spot[1]

    return {
        'difference': difference,
        'closest_lat': closest_lat,
        'closest_long': closest_long
    }




@app.post("/get-models/")
def send_models(coords: dict = Body(...)):
    closest_lat = coords["lat"]
    closest_long = coords["long"]
    temp_metrics = coords["metrics"]
    future_year = int(coords["year"])
    metrics = []

    print(f"the coords sent from the previous api point: {coords}")

    for metric in temp_metrics:
        metric = metric.lower()
        metrics.append(f"{metric}_model")
        metrics.append(f"{metric}_image")
    
    columns = ", ".join(metrics)
    print(columns)

    query = f"SELECT {columns} FROM models WHERE location_id = ?"

    conn = sqlite3.connect("./database.sqlite", check_same_thread=False)
    cur = conn.cursor()

    cur.execute(query, (f"{closest_lat}_{closest_long}",))
    result = cur.fetchone()

    conn.close()

    predicted_values = {}
    image_data = {}


    data = dict(zip(metrics, result)) if result else None

    for col in data.keys():
        print(f"type of {col}: {type(data[col])}")
    
    
    if data:
        for column in data.keys():
            if "model" in column:
                model_blob = data[column]
                model = joblib.load(io.BytesIO(model_blob))
                prediction = model.predict(np.array([[future_year]]))
                predicted_values[column] = prediction[0][0]
            elif "image" in column:
                image_blob = data[column]
                if image_blob:
                    # Convert binary image blob to base64 string
                    base64_image = base64.b64encode(image_blob).decode("utf-8")
                    image_data[column] = base64_image

    return {
        "predictions": predicted_values,
        "images": image_data
    }
