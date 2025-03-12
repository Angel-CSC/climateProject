const Home = () => {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-gray-900 px-80">
        <h1 className="text-4xl font-bold mb-4">Forecast Climate Change</h1>
        <p className="text-lg text-gray-700 mb-6">
        Welcome to our climate change forecasting tool! 

This tool allows users to see what climate change will look like in the future. Users can select latitude/longitude, a weather parameter, 
and how long in the future they want to see the parameter forecasted.
We hope to spread awareness of the impact that climate change will 
have in order to empower our users to be proactive about the impending shifts in climate
Click the button below to see our forecasts!
        </p>
        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Get Started
        </button>
      </div>
    );
  };
  
  export default Home;
  