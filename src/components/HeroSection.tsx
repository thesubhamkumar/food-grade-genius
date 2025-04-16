
import { Camera, Award, Salad, Apple, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QuotesCarousel } from "./QuotesCarousel";
import { motion } from "framer-motion";
import FoodMythBuster from "./FoodMythBuster";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="absolute top-20 right-0 -z-10 w-72 h-72 bg-health-secondary/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 -z-10 w-80 h-80 bg-health-b/10 rounded-full blur-3xl"></div>
      
      <div className="container px-4 py-10 mx-auto sm:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <motion.div 
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, type: "spring" }}
          >
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Know what's in your</span>{" "}
              <span className="block text-health-primary xl:inline">food.</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              FoodGrade Genius scans food labels, analyzes ingredients, and helps you make healthier choices with a simple grading system.
            </p>
            <div className="mt-8 sm:flex">
              <motion.div 
                className="rounded-md shadow"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/scan"
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-health-primary border border-transparent rounded-md hover:bg-green-600 md:py-4 md:text-lg md:px-10"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Scan Now
                </Link>
              </motion.div>
              <motion.div 
                className="mt-3 sm:mt-0 sm:ml-3"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link
                  to="/about"
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-health-primary bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 md:py-4 md:text-lg md:px-10"
                >
                  Learn More
                </Link>
              </motion.div>
            </div>
          </motion.div>
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
          >
            <div className="relative h-full w-full max-w-md">
              <motion.div 
                className="absolute top-0 right-0 -m-6 bg-health-secondary rounded-full h-48 w-48 opacity-50"
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ 
                  y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
                  rotate: { repeat: Infinity, duration: 6, ease: "easeInOut" }
                }}
              ></motion.div>
              <div className="relative overflow-hidden bg-white shadow-xl rounded-2xl">
                <div className="px-4 py-12 flex flex-col items-center space-y-4">
                  <motion.div 
                    className="bg-health-a text-white p-4 rounded-full"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <Award className="h-12 w-12" />
                  </motion.div>
                  <div className="text-center">
                    <span className="block text-lg font-bold text-gray-900">Whole Grain Bread</span>
                    <div className="mt-1 flex justify-center">
                      <span className="health-grade health-grade-a animate-pulse-rating">A</span>
                    </div>
                    <p className="mt-3 text-sm text-gray-500">High fiber, low sugar, and minimal processing</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl font-bold text-gray-900">Food Facts That'll Blow Your Mind</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover surprising insights about the foods you eat every day
            </p>
          </motion.div>
          
          <QuotesCarousel />
          
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FactCard 
              icon={<Apple className="h-10 w-10 text-health-a" />}
              title="Apple Power" 
              fact="Apples are more effective at waking you up in the morning than coffee, thanks to their natural sugars and fiber content."
            />
            <FactCard 
              icon={<Salad className="h-10 w-10 text-health-a" />}
              title="Leafy Greens Secret" 
              fact="Just one cup of kale contains more vitamin C than an orange and is packed with cancer-fighting compounds."
            />
            <FactCard 
              icon={<Lightbulb className="h-10 w-10 text-health-b" />}
              title="Blueberry Brain Boost" 
              fact="Regular blueberry consumption can delay brain aging by up to 2.5 years according to recent studies."
            />
          </div>
        </div>
      </div>
      
      <FoodMythBuster />
    </div>
  );
};

const FactCard = ({ icon, title, fact }) => {
  return (
    <motion.div
      className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100 group hover:-translate-y-1 transition-transform"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ 
        boxShadow: "0px 10px 25px rgba(0, 0, 0, 0.1)",
        y: -5
      }}
    >
      <div className="flex flex-col items-center text-center">
        <motion.div 
          className="mb-4 transform group-hover:scale-110 transition-transform duration-300"
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          {icon}
        </motion.div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{fact}</p>
      </div>
    </motion.div>
  );
};

export default HeroSection;
