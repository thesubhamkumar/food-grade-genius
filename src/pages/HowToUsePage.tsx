
import { Layout } from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Camera, Search, Star, Settings, Award, ArrowRight, Smartphone } from "lucide-react";

const HowToUsePage = () => {
  const steps = [
    {
      id: 1,
      title: "Open the Camera",
      description: "Navigate to the 'Scan Label' section and allow camera access.",
      icon: <Camera className="w-10 h-10 text-health-primary" />,
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format"
    },
    {
      id: 2,
      title: "Scan the Barcode",
      description: "Position the product barcode inside the scanning guide box.",
      icon: <Smartphone className="w-10 h-10 text-health-primary" />,
      image: "https://images.unsplash.com/photo-1473091534298-04dcbce3278c?w=800&auto=format"
    },
    {
      id: 3,
      title: "View Product Information",
      description: "Once detected, you'll instantly see nutritional information, ingredients, and more.",
      icon: <Search className="w-10 h-10 text-health-primary" />,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format"
    },
    {
      id: 4,
      title: "Check Trust Score",
      description: "See how reliable the product information is with our trust scoring system.",
      icon: <Star className="w-10 h-10 text-health-primary" />,
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format"
    },
    {
      id: 5,
      title: "Customize Preferences",
      description: "Set your dietary preferences to receive personalized recommendations.",
      icon: <Settings className="w-10 h-10 text-health-primary" />,
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&auto=format"
    },
    {
      id: 6,
      title: "Explore Alternatives",
      description: "Find healthier alternatives that match your dietary needs.",
      icon: <Award className="w-10 h-10 text-health-primary" />,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&auto=format"
    }
  ];

  return (
    <Layout>
      <div className="container px-4 py-10 mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-800 md:text-4xl">
            How to Use FoodGrade Genius
          </h1>
          <p className="mt-4 text-center text-gray-600 md:text-lg">
            Follow these simple steps to get the most out of our food scanning app
          </p>
          
          <Separator className="my-8" />
          
          <div className="space-y-12">
            {steps.map((step, index) => (
              <div key={step.id} className="animate-fade-in" style={{ animationDelay: `${index * 150}ms` }}>
                <Card className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-1/2 h-48 md:h-auto relative">
                      <img 
                        src={step.image} 
                        alt={`Step ${step.id}: ${step.title}`} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 rounded-full p-3 shadow-sm">
                        {step.icon}
                      </div>
                    </div>
                    
                    <CardContent className="flex flex-col justify-center w-full md:w-1/2 p-6">
                      <div className="flex items-center mb-2">
                        <div className="bg-health-primary/10 text-health-primary font-bold rounded-full w-8 h-8 flex items-center justify-center mr-3">
                          {step.id}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800">{step.title}</h3>
                      </div>
                      
                      <p className="text-gray-600 mt-2">{step.description}</p>
                      
                      {index < steps.length - 1 && (
                        <div className="hidden md:flex justify-end mt-4">
                          <ArrowRight className="text-health-primary w-5 h-5" />
                        </div>
                      )}
                    </CardContent>
                  </div>
                </Card>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center">
            <p className="text-lg font-medium text-gray-700">Ready to start?</p>
            <a 
              href="/scan" 
              className="inline-flex items-center px-6 py-3 mt-4 text-sm font-medium text-white bg-health-primary rounded-md shadow-sm hover:bg-green-600 transition-colors"
            >
              Scan Your First Product
              <ArrowRight className="ml-2 w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HowToUsePage;
