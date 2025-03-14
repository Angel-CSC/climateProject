from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

str = "TRYING SHIT OUT WITH FAST API"

@app.get("/")
def read_root():
    return {"message": "Hello from FastAPI!"}

@app.post("/send-data/")
def send_data():
    return {"received_name": str}

# Run server with: uvicorn main:app --reload

