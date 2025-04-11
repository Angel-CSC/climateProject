import React, { useState } from "react";
import { useCoords } from "./../components/CoordsContext";
import Button from "../components/ui/button";

const MapComponent = () => {
    const { coords, setCoords } = useCoords();
    const [buttonVisible, setButtonVisible] = useState(false);

    const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();

        const x = ((event.clientX - left) / width) * 360 - 180;
        const y = 90 - ((event.clientY - top) / height) * 180;

        setCoords({ lat: y, long: x });
        console.log("the coords got labeled in context file")
        setButtonVisible(true);
    };

    const handleNext = async () => {
        try {
            console.log(JSON.stringify({
              ...coords,
            }))
            const response = await fetch("http://localhost:8000/send-data/", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...coords,
              }),
            });
            const data = await response.json();
            console.log("Backend response:", data);
          } catch (error) {
            console.error("Error sending data:", error);
          }
    }

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 overflow-y-auto pb-6"
            style={{ 
                backgroundImage: 'url(/general-background.jpg)', 
                backgroundSize: 'cover',
                backgroundPosition: 'center 0%',
                backgroundAttachment: 'fixed',
                width: '100vw',
                overflowX: 'hidden',
                paddingTop: '6rem'
            }}
        >
            <h1 className="text-2xl font-bold mb-4 text-white">Select A Location By Clicking Anywhere On The Map!</h1>

            <div 
                className="relative w-[1000px] h-[600px] border border-gray-500 overflow-hidden cursor-pointer"
                onClick={handleMapClick}
            >
                <img 
                    src="/map.png" 
                    alt="World Map" 
                    className="w-full h-full object-fill"
                />
            
                {coords && (
                    <div
                        className="absolute w-10 h-10 bg-red-500 rounded-full border-2 border-white"
                        style={{
                            top: `${((90 - coords.lat) / 180) * 100}%`,
                            left: `${((coords.long + 180) / 360) * 100}%`,
                            transform: "translate(-50%, -50%)",
                            backgroundImage: 'url(/anthonytran.jpg)',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    />
                )}
            </div>

            {coords && (
                <p className="mt-4 text-lg text-white">
                    Selected: Longitude {coords.long.toFixed(2)}, Latitude {coords.lat.toFixed(2)}
                </p>
            )}

            {buttonVisible && (
                <div onClick={handleNext}>
                    <Button 
                        to="/parameter-page"
                        variant="bg-gradient-to-r from-primary to-accent"
                        className="text-sm hover:opacity-90 mt-6 w-60 h-12 flex items-center justify-center"
                        
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
};

export default MapComponent;