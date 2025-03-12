const AboutUs = () => {
    const members = [
        { name: "Angel Gomez", description: "Big Peepee" },
        { name: "Anothony Tran", description: "Little peepee but still the goat." },
        { name: "Gabe", description: "Just little peepee" },
        { name: "Sabik", description: "Goat and Big Peepee" },
        { name: "Member 5", description: "Description for Member 5." },
        { name: "Member 6", description: "Description for Member 6." },
    ];

    return (
        <div className="min-h-screen bg-gray-100 pt-20 pb-10"> 
            {/* Added pt-24 to create space for the navbar */}
            <h1 className="text-5xl font-bold text-center text-gray-800 mb-10">The Goats</h1>
            
            <div className="max-w-4xl mx-auto space-y-8">
                {members.map((member, index) => (
                    <div key={index} className="p-6 bg-white shadow-lg rounded-lg">
                        <h2 className="text-3xl font-semibold text-gray-900">{member.name}</h2>
                        <p className="text-lg text-gray-600 mt-2">{member.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AboutUs;
