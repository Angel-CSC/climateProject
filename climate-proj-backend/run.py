from fastapi import FastAPI, Body
from pydantic import BaseModel
from linear_training import train
#import uvicorn
from fastapi.middleware.cors import CORSMiddleware


#if __name__ == "__main__":
#    uvicorn.run("run:app", host="0.0.0.0", port=8000, reload=True)

app = FastAPI()

origins = [
    "http://localhost:3000",  # React app URL during development
    #"http://0.0.0.0:8000",    # Added 0.0.0.0 URL to allow requests from this address
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
    lat, long = coords["lat"], coords["long"]
    print(lat, long)
    value = train(lat, long)


    print("the plt might have been made")

    return {"received_name": coords}
