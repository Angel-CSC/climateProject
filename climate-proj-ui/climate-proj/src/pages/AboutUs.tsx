const AboutUs = () => {
    
    const members = [
        { name: "Angel Gomez - Backend", description: "Big Peepee" },
        { name: "Anothony Tran - Frontend", description: "Little peepee but still the goat." },
        { name: "Gabe - Backend", description: "Just little peepee" },
        { name: "Sabik - Backend", description: "Goat and Big Peepee" },
        { name: "Hyuntae - Team Lead", description: "The goat team lead of all time goat." },
        { name: "Nivedh - Front End", description: "I dont know him but he chill af." },
    ];

    return (
        <div className="min-h-screen bg-gray-100 pt-20 pb-10" 
        style={{ 
          backgroundImage: 'url(/general-background.jpg)', 
          backgroundSize: 'cover',
          backgroundPosition: 'center 0%',
          width: '100vw', 
          height: '100vh',
          overflowX: 'hidden',
          paddingTop: '6rem'
        }}>
            {/* Added pt-24 to create space for the navbar */}
            <h1 className="text-5xl font-bold text-center text-white mb-10">The Goats</h1>
            
            <div className="max-w-4xl mx-auto space-y-8 ">
            {members.map((member, index) => (
            <div 
                key={index} 
                    className="p-6 shadow-lg rounded-lg bg-transparent border border-white"
                >
                <h2 className="text-3xl font-semibold text-white">{member.name}</h2>
                <p className="text-lg text-gray-300 mt-2">{member.description}</p>
            </div>
            ))}

            </div>
        </div>
    );
};

export default AboutUs;
