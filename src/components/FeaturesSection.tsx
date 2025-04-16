
import { LeafyGreen, Egg, Brain, Award, Heart, Utensils } from "lucide-react";

const FeaturesSection = () => {
  return (
    <div className="py-16 bg-white">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Snackable Science</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Discover how FoodGrade Genius helps you make better food choices based on scientific research
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-health-secondary rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-16 bg-health-secondary/20 rounded-xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Healthy Plate, Happy State</h3>
              <p className="text-gray-700 mb-6">
                A balanced meal is the foundation of good health. FoodGrade Genius helps you understand the composition of your food to create perfect meals every time.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <LeafyGreen className="h-5 w-5 text-health-a" />
                    <span className="font-medium text-gray-800">Vegetables</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">50% of your plate</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Egg className="h-5 w-5 text-health-b" />
                    <span className="font-medium text-gray-800">Protein</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">25% of your plate</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Utensils className="h-5 w-5 text-health-c" />
                    <span className="font-medium text-gray-800">Whole Grains</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">25% of your plate</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center space-x-2">
                    <Heart className="h-5 w-5 text-health-f" />
                    <span className="font-medium text-gray-800">Healthy Fats</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">In moderation</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square max-w-md mx-auto bg-white rounded-full shadow-md overflow-hidden relative">
                <div className="absolute inset-0 bg-gradient-to-br from-health-a/30 to-health-primary/10 rounded-full"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full bg-white flex items-center justify-center">
                  <div className="text-center">
                    <Award className="h-12 w-12 text-health-primary mx-auto" />
                    <p className="mt-2 font-medium text-gray-800">Balanced Nutrition</p>
                  </div>
                </div>
                <div className="absolute top-[15%] left-[15%] w-[25%] h-[25%] bg-health-a rounded-full flex items-center justify-center">
                  <LeafyGreen className="h-8 w-8 text-white" />
                </div>
                <div className="absolute top-[15%] right-[15%] w-[25%] h-[25%] bg-health-b rounded-full flex items-center justify-center">
                  <Egg className="h-8 w-8 text-white" />
                </div>
                <div className="absolute bottom-[15%] left-[15%] w-[25%] h-[25%] bg-health-c rounded-full flex items-center justify-center">
                  <Utensils className="h-8 w-8 text-white" />
                </div>
                <div className="absolute bottom-[15%] right-[15%] w-[25%] h-[25%] bg-health-f rounded-full flex items-center justify-center">
                  <Heart className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const features = [
  {
    icon: <Brain className="h-8 w-8 text-health-primary" />,
    title: "AI-Powered Analysis",
    description: "Our advanced algorithms evaluate food compositions to provide personalized health insights tailored to your needs."
  },
  {
    icon: <Award className="h-8 w-8 text-health-primary" />,
    title: "Simple Grading System",
    description: "We translate complex nutritional data into easy-to-understand letter grades from A to F."
  },
  {
    icon: <LeafyGreen className="h-8 w-8 text-health-primary" />,
    title: "Ingredient Transparency",
    description: "Understand exactly what's in your food with detailed breakdowns of all ingredients and their health implications."
  },
  {
    icon: <Utensils className="h-8 w-8 text-health-primary" />,
    title: "Comprehensive Database",
    description: "Access information on thousands of foods with regularly updated nutritional data from reliable sources."
  },
  {
    icon: <Heart className="h-8 w-8 text-health-primary" />,
    title: "Health-Focused Insights",
    description: "Get recommendations based on the latest research in nutrition and health science."
  },
  {
    icon: <Egg className="h-8 w-8 text-health-primary" />,
    title: "Nutritional Education",
    description: "Learn about the nutrients in your food and how they impact your overall health and wellbeing."
  }
];

export default FeaturesSection;
