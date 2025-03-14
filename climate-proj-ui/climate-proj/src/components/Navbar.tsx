import { Link } from "react-router-dom";
import Button from "./ui/button"; // Corrected import statement

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 w-full bg-transparent border-b border-white/10">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              Daddies
            </Link>
            <div className="hidden md:block ml-10">
              <div className="flex items-center space-x-8">
                <Link
                  to="/about-us"
                  className="text-sm text-white hover:text-gray-400 border-r border-white pr-6"
                >
                  About Us
                </Link>
                <Link
                  to="#"
                  className="text-sm text-white hover:text-gray-400 border-r border-white pr-6"
                >
                  How It Works
                </Link>
                <Link
                  to="#"
                  className="text-sm text-white hover:text-gray-400"
                >
                  References
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/map-page">
              <Button className="text-sm bg-gradient-to-r from-primary to-accent hover:opacity-90">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

