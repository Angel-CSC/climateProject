import Button from "../components/ui/button";

const Results = () => {
    //dummy data showing a list of year-average entries, to test the results page until we get the actual data
    const dummyData = [
        {year: 2020, average: 100},
        {year: 2021, average: 101},
        {year: 2022, average: 102},
        {year: 2023, average: 103},
        {year: 2024, average: 104},
    ]
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
            <Button to="/parameter-page" className="mt-20 ml-4 max-w-16 border border-white text-white bg-transparent hover:bg-white/30">Back</Button>
            <div className="flex-1 flex flex-col items-center justify-center">
                <h1 className="text-3xl font-bold text-white">Results</h1>

            </div>
        </div>
    )
}

export default Results;