import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Button from "../components/ui/button";

const Results = () => {
    // dummy data
    const dummyData = [
        { year: 2020, average: 100 },
        { year: 2021, average: 101 },
        { year: 2022, average: 102 },
        { year: 2023, average: 103 },
        { year: 2024, average: 104 },
    ];

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
            <Button to="/parameter-page" className="mt-20 ml-4 max-w-16 border border-white text-white bg-transparent hover:bg-white/30">
                Back
            </Button>

            <div className="flex-1 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-white mb-8">Results</h1>

                <div className="w-full max-w-3xl h-96 bg-white rounded-xl shadow-lg p-4">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={dummyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                            {/* strokeDashArray adds a little background grid to the graph to make it easier to look at*/}
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
                                    value: "Average", 
                                    angle: -90, 
                                    position: "insideLeft", 
                                    offset: 10 
                                }} 
                            />
                            <Tooltip />
                            <Bar dataKey="average" fill="#3182ce" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Results;
