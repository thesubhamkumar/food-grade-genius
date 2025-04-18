
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Globe, ScanLine, BarcodeIcon, Camera, FileSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowToUsePage = () => {
  const steps = [
    {
      id: 1,
      title: "Open the Website",
      description: "Navigate to food-grade-genius.lovable.app in your browser.",
      icon: <Globe className="w-10 h-10 text-health-primary" />,
      image: "https://images.unsplash.com/photo-1585184394271-4c0a47dc59c9?w=800&auto=format" // Person using laptop with food website
    },
    {
      id: 2,
      title: "Tap on the 'Scan' Option",
      description: "Find and tap the Scan button in the navigation menu.",
      icon: <ScanLine className="w-10 h-10 text-health-primary" />,
      image: "https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800&auto=format" // Person using smartphone with food app
    },
    {
      id: 3,
      title: "Find the Barcode",
      description: "Locate the barcode on your food package, usually on the back or bottom.",
      icon: <BarcodeIcon className="w-10 h-10 text-health-primary" />,
      image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format" // Food package with barcode
    },
    {
      id: 4,
      title: "Scan the Barcode",
      description: "Position your camera so the barcode is centered in the scanning area.",
      icon: <Camera className="w-10 h-10 text-health-primary" />,
      image: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?w=800&auto=format" // Scanning a food product barcode
    },
    {
      id: 5,
      title: "View the Results",
      description: "Review the nutritional information and health insights for your product.",
      icon: <FileSearch className="w-10 h-10 text-health-primary" />,
      image: "https://images.unsplash.com/photo-1505364698918-92fdf1b1aa37?w=800&auto=format" // Food nutrition analysis results
    }
  ];

  return (
    <Layout>
      <div className="container max-w-4xl px-4 py-12 mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800 md:text-4xl">
            How to Use FoodGrade Genius
          </h1>
          <p className="mt-3 text-gray-600 md:text-lg">
            Scan food products to make healthier choices in 5 simple steps
          </p>
        </div>
        
        <div className="space-y-8">
          {steps.map((step) => (
            <Card key={step.id} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-2/5 h-52 md:h-auto bg-gray-100 relative">
                  <img 
                    src={step.image} 
                    alt={`Step ${step.id}: ${step.title}`} 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4 bg-white rounded-full p-2 shadow-sm">
                    <div className="bg-health-primary/10 text-health-primary rounded-full w-8 h-8 flex items-center justify-center">
                      {step.id}
                    </div>
                  </div>
                </div>
                
                <CardContent className="flex-1 p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    {step.icon}
                    <h3 className="text-xl font-semibold text-gray-800">{step.title}</h3>
                  </div>
                  <p className="text-gray-600">{step.description}</p>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-700 mb-4">Ready to try it yourself?</p>
          <Button asChild className="bg-health-primary hover:bg-health-primary/90">
            <Link to="/scan">Scan Your First Product</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default HowToUsePage;
