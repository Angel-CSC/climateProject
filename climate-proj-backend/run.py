from fastapi import FastAPI, Body
from pydantic import BaseModel
import math
from linear_training import train
#import uvicorn
from fastapi.middleware.cors import CORSMiddleware


#if __name__ == "__main__":
#    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True)

app = FastAPI()

origins = [
    "http://localhost:3002",  # React app URL during development
    "http://localhost:3001",  # React app URL during development
    "http://localhost:3000",
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

    print(f"coords: {coords}")
    lat, long = float(coords["lat"]), float(coords["long"])

    for hot_spot in hot_spots:
        difference = math.sqrt((lat - hot_spot[0]) ** 2 + (long - hot_spot[1]) ** 2)
    
        if difference < closest_coordinate:
            closest_coordinate = difference
            closest_lat = hot_spot[0]
            closest_long = hot_spot[1]

    return {"difference of closest coordinate": closest_coordinate,
            "lat": closest_lat,
            "long": closest_long}
