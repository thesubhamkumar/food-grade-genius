
import { Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200">
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} FoodGrade Genius. All rights reserved.
          </p>
          <div className="flex items-center space-x-1 text-sm text-gray-500">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-health-f" />
            <span>for your health</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
