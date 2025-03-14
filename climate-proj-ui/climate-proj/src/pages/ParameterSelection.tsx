import { useState } from "react";
import Button from "../components/ui/button"; // Import your Button component

const ParameterSelection = () => {
    return (
        <div
            className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pb-6"
            style={{
                backgroundImage: 'url(/general-background.jpg)',
                backgroundSize: 'cover', // Ensures the image covers the full screen without stretching
                backgroundPosition: 'center 0%', // Adjusts the vertical position of the background image
                width: '100vw', // Ensures the div takes the full viewport width
                height: '100vh', // Ensures the div takes the full viewport height
                overflowX: 'hidden', // Prevents horizontal scrolling
            }}
        >
            <h1 className="text-3xl font-bold text-white mb-2 mt-4">Now Choose Your Parameters!</h1>

            <h2 className="font-bold mb-4 text-white">How far into the future do you want to see?</h2>
            {/* Buttons under the first h2 */}
            <div className="flex space-x-4 mb-8">
                <Button className="border border-white text-white bg-transparent hover:bg-opacity-20 w-32 h-12">
                    6 Months
                </Button>
                <Button className="border border-white text-white bg-transparent hover:bg-opacity-20 w-32 h-12">
                    1 Year
                </Button>
                <Button className="border border-white text-white bg-transparent hover:bg-opacity-20 w-32 h-12">
                    5 Years
                </Button>
                <Button className="border border-white text-white bg-transparent hover:bg-opacity-20 w-32 h-12">
                    10 Years
                </Button>
            </div>

            <h2 className="font-bold mb-4 text-white">Which metric do you want forecasted?</h2>
            {/* Buttons under the second h2 */}
            <div className="flex space-x-4">
                <Button className="border border-white text-white bg-transparent hover:bg-opacity-20 w-32 h-12">
                    Temperature
                </Button>
                <Button className="border border-white text-white bg-transparent hover:bg-opacity-20 w-32 h-12">
                    Precipitation
                </Button>
                <Button className="border border-white text-white bg-transparent hover:bg-opacity-20 w-32 h-12">
                    Wind Speed
                </Button>
                <Button className="border border-white text-white bg-transparent hover:bg-opacity-20 w-32 h-12">
                    Radioactive Forcing
                </Button>
                <Button className="border border-white text-white bg-transparent hover:bg-opacity-20 w-32 h-12">
                    Sea Level
                </Button>
            </div>
        </div>
    );
};

export default ParameterSelection;
