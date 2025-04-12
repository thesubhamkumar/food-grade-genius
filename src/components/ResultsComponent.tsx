
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

const gradeDescriptions = {
  A: "Excellent nutritional profile. Minimally processed with beneficial ingredients.",
  B: "Good nutritional value with some room for improvement.",
  C: "Average nutritional value. Contains some processed ingredients.",
  D: "Below average nutritional value. Highly processed with concerning ingredients.",
  F: "Poor nutritional value. Contains many unhealthy ingredients and additives."
};

const ResultsComponent = ({ analysis }: { analysis: FoodAnalysis }) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="flex items-center justify-center p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 md:w-1/3">
          <div className="text-center">
            <div className="mb-3 text-gray-600 font-medium">Health Grade</div>
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
              Nutrition Facts
            </h3>
            <div className="mt-3 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Calories</div>
                <div className="text-lg font-semibold">{analysis.nutrition.calories} kcal</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Protein</div>
                <div className="flex items-center">
                  <Progress value={analysis.nutrition.protein * 5} className="h-2 mr-2" />
                  <span>{analysis.nutrition.protein}g</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Fat</div>
                <div className="flex items-center">
                  <Progress value={analysis.nutrition.fat * 3} className="h-2 mr-2" />
                  <span>{analysis.nutrition.fat}g</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Sugar</div>
                <div className="flex items-center">
                  <Progress value={analysis.nutrition.sugar * 10} className="h-2 mr-2" />
                  <span>{analysis.nutrition.sugar}g</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Fiber</div>
                <div className="flex items-center">
                  <Progress value={analysis.nutrition.fiber * 10} className="h-2 mr-2" />
                  <span>{analysis.nutrition.fiber}g</span>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Sodium</div>
                <div className="flex items-center">
                  <Progress value={analysis.nutrition.sodium / 25} className="h-2 mr-2" />
                  <span>{analysis.nutrition.sodium}mg</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Award className="h-5 w-5 mr-2 text-health-primary" />
                Positives
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
                Concerns
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
              Recommendation
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              {analysis.grade === "A" || analysis.grade === "B" 
                ? "This is a good choice! Consider including this product in your regular diet."
                : analysis.grade === "C" 
                ? "This product is okay for occasional consumption, but look for healthier alternatives for regular use."
                : "We recommend looking for healthier alternatives with fewer processed ingredients and additives."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsComponent;
