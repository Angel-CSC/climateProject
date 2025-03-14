from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:3000",  # React app URL during development
]

# Add CORS middleware to the app
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

str = "TRYING SHIT OUT WITH FAST API"

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.post("/send-data/")
def send_data():
    return {"received_name": str}

