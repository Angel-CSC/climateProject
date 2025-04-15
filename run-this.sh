#!/bin/bash

OS=$(uname)

if [[ "$OS" == "Darwin" ]]; then
    echo "Detected macOS"

    # Start FastAPI server in a new Terminal window
    osascript <<EOF
tell application "Terminal"
    do script "cd $(pwd)/climate-proj-backend; source .venv/bin/activate; fastapi run run.py"
end tell
EOF

    # Start React app in another new Terminal window
    osascript <<EOF
tell application "Terminal"
    do script "cd $(pwd)/climate-proj-ui/climate-proj; npm start"
end tell
EOF

elif [[ "$OS" == "MINGW"* || "$OS" == "MSYS"* ]]; then
    echo "Detected Windows (Git Bash)"
    
    # Git Bash workaround: Launch separate Git Bash windows using 'start'
    start "" "bash" -c "cd climate-proj-backend && source .venv/Scripts/activate && fastapi run run.py"
    start "" "bash" -c "cd climate-proj-ui/climate-proj && npm start"

else
    echo "Unsupported OS: $OS"
    exit 1
fi
