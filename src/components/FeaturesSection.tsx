
import { Camera, BarChart, Award, AlertCircle } from "lucide-react";

const features = [
  {
    name: "Easy Scanning",
    description:
      "Simply scan the barcode or take a photo of the nutrition label to get an instant health analysis.",
    icon: Camera,
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Health Rating",
    description:
      "Food products are graded from A to F based on nutritional quality, additives, and processing level.",
    icon: Award,
    color: "bg-green-100 text-green-600",
  },
  {
    name: "Detailed Breakdown",
    description:
      "View a detailed nutritional breakdown including calories, fats, sugars, protein, and vitamins.",
    icon: BarChart,
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Allergen Alerts",
    description:
      "Get immediate alerts for common allergens and concerning additives in food products.",
    icon: AlertCircle,
    color: "bg-amber-100 text-amber-600",
  },
];

const FeaturesSection = () => {
  return (
    <div className="bg-gray-50 py-16 sm:py-24">
      <div className="container px-4 mx-auto">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            How It Works
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
            Make informed decisions about your food with powerful yet simple tools.
          </p>
        </div>

        <div className="mt-12">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div key={feature.name} className="bg-white rounded-lg shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div>
                  <div className={`${feature.color} rounded-full p-3 inline-flex`}>
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                  <p className="mt-2 text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesSection;
