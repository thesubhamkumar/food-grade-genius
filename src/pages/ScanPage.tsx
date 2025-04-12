
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScannerComponent from "@/components/ScannerComponent";
import ResultsComponent from "@/components/ResultsComponent";
import { FoodAnalysis } from "@/components/ResultsComponent";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// Updated food analysis data based on WHO standards and guidelines
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
      "High in saturated fat (exceeds WHO recommendation of <10% of energy)",
      "Contains trans-fatty acids from partially hydrogenated oils",
      "Excessive sodium content (WHO recommends <2000mg/day)",
      "Multiple artificial additives linked to health concerns",
      "Ultra-processed food associated with increased NCD risk"
    ],
    positives: [
      "Low sugar content (within WHO guidelines of <10% of energy)"
    ],
    ingredients: [
      "Enriched flour",
      "Partially hydrogenated vegetable oil",
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
      fat: 2.5,
      saturatedFat: 1.5,
      carbs: 7,
      sugar: 5,
      protein: 22,
      fiber: 0,
      sodium: 65
    },
    concerns: [
      "Contains naturally occurring sugars (5g per serving)",
      "Contains small amount of saturated fat (1.5g per serving)"
    ],
    positives: [
      "Excellent source of protein (22g per serving)",
      "Probiotic benefits for gut health (WHO recognizes importance for microbiome)",
      "No artificial ingredients or additives",
      "Low sodium (65mg, well below WHO limit of 2000mg/day)",
      "Contains calcium (30% DV) and vitamin D (20% DV)",
      "Minimally processed food aligned with WHO recommendations"
    ],
    ingredients: [
      "Organic pasteurized milk",
      "Live active cultures (S. thermophilus, L. bulgaricus, L. acidophilus, Bifidus, L. casei)",
      "Vitamin D"
    ]
  },
  "moderate": {
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
      "Contains added sugars (8g, WHO recommends limiting to <10% of daily energy)",
      "Some artificial flavors (potential allergens)",
      "Medium glycemic index (may affect blood glucose levels)"
    ],
    positives: [
      "High in dietary fiber (7g, WHO recommends 25g+ daily)",
      "Low saturated fat (0.5g, within WHO guideline of <10% of energy)",
      "Contains essential micronutrients (iron, B vitamins)",
      "Whole grain ingredients (WHO recommends whole grains over refined)",
      "Sodium content within WHO recommendations (<2000mg/day)"
    ],
    ingredients: [
      "Whole grain wheat",
      "Rice",
      "Cane sugar",
      "Wheat gluten",
      "Salt",
      "Dried fruit",
      "Vitamin E (as a preservative)",
      "Natural and artificial flavors",
      "Added vitamins and minerals (iron, B vitamins)"
    ]
  }
};

// Function to assess food quality based on WHO nutritional standards
const assessFoodQuality = (nutrition: any, ingredients: string[]): FoodAnalysis => {
  // Default to moderate health assessment
  let grade: "A" | "B" | "C" | "D" | "F" = "C";
  const concerns: string[] = [];
  const positives: string[] = [];
  
  // Check for unhealthy ingredients (based on WHO guidelines)
  const unhealthyIngredients = [
    "partially hydrogenated", "high fructose corn syrup", "artificial", 
    "msg", "monosodium glutamate", "yellow", "red dye", "blue"
  ];
  
  // Check for healthy ingredients (based on WHO guidelines)
  const healthyIngredients = [
    "whole grain", "organic", "probiotic", "fiber", "vitamin", 
    "mineral", "fruit", "vegetable", "legume", "nut", "seed"
  ];
  
  // Count unhealthy and healthy ingredients
  let unhealthyCount = 0;
  let healthyCount = 0;
  
  ingredients.forEach(ingredient => {
    const lowerIngredient = ingredient.toLowerCase();
    
    // Check unhealthy ingredients
    unhealthyIngredients.forEach(unhealthy => {
      if (lowerIngredient.includes(unhealthy)) {
        unhealthyCount++;
        concerns.push(`Contains ${ingredient} (WHO cautions against excessive consumption)`);
      }
    });
    
    // Check healthy ingredients
    healthyIngredients.forEach(healthy => {
      if (lowerIngredient.includes(healthy)) {
        healthyCount++;
        positives.push(`Contains ${ingredient} (aligned with WHO dietary recommendations)`);
      }
    });
  });
  
  // Assess macronutrients against WHO standards
  
  // Saturated fat assessment (WHO recommends <10% of total energy)
  if (nutrition.saturatedFat > 5) {
    concerns.push("High saturated fat content (exceeds WHO recommendation of <10% of energy)");
  } else if (nutrition.saturatedFat <= 2) {
    positives.push("Low saturated fat (within WHO guideline of <10% of energy)");
  }
  
  // Sodium assessment (WHO recommends <2000mg/day)
  if (nutrition.sodium > 500) {
    concerns.push("High sodium content (WHO recommends <2000mg/day)");
  } else if (nutrition.sodium < 140) {
    positives.push("Low sodium content (well within WHO guideline of <2000mg/day)");
  }
  
  // Sugar assessment (WHO recommends <10% of total energy, ideally <5%)
  if (nutrition.sugar > 10) {
    concerns.push("High sugar content (exceeds WHO recommendation of <10% of energy)");
  } else if (nutrition.sugar <= 5) {
    positives.push("Low sugar content (within WHO guideline of <10% of energy)");
  }
  
  // Fiber assessment (WHO recommends 25g+ daily)
  if (nutrition.fiber > 5) {
    positives.push("Good source of dietary fiber (WHO recommends 25g+ daily)");
  } else if (nutrition.fiber < 2) {
    concerns.push("Low fiber content (WHO recommends 25g+ daily)");
  }
  
  // Calculate health grade based on nutritional assessment
  let healthScore = 0;
  healthScore += healthyCount * 2;
  healthScore -= unhealthyCount * 2;
  
  // Adjust score based on critical nutrients
  healthScore -= (nutrition.saturatedFat > 5) ? 3 : 0;
  healthScore -= (nutrition.sodium > 500) ? 3 : 0;
  healthScore -= (nutrition.sugar > 10) ? 3 : 0;
  healthScore += (nutrition.fiber > 5) ? 2 : 0;
  healthScore += (nutrition.protein > 10) ? 2 : 0;
  
  // Assign grade based on health score
  if (healthScore >= 8) grade = "A";
  else if (healthScore >= 4) grade = "B";
  else if (healthScore >= 0) grade = "C";
  else if (healthScore >= -4) grade = "D";
  else grade = "F";
  
  // Ensure we have at least one concern and positive
  if (concerns.length === 0) concerns.push("No significant nutritional concerns");
  if (positives.length === 0) positives.push("Few nutritional benefits");
  
  // Limit to top concerns and positives to avoid overwhelming the user
  const topConcerns = concerns.slice(0, 5);
  const topPositives = positives.slice(0, 5);
  
  return {
    productName: "Analyzed Food Product",
    grade,
    nutrition,
    concerns: topConcerns,
    positives: topPositives,
    ingredients
  };
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
      try {
        // For demo purposes, randomly select between food types
        const foodTypes = ["processed", "healthy", "moderate"];
        const resultType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
        const results = mockProcessedFoods[resultType];
        
        console.log("Analysis complete with grade:", results.grade);
        setResults(results);
        setAnalyzing(false);
        setScanning(false);
        
        toast({
          title: "Analysis Complete",
          description: `This food received a grade ${results.grade} based on WHO nutritional standards`,
        });
      } catch (error) {
        console.error("Error analyzing image:", error);
        setAnalyzing(false);
        toast({
          variant: "destructive",
          title: "Analysis Error",
          description: "There was a problem analyzing the image. Please try again."
        });
      }
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
