import { useState } from "react";

const MapComponent = () => {
    const [coords, setCoords] = useState({ lat: 0, lng: 0 });

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();

        // Adjust scaling to fit the image properly
        const x = ((event.clientX - left) / width) * 360 - 180; // Longitude
        const y = 90 - ((event.clientY - top) / height) * 180; // Latitude

        setCoords({ lat: y, lng: x });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Select a Location</h1>
            
            {/* Map Container with Controlled Scaling */}
            <div 
                className="relative w-[1000px] h-[600px] border border-gray-500 overflow-hidden"
                onMouseMove={handleMouseMove}
            >
                <img 
                    src="/map.png" // Ensure it's placed in /public
                    alt="World Map" 
                    className="w-full h-full object-fill"
                />
            </div>

            {/* Display Coordinates */}
            <p className="mt-4 text-lg">
                Longitude: {coords.lng.toFixed(2)}, Latitude: {coords.lat.toFixed(2)}
            </p>
        </div>
    );
};

export default MapComponent;
