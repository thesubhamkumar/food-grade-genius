
import { Award, AlertCircle, Zap, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export type NutritionInfo = {
  calories: number;
  fat: number;
  saturatedFat: number;
  carbs: number;
  sugar: number;
  protein: number;
  fiber: number;
  sodium: number;
};

export type FoodGrade = "A" | "B" | "C" | "D" | "F";

export type FoodAnalysis = {
  productName: string;
  grade: FoodGrade;
  nutrition: NutritionInfo;
  concerns: string[];
  positives: string[];
  ingredients: string[];
};

// Updated grade descriptions based on WHO nutritional standards
const gradeDescriptions = {
  A: "Excellent nutritional profile. Aligns with WHO guidelines for a healthy diet with minimal processing and beneficial ingredients.",
  B: "Good nutritional value with minor concerns. Generally follows WHO dietary recommendations.",
  C: "Average nutritional value. Some aspects may not align with WHO guidelines for optimal health.",
  D: "Below average nutritional value. Several components exceed WHO recommended limits for sugar, salt, or unhealthy fats.",
  F: "Poor nutritional value. Contains many ingredients that WHO associates with increased health risks."
};

// WHO nutritional reference values (for contextual display)
const whoReferences = {
  sugar: "WHO recommends limiting added sugars to <10% of total energy intake, ideally <5%",
  fat: "WHO recommends total fat intake between 15-30% of total energy intake",
  saturatedFat: "WHO recommends limiting saturated fat to <10% of total energy intake",
  sodium: "WHO recommends limiting sodium to <2000mg per day",
  fiber: "WHO recommends at least 25g of dietary fiber daily",
  protein: "WHO recommends protein based on body weight (0.8g/kg for average adults)"
};

const ResultsComponent = ({ analysis }: { analysis: FoodAnalysis }) => {
  // Helper function to determine progress color based on nutrient and value
  const getNutrientProgressColor = (nutrient: string, value: number): string => {
    switch (nutrient) {
      case 'sugar': 
        return value <= 5 ? 'bg-green-500' : value <= 10 ? 'bg-yellow-500' : 'bg-red-500';
      case 'fat':
        return value <= 3 ? 'bg-green-500' : value <= 10 ? 'bg-yellow-500' : 'bg-red-500';
      case 'saturatedFat':
        return value <= 1.5 ? 'bg-green-500' : value <= 3 ? 'bg-yellow-500' : 'bg-red-500';
      case 'sodium':
        return value <= 140 ? 'bg-green-500' : value <= 500 ? 'bg-yellow-500' : 'bg-red-500';
      case 'fiber':
        return value >= 5 ? 'bg-green-500' : value >= 2.5 ? 'bg-yellow-500' : 'bg-red-500';
      case 'protein':
        return value >= 10 ? 'bg-green-500' : value >= 5 ? 'bg-yellow-500' : 'bg-red-500';
      default:
        return '';
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 md:w-1/3">
          <div className="text-center">
            <div className="mb-3 text-gray-600 font-medium">WHO Health Grade</div>
            <div className={`health-grade health-grade-${analysis.grade.toLowerCase()} mx-auto animate-pulse-rating`}>
              {analysis.grade}
            </div>
            <div className="mt-3 text-sm text-gray-500">{gradeDescriptions[analysis.grade]}</div>
          </div>
        </div>
        
        <div className="p-6 md:p-8 md:w-2/3">
          <h2 className="text-2xl font-bold text-gray-900">{analysis.productName}</h2>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Info className="h-5 w-5 mr-2 text-blue-500" />
              Nutrition Facts (WHO Reference)
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Calories</div>
                <div className="text-lg font-semibold">{analysis.nutrition.calories} kcal</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Protein</div>
                <div className="flex items-center">
                  <Progress 
                    value={analysis.nutrition.protein * 5} 
                    className={`h-2 mr-2 ${getNutrientProgressColor('protein', analysis.nutrition.protein)}`} 
                  />
                  <span>{analysis.nutrition.protein}g</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Fat</div>
                <div className="flex items-center">
                  <Progress 
                    value={analysis.nutrition.fat * 3} 
                    className={`h-2 mr-2 ${getNutrientProgressColor('fat', analysis.nutrition.fat)}`} 
                  />
                  <span>{analysis.nutrition.fat}g</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Saturated Fat</div>
                <div className="flex items-center">
                  <Progress 
                    value={analysis.nutrition.saturatedFat * 10} 
                    className={`h-2 mr-2 ${getNutrientProgressColor('saturatedFat', analysis.nutrition.saturatedFat)}`} 
                  />
                  <span>{analysis.nutrition.saturatedFat}g</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Sugar</div>
                <div className="flex items-center">
                  <Progress 
                    value={analysis.nutrition.sugar * 10} 
                    className={`h-2 mr-2 ${getNutrientProgressColor('sugar', analysis.nutrition.sugar)}`} 
                  />
                  <span>{analysis.nutrition.sugar}g</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Fiber</div>
                <div className="flex items-center">
                  <Progress 
                    value={analysis.nutrition.fiber * 10} 
                    className={`h-2 mr-2 ${getNutrientProgressColor('fiber', analysis.nutrition.fiber)}`} 
                  />
                  <span>{analysis.nutrition.fiber}g</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Sodium</div>
                <div className="flex items-center">
                  <Progress 
                    value={analysis.nutrition.sodium / 25} 
                    className={`h-2 mr-2 ${getNutrientProgressColor('sodium', analysis.nutrition.sodium)}`} 
                  />
                  <span>{analysis.nutrition.sodium}mg</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Award className="h-5 w-5 mr-2 text-health-primary" />
                WHO Aligned Benefits
              </h3>
              <ul className="mt-2 pl-7 list-disc text-sm text-gray-600 space-y-1">
                {analysis.positives.map((positive, index) => (
                  <li key={index}>{positive}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <AlertCircle className="h-5 w-5 mr-2 text-health-f" />
                WHO Health Concerns
              </h3>
              <ul className="mt-2 pl-7 list-disc text-sm text-gray-600 space-y-1">
                {analysis.concerns.map((concern, index) => (
                  <li key={index}>{concern}</li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <Zap className="h-5 w-5 mr-2 text-amber-500" />
              WHO-Based Recommendation
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {analysis.grade === "A" 
                ? "This product aligns well with WHO dietary guidelines. Excellent choice for regular consumption."
                : analysis.grade === "B" 
                ? "This product generally follows WHO recommendations with minor concerns. Good for regular consumption."
                : analysis.grade === "C" 
                ? "This product partially meets WHO guidelines. Suitable for occasional consumption as part of a balanced diet."
                : analysis.grade === "D"
                ? "This product contains elements that exceed WHO recommended limits. Limit consumption and seek healthier alternatives."
                : "This product contains multiple components that WHO associates with increased health risks. Consider healthier alternatives that better align with WHO dietary guidelines."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsComponent;
