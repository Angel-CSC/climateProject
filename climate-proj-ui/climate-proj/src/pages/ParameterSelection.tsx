import { useState, useEffect } from "react";
import { useCoords } from "./../components/CoordsContext";
import Button from "../components/ui/button";
import { useNavigate } from "react-router-dom";

const ParameterSelection = () => {
  const { coords } = useCoords();
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [year, setYear] = useState("");
  const [debouncedYear, setDebouncedYear] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const metricOptions = [
    "Temperature",
    "Precipitation",
    "Wind Speed",
    "Radioactive Forcing",
    "Sea Level",
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedYear(year);
    }, 500);
    return () => clearTimeout(handler);
  }, [year]);



  const getMetricButtonClass = (option: string) =>
    selectedMetrics.includes(option)
      ? "border border-white text-white bg-blue-600 w-32 h-12"
      : "border border-white text-white bg-transparent hover:bg-opacity-20 w-32 h-12";

      const toggleMetric = (option: string) => {
        setSelectedMetrics((prev) =>
          prev.includes(option)
            ? prev.filter((metric) => metric !== option)
            : [...prev, option]
        );
      };
    
      const handleSubmit = async () => {
        if (!coords) {
          console.error("Coordinates are not available.");
          setError("Coordinates are not available");
          return;
        }
        if (!debouncedYear) {
          console.error("Year is not provided.");
          setError("Year is not provided.");
          return;
        }
        if (selectedMetrics.length === 0) {
          console.error("No metrics are selected.");
          setError("No metrics are selected.");
          return;
        }
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
    
        console.log(`current year: ${currentYear}`)
        console.log(`debouncedYear: ${parseInt(debouncedYear)}`)
        if(parseInt(debouncedYear) < currentYear){
          console.error("Must select a year after the current date");
          setError("Must select a year after the current date");
          return;
        }
    
        try {
          console.log(JSON.stringify({
            ...coords,
            year: debouncedYear,
            metrics: selectedMetrics,
          }))
          const response = await fetch("http://localhost:8000/send-data/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...coords,
              year: debouncedYear,
              metrics: selectedMetrics,
            }),
          });
          
          const data = await response.json();
          console.log("Backend response:", data);
          navigate("/results");
        } catch (error) {
          console.error("Error sending data:", error);
        }
      };

  return (
    <div
      className="flex flex-col min-h-screen bg-gray-100 pb-6"
      style={{
        backgroundImage: "url(/general-background.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center 0%",
        width: "100vw",
        height: "100vh",
        overflowX: "hidden",
      }}
    >
      <Button to="/map-page" className="mt-20 ml-4 max-w-16 border border-white text-white bg-transparent hover:bg-white/30">Back</Button>
      <div className="flex-1 flex flex-col items-center justify-center">
        <p className="text-red-500 mt-2 text-2xl">{error}</p>
        <h1 className="text-3xl font-bold text-white mb-2 mt-2">
          Now Choose Your Parameters!
        </h1>
        <h2 className="font-bold mb-4 text-white">
          Enter the year for the forecast:
        </h2>
        <div className="mb-8">
          <input
            type="number"
            placeholder="Enter year"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="border border-gray-300 p-2 rounded"
          />
        </div>
        <h2 className="font-bold mb-4 text-white">
          Which metrics do you want forecasted? (Select one or more)
        </h2>
        <div className="flex space-x-4 mb-8">
          {metricOptions.map((option) => (
            <button
              key={option}
              className={getMetricButtonClass(option)}
              onClick={() => toggleMetric(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <button
          className="border border-white text-white bg-green-600 w-32 h-12"
          onClick={handleSubmit}
        >
          Submit
        </button>
      </div>
      
        
    </div>
  );
};

export default ParameterSelection;
