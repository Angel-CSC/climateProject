import { Link } from "react-router-dom";
import Button from "../components/ui/button";

const Home = () => {
    return (
      <div 
        className="flex flex-col items-center justify-start min-h-screen w-full text-gray-900"
        style={{ 
          backgroundImage: 'url(/homepage-background.jpg)', 
          backgroundSize: 'cover',  // Ensures the image covers the full screen without stretching
          backgroundPosition: 'center 0%',  // Adjusts the vertical position of the background image
          width: '100vw',  // Ensures the div takes the full viewport width
          height: '100vh',  // Ensures the div takes the full viewport height
          overflowX: 'hidden',  // Prevents horizontal scrolling
          paddingTop: '6rem'
        }}
      >
        <h1 className="text-4xl font-bold mb-4 text-white">ANTHONY TRAN IS NOT GRADUATING</h1>
        <p className="text-lg text-white mb-4 text-center px-6 sm:px-12 md:px-20 lg:px-42">
          Welcome to our climate change forecasting tool! <br /><br />
          This tool allows users to see what climate change will look like in the future...
          We hope to spread awareness of the impact that climate change will 
          have in order to empower our users to be proactive about the impending shifts in climate.  
          Click the button below to see our forecasts!
        </p>
        
        {/* Link to the GetStarted component */}
        <Link to="/map-page">
          <Button className="text-sm bg-gradient-to-r from-primary to-accent hover:opacity-90">
            Get Started
          </Button>
        </Link>
      </div>
    );
};

export default Home;
