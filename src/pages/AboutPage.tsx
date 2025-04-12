
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { LeafyGreen, Utensils, Soup, Circle } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <div className="bg-gradient-to-b from-health-secondary/30 to-white py-16">
          <div className="container px-4 mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900">About FoodGrade Genius</h1>
            <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
              Helping you make healthier food choices through technology.
            </p>
          </div>
        </div>
        
        <div className="container px-4 py-16 mx-auto">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg">
              <h2 className="flex items-center">
                <Utensils className="mr-2 text-health-primary" /> Our Mission
              </h2>
              <p>
                FoodGrade Genius was created with a simple mission: make healthy eating easier.
                By analyzing food labels and ingredients, we help you understand what's in your food
                and how it impacts your health.
              </p>
              
              <h2 className="flex items-center">
                <LeafyGreen className="mr-2 text-health-primary" /> Our Approach
              </h2>
              <p>
                Our health grading system evaluates foods based on several factors:
              </p>
              <ul>
                <li>Nutritional content (calories, fats, sugars, proteins, etc.)</li>
                <li>Presence of additives and artificial ingredients</li>
                <li>Level of processing</li>
                <li>Ingredient quality</li>
                <li>Potential allergens</li>
              </ul>
              
              <h2 className="flex items-center">
                <Soup className="mr-2 text-health-primary" /> Grading System
              </h2>
              <p>
                Our A to F grading system gives you an instant understanding of a food's health profile:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 not-prose mt-4 mb-6">
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="health-grade health-grade-a mr-4">A</div>
                  <div>
                    <h4 className="font-medium">Excellent</h4>
                    <p className="text-sm text-gray-600">Minimally processed, nutritious foods</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="health-grade health-grade-b mr-4">B</div>
                  <div>
                    <h4 className="font-medium">Very Good</h4>
                    <p className="text-sm text-gray-600">Healthy with minor concerns</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="health-grade health-grade-c mr-4">C</div>
                  <div>
                    <h4 className="font-medium">Average</h4>
                    <p className="text-sm text-gray-600">Some nutritional value with compromises</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100">
                  <div className="health-grade health-grade-d mr-4">D</div>
                  <div>
                    <h4 className="font-medium">Below Average</h4>
                    <p className="text-sm text-gray-600">Highly processed with limited nutrition</p>
                  </div>
                </div>
                <div className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 sm:col-span-2">
                  <div className="health-grade health-grade-f mr-4">F</div>
                  <div>
                    <h4 className="font-medium">Poor</h4>
                    <p className="text-sm text-gray-600">Ultra-processed with concerning ingredients</p>
                  </div>
                </div>
              </div>
              
              <h2 className="flex items-center">
                <Circle className="mr-2 text-health-primary" /> Looking Forward
              </h2>
              <p>
                We're constantly improving our food database and analysis algorithms to provide
                you with the most accurate and helpful information. Future updates will include
                personalized recommendations based on your dietary preferences and health goals.
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AboutPage;
