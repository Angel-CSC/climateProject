import { useState } from "react";
import Button from "../components/ui/button"; // Import your Button component

const MapComponent = () => {
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [buttonVisible, setButtonVisible] = useState(false);

    const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();

        // Convert click position to longitude and latitude
        const x = ((event.clientX - left) / width) * 360 - 180; // Longitude
        const y = 90 - ((event.clientY - top) / height) * 180; // Latitude

        setCoords({ lat: y, lng: x });
        setButtonVisible(true); // Show the "Next" button
    };

    return (
        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 overflow-y-auto pb-6"
        style={{ 
            backgroundImage: 'url(/general-background.jpg)', 
            backgroundSize: 'cover',  // Ensures the image covers the full screen without stretching
            backgroundPosition: 'center 0%',  // Adjusts the vertical position of the background image
            backgroundAttachment: 'fixed',
            width: '100vw',  // Ensures the div takes the full viewport width
            overflowX: 'hidden',  // Prevents horizontal scrolling
            paddingTop: '6rem'
        }}
        >
            <h1 className="text-2xl font-bold mb-4 text-white">Select A Location By Clicking Anywhere On The Map!</h1>

            {/* Map Container */}
            <div 
                className="relative w-[1000px] h-[600px] border border-gray-500 overflow-hidden cursor-pointer"
                onClick={handleMapClick}
            >
                <img 
                    src="/map.png" 
                    alt="World Map" 
                    className="w-full h-full object-fill"
                />
                
                {/* Clicked Coordinates Indicator */}
                {coords && (
                    <div
                        className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white"
                        style={{
                            top: `${((90 - coords.lat) / 180) * 100}%`,
                            left: `${((coords.lng + 180) / 360) * 100}%`,
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                )}
            </div>

            {/* Show Coordinates */}
            {coords && (
                <p className="mt-4 text-lg text-white">
                    Selected: Longitude {coords.lng.toFixed(2)}, Latitude {coords.lat.toFixed(2)}
                </p>
            )}

            {/* Show "Next" Button with Custom Styling */}
            {buttonVisible && (
                <Button 
                    to="/parameter-page" // Replace with your actual next page path
                    variant="bg-gradient-to-r from-primary to-accent"
                    className="text-sm hover:opacity-90 mt-6 w-60 h-12 flex items-center justify-center"
                >
                    Next
                </Button>
            )}
        </div>
    );
};

export default MapComponent;
