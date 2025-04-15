# Navigate to FastAPI project and start the API
echo "Starting FastAPI server..."
cd climate-proj-backend || exit 1  
source .venv/bin/activate 
fastapi run run.py

cd ".."

# Navigate to React project and start React server
echo "Starting React app..."
cd climate-proj-ui/climate-proj
npm start

wait
