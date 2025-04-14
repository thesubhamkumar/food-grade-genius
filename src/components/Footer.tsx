
import { Heart, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} FoodGrade Genius. All rights reserved.
          </p>
          <div className="flex flex-col items-center space-y-2 md:flex-row md:space-y-0 md:space-x-4">
            <div className="flex items-center space-x-1 text-sm text-gray-500">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-health-f" />
              <span>for your health</span>
            </div>
            <a 
              href="https://www.linkedin.com/in/subhamkumar16" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-health-primary transition-colors"
            >
              <Linkedin className="h-4 w-4" />
              <span>Subham Kumar</span>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
