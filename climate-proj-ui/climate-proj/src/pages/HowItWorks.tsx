import { Link } from "react-router-dom";
import Button from "../components/ui/button";

const HowItWorks = () => {
    return (
      <div 
        className="flex flex-col items-center justify-start min-h-screen w-full text-gray-900"
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
        <h1 className="text-4xl font-bold mb-4 text-white pb-4">A long time ago in a galaxy far, far away...</h1>
        <p className="text-lg text-white mb-10 text-center px-6 sm:px-12 md:px-20 lg:px-42">
        Our project leverages historical weather data dating back to 1940 to train advanced <br></br>
        AI models. This extensive dataset allows us to build highly accurate predictions about <br></br>
        future weather patterns. By analyzing decades of weather information, our models learn <br></br>
        complex trends and correlations that help forecast various meteorological factors such as <br></br>
        temperature, precipitation, and wind speed.
        </p>
        
        {/* Link to the GetStarted component */}
        <Link to="/">
          <Button className="text-sm bg-gradient-to-r from-primary to-accent hover:opacity-90">
            Back to Home
          </Button>
        </Link>
      </div>
    );
};

export default HowItWorks;
