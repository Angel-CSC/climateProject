import { useState, useEffect } from "react";
import { useCoords } from "./../components/CoordsContext";
import { Link } from "react-router";
import Button from "../components/ui/button";

const ParameterSelection = () => {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [year, setYear] = useState("2026");
  const [debouncedYear, setDebouncedYear] = useState("");

  const handleSubmit = () => {

  };

  const toggleMetric = (option: string) => {
    setSelectedMetrics((prev) =>
      prev.includes(option)
        ? prev.filter((metric) => metric !== option)
        : [...prev, option]
    );
  };

  const metricOptions = [
    "Temperature",
    "Precipitation",
    "Wind Speed",
    "Radioactive Forcing",
    "Sea Level",
  ];

  // Debounce effect for year input
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
        <h1 className="text-3xl font-bold text-white mb-2 mt-4">
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
        <Link to="/results">
          <button
            className="border border-white text-white bg-green-600 w-32 h-12"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </Link>
      </div>
      
        
    </div>
  );
};

export default ParameterSelection;
