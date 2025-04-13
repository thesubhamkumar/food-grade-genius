
import { Utensils } from "lucide-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200">
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <Link to="/home" className="flex items-center space-x-2">
          <Utensils className="h-6 w-6 text-health-primary" />
          <span className="text-xl font-bold text-gray-800">FoodGrade Genius</span>
        </Link>
        <nav className="hidden md:flex md:items-center md:space-x-6">
          <Link to="/home" className="text-sm font-medium text-gray-700 hover:text-health-primary transition-colors">
            Home
          </Link>
          <Link to="/scan" className="text-sm font-medium text-gray-700 hover:text-health-primary transition-colors">
            Scan Label
          </Link>
          <Link to="/about" className="text-sm font-medium text-gray-700 hover:text-health-primary transition-colors">
            About
          </Link>
        </nav>
        <Link 
          to="/scan" 
          className="md:hidden inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-health-primary rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-health-primary"
        >
          Scan
        </Link>
      </div>
    </header>
  );
};

export default Header;
