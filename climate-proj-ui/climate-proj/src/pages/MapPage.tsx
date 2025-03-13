import { useState } from "react";

const MapSelection = () => {
    const [coords, setCoords] = useState({ x: 0, y: 0 });

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const { left, top, width, height } = event.currentTarget.getBoundingClientRect();
        const x = ((event.clientX - left) / width) * 360 - 180; // Convert to longitude
        const y = 90 - ((event.clientY - top) / height) * 180; // Convert to latitude
        setCoords({ x, y });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-2xl font-bold mb-4">Select a Location</h1>
            <div 
                className="relative w-[600px] h-[400px] border border-gray-500" 
                onMouseMove={handleMouseMove}
            >
                <img 
                    src="/map.png" // Replace with your map image
                    alt="Map" 
                    className="w-full h-full object-cover"
                />
            </div>
            <p className="mt-4 text-lg">Longitude: {coords.x.toFixed(2)}, Latitude: {coords.y.toFixed(2)}</p>
        </div>
    );
};

export default MapSelection;
