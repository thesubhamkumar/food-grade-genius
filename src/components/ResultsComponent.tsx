import { Award, AlertCircle, Zap, Info, Tag, Utensils } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { UserPreferences } from "@/utils/userPreferences";

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
  brand?: string;
  image?: string | null;
};

type ResultsComponentProps = {
  analysis: FoodAnalysis;
  onIngredientClick?: (ingredient: string) => void;
  userPreferences?: UserPreferences;
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

const ResultsComponent = ({ analysis, onIngredientClick, userPreferences }: ResultsComponentProps) => {
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
  
  // Check if a product meets user preferences
  const checkProductPreferences = () => {
    if (!userPreferences) return null;
    
    const warnings: {label: string, warning: string}[] = [];
    
    // Check for preference violations
    if (userPreferences.isVegan && analysis.ingredients.some(i => 
      i.toLowerCase().includes('milk') || 
      i.toLowerCase().includes('egg') || 
      i.toLowerCase().includes('meat') ||
      i.toLowerCase().includes('honey')
    )) {
      warnings.push({
        label: 'Not Vegan',
        warning: 'This product contains animal ingredients'
      });
    }
    
    if (userPreferences.isGlutenFree && analysis.ingredients.some(i => 
      i.toLowerCase().includes('wheat') || 
      i.toLowerCase().includes('barley') || 
      i.toLowerCase().includes('rye') ||
      i.toLowerCase().includes('gluten')
    )) {
      warnings.push({
        label: 'Contains Gluten',
        warning: 'This product contains gluten'
      });
    }
    
    if (userPreferences.isLowSugar && analysis.nutrition.sugar > 10) {
      warnings.push({
        label: 'High Sugar',
        warning: 'This product contains high amounts of sugar'
      });
    }
    
    if (userPreferences.noPalmOil && analysis.ingredients.some(i => 
      i.toLowerCase().includes('palm oil')
    )) {
      warnings.push({
        label: 'Contains Palm Oil',
        warning: 'This product contains palm oil'
      });
    }
    
    return warnings.length > 0 ? warnings : null;
  };
  
  const preferenceWarnings = userPreferences ? checkProductPreferences() : null;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col">
        {/* Product header with image if available */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4">
            {analysis.image && (
              <div className="w-24 h-24 flex-shrink-0">
                <img 
                  src={analysis.image} 
                  alt={analysis.productName} 
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
            )}
            <div className="flex-grow text-center md:text-left">
              <h2 className="text-2xl font-bold text-gray-900">{analysis.productName}</h2>
              {analysis.brand && (
                <div className="flex items-center justify-center md:justify-start gap-1 text-sm text-gray-500 mt-1">
                  <Tag className="h-3.5 w-3.5" />
                  <span>{analysis.brand}</span>
                </div>
              )}
            </div>
            <div className="flex flex-col items-center">
              <div className="text-sm text-gray-600 font-medium">WHO Health Grade</div>
              <div className={`w-16 h-16 flex items-center justify-center rounded-full text-3xl font-bold 
                ${analysis.grade === 'A' ? 'bg-green-100 text-green-700' : 
                  analysis.grade === 'B' ? 'bg-green-50 text-green-600' : 
                  analysis.grade === 'C' ? 'bg-yellow-50 text-yellow-700' : 
                  analysis.grade === 'D' ? 'bg-orange-50 text-orange-700' : 
                  'bg-red-50 text-red-700'}`}>
                {analysis.grade}
              </div>
            </div>
          </div>
          
          {/* User Preference Warnings */}
          {preferenceWarnings && preferenceWarnings.length > 0 && (
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="text-sm font-semibold text-amber-700 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                Preference Alerts
              </h4>
              <ul className="mt-2 space-y-1">
                {preferenceWarnings.map((warning, idx) => (
                  <li key={idx} className="text-xs text-amber-600 flex items-start">
                    <span className="inline-block w-2 h-2 rounded-full bg-amber-500 mt-1.5 mr-1.5"></span>
                    <span><strong>{warning.label}:</strong> {warning.warning}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        
        <div className="p-6">
          {/* Nutritional summary */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center mb-3">
              <Info className="h-5 w-5 mr-2 text-blue-500" />
              Nutrition Facts
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Calories</p>
                <p className="text-lg font-semibold">{analysis.nutrition.calories}<span className="text-xs ml-1">kcal</span></p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Protein</p>
                <p className="text-lg font-semibold">{analysis.nutrition.protein}<span className="text-xs ml-1">g</span></p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Fat</p>
                <p className="text-lg font-semibold">{analysis.nutrition.fat}<span className="text-xs ml-1">g</span></p>
              </div>
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-500">Carbs</p>
                <p className="text-lg font-semibold">{analysis.nutrition.carbs}<span className="text-xs ml-1">g</span></p>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Sugar</span>
                  <span className="font-medium">{analysis.nutrition.sugar}g</span>
                </div>
                <Progress value={analysis.nutrition.sugar * 10} className={`h-2 ${getNutrientProgressColor('sugar', analysis.nutrition.sugar)}`} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Saturated Fat</span>
                  <span className="font-medium">{analysis.nutrition.saturatedFat}g</span>
                </div>
                <Progress value={analysis.nutrition.saturatedFat * 10} className={`h-2 ${getNutrientProgressColor('saturatedFat', analysis.nutrition.saturatedFat)}`} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Sodium</span>
                  <span className="font-medium">{analysis.nutrition.sodium}mg</span>
                </div>
                <Progress value={analysis.nutrition.sodium / 20} className={`h-2 ${getNutrientProgressColor('sodium', analysis.nutrition.sodium)}`} />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Fiber</span>
                  <span className="font-medium">{analysis.nutrition.fiber}g</span>
                </div>
                <Progress value={analysis.nutrition.fiber * 10} className={`h-2 ${getNutrientProgressColor('fiber', analysis.nutrition.fiber)}`} />
              </div>
            </div>
          </div>
          
          {/* Ingredients */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center mb-3">
              <Utensils className="h-5 w-5 mr-2 text-amber-500" />
              Ingredients
            </h3>
            <p className="text-sm text-gray-600">
              {analysis.ingredients.length > 0 
                ? (
                  <span>
                    {analysis.ingredients.map((ingredient, index) => (
                      <span key={index}>
                        <span 
                          className={`${onIngredientClick ? 'cursor-pointer text-blue-600 hover:underline' : ''}`}
                          onClick={() => onIngredientClick && onIngredientClick(ingredient)}
                        >
                          {ingredient}
                        </span>
                        {index < analysis.ingredients.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </span>
                ) 
                : "Ingredients information not available"}
            </p>
            {onIngredientClick && (
              <p className="text-xs text-gray-500 mt-2 italic">
                Click on any ingredient to learn more about it
              </p>
            )}
          </div>
          
          {/* Health information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center mb-2">
                <Award className="h-5 w-5 mr-2 text-health-primary" />
                Health Benefits
              </h3>
              <ul className="pl-6 list-disc text-sm text-gray-600 space-y-1">
                {analysis.positives.map((positive, index) => (
                  <li key={index}>{positive}</li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center mb-2">
                <AlertCircle className="h-5 w-5 mr-2 text-health-f" />
                Health Concerns
              </h3>
              <ul className="pl-6 list-disc text-sm text-gray-600 space-y-1">
                {analysis.concerns.map((concern, index) => (
                  <li key={index}>{concern}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Recommendation */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 flex items-center mb-2">
              <Zap className="h-5 w-5 mr-2 text-amber-500" />
              WHO-Based Recommendation
            </h3>
            <p className="text-sm text-gray-600">
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
            <p className="text-xs text-gray-500 mt-2 italic">
              {gradeDescriptions[analysis.grade]}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsComponent;
