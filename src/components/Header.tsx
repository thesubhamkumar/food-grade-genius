
import { Utensils, Search, Lightbulb } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

const Header = () => {
  const location = useLocation();
  
  const isActiveLink = (path: string) => {
    return location.pathname === path;
  };

  const linkVariants = {
    initial: { y: -5, opacity: 0 },
    animate: (i: number) => ({ 
      y: 0, 
      opacity: 1, 
      transition: { 
        delay: i * 0.1,
        duration: 0.3
      } 
    }),
    hover: { 
      y: -2,
      color: "#22c55e",
      transition: { duration: 0.2 }
    }
  };
  
  const logoVariants = {
    initial: { rotate: -10, scale: 0.9, opacity: 0 },
    animate: { 
      rotate: 0, 
      scale: 1, 
      opacity: 1,
      transition: { 
        duration: 0.5,
        type: "spring",
        stiffness: 200
      }
    },
    hover: { 
      rotate: 5, 
      scale: 1.05,
      transition: { duration: 0.3, type: "spring" }
    }
  };

  return (
    <motion.header 
      className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-200"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="container flex items-center justify-between h-16 px-4 mx-auto">
        <motion.div
          variants={logoVariants}
          initial="initial"
          animate="animate"
          whileHover="hover"
        >
          <Link to="/home" className="flex items-center space-x-2">
            <Utensils className="h-6 w-6 text-health-primary" />
            <span className="text-xl font-bold text-gray-800">FoodGrade Genius</span>
          </Link>
        </motion.div>
        <motion.div 
          className="hidden md:block"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-sm font-medium text-health-primary italic">Fuel Your Body, Feed Your Brain</p>
        </motion.div>
        <nav className="hidden md:flex md:items-center md:space-x-6">
          {[
            { path: "/home", label: "Home" },
            { path: "/food-compositions", label: "Your Food Compositions" },
            { path: "/scan", label: "Scan Label" },
            { path: "/how-to-use", label: "How To Use" },
            { path: "/about", label: "About" }
          ].map((item, i) => (
            <motion.div
              key={item.path}
              custom={i}
              variants={linkVariants}
              initial="initial"
              animate="animate"
              whileHover="hover"
            >
              <Link 
                to={item.path} 
                className={`text-sm font-medium transition-colors pb-1 ${
                  isActiveLink(item.path) 
                    ? 'text-health-primary border-b-2 border-health-primary' 
                    : 'text-gray-700 hover:text-health-primary'
                }`}
              >
                {item.label}
              </Link>
            </motion.div>
          ))}
        </nav>
        <div className="flex items-center space-x-3 md:hidden">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/food-compositions" 
              className="text-sm font-medium text-gray-700 hover:text-health-primary transition-colors"
            >
              Food DB
            </Link>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link 
              to="/scan" 
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-health-primary rounded-md shadow-sm hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-health-primary"
            >
              Scan
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
