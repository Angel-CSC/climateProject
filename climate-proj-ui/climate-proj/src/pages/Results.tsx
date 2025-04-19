import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from "../components/ui/button";
import { useNavigate, useLocation } from 'react-router-dom';

type ChartDataPoint = {
    year: number;
    [key: string]: number;
};

type ApiResponse = {
    predictions: {
        [key: string]: number;
    };
    images: {
        [key: string]: string;
    };
};

const Results = () => {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const location = useLocation();
    const currentYear = 2025;

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);

                console.log("All session storage items:");
                for (let i = 0; i < sessionStorage.length; i++) {
                    const key = sessionStorage.key(i);
                    if (key) {
                        console.log(`${key}: ${sessionStorage.getItem(key)}`);
                    }
                }

                const stateParams = location.state as {
                    lat?: number,
                    long?: number,
                    year?: number,
                    metrics?: string[]
                } | null;

                const lat = stateParams?.lat?.toString() ||
                    sessionStorage.getItem('lat');

                const long = stateParams?.long?.toString() ||
                    sessionStorage.getItem('long');

                const year = stateParams?.year?.toString() ||
                    sessionStorage.getItem('year') ||
                    '2050';

                let metrics: string[] = stateParams?.metrics || ['Temperature']; // Default value

                if (!lat || !long) {
                    throw new Error('Missing location parameters');
                }

                if (!stateParams?.metrics) {
                    const metricsString = sessionStorage.getItem('metrics');
                    if (metricsString) {
                        try {
                            const parsedMetrics = JSON.parse(metricsString);
                            if (Array.isArray(parsedMetrics)) {
                                metrics = parsedMetrics;
                            }
                        } catch (e) {
                            console.warn('Error parsing metrics, using default', e);
                        }
                    }
                }

                console.log("Using parameters:", {
                    lat: parseFloat(lat),
                    long: parseFloat(long),
                    metrics,
                    year: parseInt(year)
                });

                const currentYearResponse = await fetch('http://localhost:8000/get-models/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        lat: parseFloat(lat),
                        long: parseFloat(long),
                        metrics: metrics.map(m => m.toLowerCase()),
                        year: currentYear
                    }),
                });

                if (!currentYearResponse.ok) {
                    const errorText = await currentYearResponse.text();
                    throw new Error(`API error for current year (${currentYearResponse.status}): ${errorText}`);
                }

                const currentYearResult: ApiResponse = await currentYearResponse.json();
                console.log("Current year API response:", currentYearResult);

                const futureResponse = await fetch('http://localhost:8000/get-models/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        lat: parseFloat(lat),
                        long: parseFloat(long),
                        metrics: metrics.map(m => m.toLowerCase()),
                        year: parseInt(year)
                    }),
                });

                if (!futureResponse.ok) {
                    const errorText = await futureResponse.text();
                    throw new Error(`API error for future year (${futureResponse.status}): ${errorText}`);
                }

                const futureResult: ApiResponse = await futureResponse.json();
                console.log("Future year API response:", futureResult);

                if (!currentYearResult.predictions || Object.keys(currentYearResult.predictions).length === 0) {
                    throw new Error('No current year prediction data received');
                }

                if (!futureResult.predictions || Object.keys(futureResult.predictions).length === 0) {
                    throw new Error('No future prediction data received');
                }

                const formattedData: ChartDataPoint[] = [];

                const currentData: ChartDataPoint = { year: currentYear };

                const futureData: ChartDataPoint = { year: parseInt(year) };

                Object.entries(currentYearResult.predictions).forEach(([key, value]) => {
                    const metricName = key.replace('_model', '');
                    currentData[metricName] = value; // Use actual value from API
                });

                Object.entries(futureResult.predictions).forEach(([key, value]) => {
                    const metricName = key.replace('_model', '');
                    futureData[metricName] = value;
                });

                formattedData.push(currentData, futureData);
                setChartData(formattedData);

                console.log("Formatted chart data:", formattedData);
            } catch (err) {
                console.error('Error fetching data:', err);
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [location]);

    const getDataKey = (): string => {
        if (chartData.length > 0) {
            const keys = Object.keys(chartData[0]).filter(key => key !== 'year');
            return keys.length > 0 ? keys[0] : 'temperature';
        }
        return 'temperature';
    };

    const handleBackClick = () => {
        navigate('/parameter-page');
    };

    return (
        <div
            className="flex flex-col min-h-screen bg-gray-100 pb-6"
            style={{
                backgroundImage: 'url(/general-background.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center 0%',
                width: '100vw',
                height: '100vh',
                overflowX: 'hidden',
            }}
        >
            <Button
                onClick={handleBackClick}
                className="mt-20 ml-4 max-w-16 border border-white text-white bg-transparent hover:bg-white/30"
            >
                Back
            </Button>

            <div className="flex-1 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-white mb-8">Climate Prediction Results</h1>

                <div className="w-full max-w-3xl bg-white rounded-xl shadow-lg p-4">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-lg">Loading prediction data...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center h-64 p-6">
                            <p className="text-lg text-red-500 mb-4">Error: {error}</p>
                            <p className="text-gray-700">Please go back to the parameters page and ensure all required fields are filled out correctly.</p>
                            <Button
                                onClick={() => navigate('/parameter-page')}
                                className="mt-6 bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Return to Parameters
                            </Button>
                        </div>
                    ) : (
                        <div className="h-96">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="year"
                                        label={{
                                            value: "Year",
                                            position: "insideBottom",
                                            offset: -10
                                        }}
                                    />
                                    <YAxis
                                        label={{
                                            value: getDataKey().charAt(0).toUpperCase() + getDataKey().slice(1),
                                            angle: -90,
                                            position: "insideLeft",
                                            offset: 10
                                        }}
                                    />
                                    <Tooltip />
                                    <Bar dataKey={getDataKey()} fill="#3182ce" name={getDataKey().charAt(0).toUpperCase() + getDataKey().slice(1)} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;
