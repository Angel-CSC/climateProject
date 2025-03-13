import { Link } from "react-router-dom";
import Button from "./ui/button"; // Corrected import statement

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              Climate Project
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-8">
                <Link to="/about-us" className="text-sm text-gray-300 hover:text-white">
                  About Us
                </Link>
                <Link to="#" className="text-sm text-gray-300 hover:text-white">
                  How It Works
                </Link>
                <Link to="#" className="text-sm text-gray-300 hover:text-white">
                  Our Mission
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="text-sm bg-gradient-to-r from-primary to-accent hover:opacity-90">
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
