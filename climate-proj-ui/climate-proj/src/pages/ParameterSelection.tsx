import { useEffect, useState } from "react";
import Button from "../components/ui/button";
import { useCoords } from "./../components/CoordsContext";

const ParameterSelection = () => {
  const { coords } = useCoords();
  const [selectedMetric, setSelectedMetric] = useState("");
  const [year, setYear] = useState("");

  useEffect(() => {
    if (coords) {
      sendCoordsToBackend();
    }
  }, [coords, year]);

  const sendCoordsToBackend = async () => {
    try {
      const response = await fetch("http://0.0.0.0:8000/send-data/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ ...coords, year })
      });
      const data = await response.json();
      console.log("Backend response:", data);
    } catch (error) {
      console.error("Error sending coordinates:", error);
    }
  };

  const getBackendInfomation = async () => {
    try {
        const response = await fetch("http://0.0.0.0:8000/get_data", {
          method: "GET",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ ...coords, year })
        });
        const data = await response.json();
        console.log("Backend response:", data);
      } catch (error) {
        console.error("Error sending coordinates:", error);
      }
  }

  const metricOptions = ["Temperature", "Precipitation", "Wind Speed", "Radioactive Forcing", "Sea Level"];

  const getMetricButtonClass = (option) =>
    selectedMetric === option
      ? "border border-white text-white bg-blue-600 w-32 h-12"
      : "border border-white text-white bg-transparent hover:bg-opacity-20 w-32 h-12";

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen bg-gray-100 pb-6"
      style={{
        backgroundImage: 'url(/general-background.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center 0%',
        width: '100vw',
        height: '100vh',
        overflowX: 'hidden'
      }}
    >
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
        Which metric do you want forecasted?
      </h2>
      <div className="flex space-x-4">
        {metricOptions.map((option) => (
          <Button
            key={option}
            className={getMetricButtonClass(option)}
            onClick={() => setSelectedMetric(option)}
          >
            {option}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default ParameterSelection;
