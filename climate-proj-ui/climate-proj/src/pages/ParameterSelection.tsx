import { useState } from "react";
import Button from "../components/ui/button"; // Import your Button component

const ParameterSelection = () => {


    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
        style={{ 
            backgroundImage: 'url(/general-background.jpg)', 
            backgroundSize: 'cover',  // Ensures the image covers the full screen without stretching
            backgroundPosition: 'center 0%',  // Adjusts the vertical position of the background image
            width: '100vw',  // Ensures the div takes the full viewport width
            height: '100vh',  // Ensures the div takes the full viewport height
            overflowX: 'hidden',  // Prevents horizontal scrolling
            paddingTop: '6rem'
          }}
          >
            <h1 className="text-3xl font-bold mb-2 text-white">Now Choose Your Parameters!</h1>
            <h2 className="font-bold mb-4 text-white">How far into the future do you want to see?</h2>
            <h2 className="font-bold mb-4 text-white">Which metric do you want forecasted?</h2>

        </div>
    );
};

export default ParameterSelection;
