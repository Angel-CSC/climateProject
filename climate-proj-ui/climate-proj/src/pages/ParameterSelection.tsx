import { useEffect, useState } from "react";
import Button from "../components/ui/button"; // Import your Button component
import { useCoords } from "./../components/CoordsContext";

const ParameterSelection = () => {
    // Pull coordinates from the context
    const { coords } = useCoords();
    const [time, setTime] = useState<string>("");
    const [parameter, setParameter] = useState<string>("");

    useEffect(() => {
        if(coords) {
            sendCoordsToBackend();
        }
    }, [coords])
    

    const setForecastParameters = () => {
        // send time, parameter, and coords to backend
        console.log("sending parameters to backend");
        // redirect to results page which should contain forecasted data from backend

    }

    const sendCoordsToBackend = async () => {
        try {
            const response = await fetch("http://0.0.0.0:8000/send-data/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                
                body: JSON.stringify(coords),
            });

            const data = await response.json();
            console.log("Backend response:", data);
        } catch (error) {
            console.error("Error sending coordinates:", error);
        }
    };

    // Log the coordinates to the console
    console.log("Here are the coordinates chosen:", coords);

    //button options for dynamic rendering - update as needed
    const timeOptions = [
        { name: "2026" },
        { name: "2027" },
        { name: "2028" },
        { name: "2030" },
        { name: "2035" },
    ];

    const parameterOptions = [
        { name: "Temperature" },
        { name: "Precipitation" },
        { name: "Wind Speed" },
        { name: "Radioactive Forcing" },
        { name: "Sea Level" },
    ];


    return (
        <div
            className="flex flex-col min-h-screen bg-gray-100 pb-6"
            style={{
                backgroundImage: 'url(/general-background.jpg)',
                backgroundSize: 'cover', 
                backgroundPosition: 'center 0%', 
                width: '100vw', 
                height: '100vh', 
                overflowX: 'hidden', 
            }}
        >
            <Button to="/map-page" className="mt-20 ml-4 max-w-16 border border-white text-white bg-transparent hover:bg-white/30">Back</Button>

            <div className="flex-1 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-white mb-2 mt-4">Now Choose Your Parameters!</h1>

                <h2 className="font-bold mb-4 text-white">How far into the future do you want to see?</h2>
                {/* time selection */}
                <div className="flex space-x-4 mb-8">
                    {timeOptions.map((option, index) => (
                        <Button key={index} 
                        onClick={() => setTime(option.name)}
                        className={`border border-white text-white bg-transparent hover:bg-white/30 w-32 h-12 transition-colors duration-200 ${time === option.name ? 'bg-white/60 border-2' : ''}`}>
                            {option.name}
                        </Button>
                    ))}  
                </div>

                <h2 className="font-bold mb-4 text-white">Which metric do you want forecasted?</h2>
                {/* parameter selection */}
                <div className="flex space-x-4">
                    {parameterOptions.map((option, index) => (
                        <Button key={index} 
                        onClick={() => setParameter(option.name)}
                        className={`border border-white text-white bg-transparent hover:bg-white/30 w-32 h-12 transition-colors duration-200 ${parameter === option.name ? 'bg-white/60 border-2' : ''}`}>
                            {option.name}
                        </Button>
                    ))}
                </div>

                <Button 
                onClick={() => setForecastParameters()}
                className="mt-4 text-sm bg-gradient-to-r from-primary to-accent hover:opacity-90 active:opacity-100 transition-opacity duration-200"
                to="/results">
                    Forecast!
                </Button>
            </div>
        </div>
    );
};


export default ParameterSelection;
