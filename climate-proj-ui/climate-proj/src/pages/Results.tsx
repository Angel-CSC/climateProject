import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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

const metricColors = {
    temperature: '#3182ce', // blue
    precipitation: '#2ca02c', // green
    pressure: '#ff7f0e',    // orange
    rain: '#9467bd',        // purple
    snowfall: '#e3343a'     // red
};

const Results = () => {
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
    const [displayedMetrics, setDisplayedMetrics] = useState<string[]>([]);
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

                const currentYearData: { [key: string]: number } = {};
                const futureYearData: { [key: string]: number } = {};
                const metricsToDisplay: string[] = [];

                for (const metric of metrics) {
                    const metricLower = metric.toLowerCase();

                    const currentYearResponse = await fetch('http://localhost:8000/get-models/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            lat: parseFloat(lat),
                            long: parseFloat(long),
                            metrics: [metricLower],
                            year: currentYear
                        }),
                    });

                    if (!currentYearResponse.ok) {
                        console.warn(`API error for current year metric ${metric}: ${currentYearResponse.status}`);
                        continue;
                    }

                    const currentYearResult: ApiResponse = await currentYearResponse.json();
                    console.log(`Current year API response for ${metric}:`, currentYearResult);

                    const futureResponse = await fetch('http://localhost:8000/get-models/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            lat: parseFloat(lat),
                            long: parseFloat(long),
                            metrics: [metricLower],
                            year: parseInt(year)
                        }),
                    });

                    if (!futureResponse.ok) {
                        console.warn(`API error for future year metric ${metric}: ${futureResponse.status}`);
                        continue;
                    }

                    const futureResult: ApiResponse = await futureResponse.json();
                    console.log(`Future year API response for ${metric}:`, futureResult);

                    const metricModelKey = `${metricLower}_model`;

                    if (currentYearResult.predictions &&
                        futureResult.predictions &&
                        currentYearResult.predictions[metricModelKey] !== undefined &&
                        futureResult.predictions[metricModelKey] !== undefined) {

                        currentYearData[metricLower] = currentYearResult.predictions[metricModelKey];
                        futureYearData[metricLower] = futureResult.predictions[metricModelKey];
                        metricsToDisplay.push(metricLower);
                    }
                }

                if (metricsToDisplay.length === 0) {
                    throw new Error('No valid prediction data received for any selected metrics');
                }

                const formattedData: ChartDataPoint[] = [
                    { year: currentYear, ...currentYearData },
                    { year: parseInt(year), ...futureYearData }
                ];

                setChartData(formattedData);
                setDisplayedMetrics(metricsToDisplay);

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

    const handleBackClick = () => {
        navigate('/parameter-page');
    };

    const capitalizeFirstLetter = (string: string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const getMetricColor = (metric: string): string => {
        return metricColors[metric as keyof typeof metricColors] || '#8884d8';
    };

    const hasValidData = chartData.length > 0 && displayedMetrics.length > 0;

    const chartHeight = Math.max(350, 80 * displayedMetrics.length + 250);

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
                    ) : !hasValidData ? (
                        <div className="flex flex-col items-center justify-center h-64 p-6">
                            <p className="text-lg text-yellow-500 mb-4">No valid data received for the selected metrics</p>
                            <p className="text-gray-700">Please try with different parameters or metrics.</p>
                            <Button
                                onClick={() => navigate('/parameter-page')}
                                className="mt-6 bg-blue-500 text-white hover:bg-blue-600"
                            >
                                Return to Parameters
                            </Button>
                        </div>
                    ) : (
                        <div style={{ height: `${chartHeight}px` }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={chartData}
                                    margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                                    barCategoryGap="20%"
                                >
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
                                            value: displayedMetrics.length > 1 ? "Values" : capitalizeFirstLetter(displayedMetrics[0] || ""),
                                            angle: -90,
                                            position: "insideLeft",
                                            offset: 10
                                        }}
                                    />
                                    <Tooltip formatter={(value, name) => [`${value}`, capitalizeFirstLetter(name as string)]} />
                                    <Legend wrapperStyle={{ paddingTop: 20 }} />
                                    {displayedMetrics.map((metric) => (
                                        <Bar
                                            key={metric}
                                            dataKey={metric}
                                            name={capitalizeFirstLetter(metric)}
                                            fill={getMetricColor(metric)}
                                        />
                                    ))}
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