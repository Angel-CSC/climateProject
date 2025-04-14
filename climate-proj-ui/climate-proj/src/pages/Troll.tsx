

const Troll = () => {
    return (
      <div 
        className="flex flex-col items-center justify-start min-h-screen w-full text-gray-900"
        style={{ 
          backgroundImage: 'url(/homepage-background.jpg)', 
          backgroundSize: 'cover',  // Ensures the image covers the full screen without stretching
          backgroundPosition: 'center 0%',  // Adjusts the vertical position of the background image
          width: '100vw',  // Ensures the div takes the full viewport width
          height: '100vh',  // Ensures the div takes the full viewport height
          overflowX: 'hidden',  // Prevents horizontal scrolling
          paddingTop: '6rem'
        }}
      >
        <h1 className="text-4xl font-bold mb-4 text-white">To Be Implemented...</h1>
      </div>
    );
};

export default Troll;
