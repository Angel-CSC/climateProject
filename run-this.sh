#!/bin/bash

# Navigate to FastAPI project and start the API
echo "Starting FastAPI server..."
cd /climate-proj-backend || exit 1  # Change to backend directory
source venv/bin/activate  # Activate virtual environment (if used)
uvicorn run:app --reload --host 0.0.0.0 --port 8000 &  # Make sure "run.py" contains "app = FastAPI()"

# Navigate to React project and start React server
echo "Starting React app..."
cd /climate-proj-ui/climate-proj
npm start

# Wait to keep the script running
wait
