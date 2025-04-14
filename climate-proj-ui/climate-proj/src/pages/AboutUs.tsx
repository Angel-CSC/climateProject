const AboutUs = () => {
    
    const members = [
        { name: "Angel Gomez - Backend", description: `Senior in Computer Science. Interned at NVIDIA` },
        { name: "Anothony Tran - Frontend", description: `Senior in Computer Science. Interned at Tyler Technologies` },
        { name: "Gabe - Backend", description: `Senior in Computer Science. Interned at Tyler Technologies` },
        { name: "Sabik - Frontend", description: `Senior in Computer Science. Interned at Mr. Cooper` },
        { name: "Hyuntae - Team Lead", description: `Senior in Computer Science. Interned at Garmin. National Merit Scholar` },
        { name: "Nivedh - Backend", description: `Senior in Computer Science. Interned at NVIDIA` },
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
            <h1 className="text-5xl font-bold text-center text-white mb-10">About Us</h1>
            
            <div className="max-w-4xl mx-auto space-y-8 ">
            {members.map((member, index) => (
            <div 
                key={index} 
                    className="p-6 shadow-lg rounded-lg bg-transparent border border-white"
                >
                <h2 className="text-3xl font-semibold text-white">{member.name}</h2>
                <p className="text-lg text-white mt-2" style={{ textShadow: '1px 1px 2px black' }}>{member.description}</p>
            </div>
            ))}

            </div>
        </div>
    );
};

export default AboutUs;
