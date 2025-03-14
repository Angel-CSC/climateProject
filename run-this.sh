# Navigate to FastAPI project and start the API
echo "Starting FastAPI server..."
cd climate-proj-backend || exit 1  
source .venv/bin/activate 
uvicorn run:app --reload --host 0.0.0.0 --port 8000 & 

cd ".."

# Navigate to React project and start React server
echo "Starting React app..."
cd climate-proj-ui/climate-proj
npm start

wait
