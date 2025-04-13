
import { X, ExternalLink, AlertCircle, Lightbulb, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

// Ingredient info database (simplified version)
const ingredientDatabase: Record<string, IngredientInfo> = {
  'sugar': {
    description: 'A sweet crystalline substance obtained from various plants, especially sugar cane and sugar beet.',
    healthImpact: 'Regular consumption of added sugars has been linked to increased risk of obesity, type 2 diabetes, and heart disease.',
    alternatives: ['honey', 'stevia', 'maple syrup', 'date sugar'],
    category: 'sweetener',
    flags: ['high-glycemic', 'added-sugar']
  },
  'salt': {
    description: 'A mineral composed primarily of sodium chloride, used for flavoring and preservation.',
    healthImpact: 'Excessive salt consumption is linked to high blood pressure and increased risk of heart disease and stroke.',
    alternatives: ['herbs', 'spices', 'lemon juice', 'salt substitutes'],
    category: 'mineral',
    flags: ['sodium']
  },
  'palm oil': {
    description: 'An edible vegetable oil derived from the fruit of oil palm trees.',
    healthImpact: 'High in saturated fats which may increase LDL cholesterol. Environmental concerns about deforestation practices.',
    alternatives: ['olive oil', 'sunflower oil', 'coconut oil'],
    category: 'oil',
    flags: ['saturated-fat', 'environmental-concern']
  },
  'monosodium glutamate': {
    description: 'A food additive used to enhance flavor, commonly known as MSG.',
    healthImpact: 'Generally recognized as safe, though some people report sensitivity symptoms.',
    alternatives: ['yeast extract', 'mushroom extract', 'seaweed'],
    category: 'flavor-enhancer',
    flags: ['additive', 'E621']
  },
  'high fructose corn syrup': {
    description: 'A sweetener made from corn starch that has been processed to convert glucose into fructose.',
    healthImpact: 'Associated with increased risk of obesity, diabetes, and metabolic syndrome when consumed in large amounts.',
    alternatives: ['honey', 'maple syrup', 'regular sugar'],
    category: 'sweetener',
    flags: ['added-sugar', 'highly-processed']
  }
};

type IngredientInfo = {
  description: string;
  healthImpact: string;
  alternatives: string[];
  category: string;
  flags: string[];
};

export type IngredientExplainerProps = {
  ingredient: string;
  onClose: () => void;
};

export const IngredientExplainer = ({ ingredient, onClose }: IngredientExplainerProps) => {
  const [ingredientInfo, setIngredientInfo] = useState<IngredientInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredientInfo = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // In a real app, you might fetch this from an API
        // Here we're using our local database for demonstration
        
        // Try to find an exact match
        let info = ingredientDatabase[ingredient.toLowerCase()];
        
        // If not found, try to find a partial match
        if (!info) {
          const key = Object.keys(ingredientDatabase).find(
            k => ingredient.toLowerCase().includes(k)
          );
          
          if (key) {
            info = ingredientDatabase[key];
          }
        }
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (info) {
          setIngredientInfo(info);
        } else {
          // Generate generic info for unknown ingredients
          setIngredientInfo({
            description: `${ingredient} is a food ingredient used in various processed foods.`,
            healthImpact: 'Limited information is available about specific health impacts.',
            alternatives: ['Natural whole food alternatives when possible'],
            category: 'unknown',
            flags: []
          });
        }
      } catch (err) {
        setError('Failed to load ingredient information');
        console.error('Error fetching ingredient info:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchIngredientInfo();
  }, [ingredient]);

  return (
    <Card className="mt-4 border-2 border-blue-100">
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-medium">
          {ingredient}
        </CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-health-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            <AlertCircle className="h-5 w-5 mx-auto mb-1" />
            <p className="text-sm">{error}</p>
          </div>
        ) : ingredientInfo ? (
          <div className="space-y-3">
            <div className="flex gap-2 items-start">
              <Info className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-700">What is it?</h4>
                <p className="text-sm text-gray-600">{ingredientInfo.description}</p>
              </div>
            </div>
            
            <div className="flex gap-2 items-start">
              <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-700">Health Impact</h4>
                <p className="text-sm text-gray-600">{ingredientInfo.healthImpact}</p>
              </div>
            </div>
            
            <div className="flex gap-2 items-start">
              <Lightbulb className="h-5 w-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-gray-700">Healthier Alternatives</h4>
                <p className="text-sm text-gray-600">{ingredientInfo.alternatives.join(', ')}</p>
              </div>
            </div>
            
            {ingredientInfo.flags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {ingredientInfo.flags.map(flag => (
                  <span key={flag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {flag}
                  </span>
                ))}
              </div>
            )}
            
            <div className="mt-3 pt-3 border-t border-gray-100 text-center">
              <Button 
                variant="link" 
                className="text-xs text-blue-600 flex items-center mx-auto"
                onClick={() => window.open(`https://en.wikipedia.org/wiki/${ingredient.replace(/\s+/g, '_')}`, '_blank')}
              >
                Learn more about {ingredient}
                <ExternalLink className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-gray-500">
            No information available.
          </div>
        )}
      </CardContent>
    </Card>
  );
};
