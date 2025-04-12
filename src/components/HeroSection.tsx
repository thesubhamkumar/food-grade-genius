
import { Camera, Sandwich, Award, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <div className="relative overflow-hidden bg-white">
      <div className="container px-4 py-16 mx-auto sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block xl:inline">Know what's in your</span>{" "}
              <span className="block text-health-primary xl:inline">food.</span>
            </h1>
            <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              FoodGrade Genius scans food labels, analyzes ingredients, and helps you make healthier choices with a simple grading system.
            </p>
            <div className="mt-8 sm:flex">
              <div className="rounded-md shadow">
                <Link
                  to="/scan"
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-white bg-health-primary border border-transparent rounded-md hover:bg-green-600 md:py-4 md:text-lg md:px-10"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Scan Now
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link
                  to="/about"
                  className="flex items-center justify-center w-full px-8 py-3 text-base font-medium text-health-primary bg-gray-100 border border-transparent rounded-md hover:bg-gray-200 md:py-4 md:text-lg md:px-10"
                >
                  Learn More
                </Link>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative h-full w-full max-w-md">
              <div className="absolute top-0 right-0 -m-6 bg-health-secondary rounded-full h-48 w-48 opacity-50"></div>
              <div className="relative overflow-hidden bg-white shadow-xl rounded-2xl">
                <div className="px-4 py-12 flex flex-col items-center space-y-4">
                  <div className="bg-health-a text-white p-4 rounded-full">
                    <Award className="h-12 w-12" />
                  </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
