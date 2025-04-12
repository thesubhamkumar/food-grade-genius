
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScannerComponent from "@/components/ScannerComponent";
import ResultsComponent from "@/components/ResultsComponent";
import { FoodAnalysis } from "@/components/ResultsComponent";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Mock data for demo purposes
const mockResults: FoodAnalysis = {
  productName: "Whole Grain Breakfast Cereal",
  grade: "B",
  nutrition: {
    calories: 210,
    fat: 2.5,
    saturatedFat: 0.5,
    carbs: 42,
    sugar: 8,
    protein: 5,
    fiber: 7,
    sodium: 200
  },
  concerns: [
    "Contains added sugars",
    "Some artificial flavors",
    "Medium glycemic index"
  ],
  positives: [
    "Good source of fiber",
    "Low saturated fat",
    "Contains essential vitamins",
    "Whole grain ingredients"
  ],
  ingredients: [
    "Whole grain wheat",
    "Rice",
    "Sugar",
    "Wheat gluten",
    "Salt",
    "Dried fruit",
    "Natural and artificial flavors"
  ]
};

const mockProcessedFoods: Record<string, FoodAnalysis> = {
  "processed": {
    productName: "Ultra Processed Snack Crackers",
    grade: "F",
    nutrition: {
      calories: 160,
      fat: 9,
      saturatedFat: 4.5,
      carbs: 18,
      sugar: 2,
      protein: 2,
      fiber: 0.5,
      sodium: 390
    },
    concerns: [
      "High in saturated fat",
      "Contains palm oil",
      "Multiple artificial additives",
      "Very low nutritional value",
      "High sodium content"
    ],
    positives: [
      "Low sugar content"
    ],
    ingredients: [
      "Enriched flour",
      "Vegetable oil (palm)",
      "Salt",
      "High fructose corn syrup",
      "Monosodium glutamate",
      "Artificial flavors",
      "Yellow 5",
      "TBHQ (preservative)"
    ]
  },
  "healthy": {
    productName: "Organic Greek Yogurt",
    grade: "A",
    nutrition: {
      calories: 120,
      fat: 0.5,
      saturatedFat: 0,
      carbs: 7,
      sugar: 5,
      protein: 22,
      fiber: 0,
      sodium: 65
    },
    concerns: [
      "Contains naturally occurring sugars"
    ],
    positives: [
      "Excellent source of protein",
      "Probiotic benefits for gut health",
      "No artificial ingredients",
      "Low fat content",
      "Contains calcium and vitamin D"
    ],
    ingredients: [
      "Organic nonfat milk",
      "Live active cultures",
      "Vitamin D"
    ]
  }
};

const ScanPage = () => {
  const [scanning, setScanning] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<FoodAnalysis | null>(null);
  const { toast } = useToast();

  const handleImageCaptured = (imageData: string) => {
    console.log("Image captured and being processed");
    setAnalyzing(true);
    
    // Brief delay to ensure UI updates properly before processing
    setTimeout(() => {
      // For demo purposes, randomly select between healthy and processed food
      const resultType = Math.random() > 0.5 ? "processed" : "healthy";
      const results = mockProcessedFoods[resultType];
      
      console.log("Analysis complete with grade:", results.grade);
      setResults(results);
      setAnalyzing(false);
      setScanning(false);
      
      toast({
        title: "Analysis Complete",
        description: `This food received a grade ${results.grade}`,
      });
    }, 2000);
  };

  const resetScan = () => {
    setScanning(true);
    setAnalyzing(false);
    setResults(null);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container px-4 py-8 mx-auto">
        <div className="max-w-3xl mx-auto">
          {!scanning && !analyzing && (
            <Button 
              variant="ghost" 
              className="mb-6 flex items-center text-gray-600 hover:text-health-primary"
              onClick={resetScan}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Scan Another
            </Button>
          )}
          
          {scanning && (
            <ScannerComponent onImageCaptured={handleImageCaptured} />
          )}
          
          {analyzing && (
            <div className="text-center py-12">
              <div className="inline-block rounded-full p-3 bg-health-secondary mb-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-health-primary"></div>
              </div>
              <h3 className="text-xl font-medium text-gray-800">Analyzing Food Label</h3>
              <p className="text-gray-500 mt-2">Please wait while we process your image</p>
            </div>
          )}
          
          {!scanning && !analyzing && results && (
            <ResultsComponent analysis={results} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ScanPage;
