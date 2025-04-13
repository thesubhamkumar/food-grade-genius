
// User preferences for food products
export interface UserPreferences {
  isVegan: boolean;
  isVegetarian: boolean;
  isGlutenFree: boolean;
  isLactoseFree: boolean;
  isLowSugar: boolean;
  isLowSodium: boolean;
  isHighProtein: boolean;
  isOrganicOnly: boolean;
  noPalmOil: boolean;
  noArtificialColors: boolean;
  noArtificialFlavors: boolean;
  noPreservatives: boolean;
}

// Default preferences (all set to false)
export const defaultPreferences: UserPreferences = {
  isVegan: false,
  isVegetarian: false,
  isGlutenFree: false,
  isLactoseFree: false,
  isLowSugar: false,
  isLowSodium: false,
  isHighProtein: false,
  isOrganicOnly: false,
  noPalmOil: false,
  noArtificialColors: false,
  noArtificialFlavors: false,
  noPreservatives: false
};

// Helper function to check if a product meets preferences
export function checkProductPreferences(
  ingredients: string[], 
  nutrition: { [key: string]: number },
  preferences: UserPreferences
): { matches: boolean; warnings: string[] } {
  const warnings: string[] = [];
  
  // Compile ingredient list as lowercase for case-insensitive matching
  const ingredientsLower = ingredients.map(i => i.toLowerCase());
  
  // Check vegan status
  if (preferences.isVegan) {
    const nonVeganIngredients = [
      'milk', 'cheese', 'butter', 'cream', 'yogurt', 'egg', 
      'honey', 'meat', 'beef', 'chicken', 'pork', 'fish', 
      'gelatin', 'whey', 'casein', 'lactose'
    ];
    
    for (const ingredient of nonVeganIngredients) {
      if (ingredientsLower.some(i => i.includes(ingredient))) {
        warnings.push('Contains non-vegan ingredients');
        break;
      }
    }
  }
  
  // Check vegetarian status
  if (preferences.isVegetarian) {
    const nonVegetarianIngredients = [
      'meat', 'beef', 'chicken', 'pork', 'fish', 'gelatin', 
      'lard', 'tallow', 'rennet'
    ];
    
    for (const ingredient of nonVegetarianIngredients) {
      if (ingredientsLower.some(i => i.includes(ingredient))) {
        warnings.push('Contains non-vegetarian ingredients');
        break;
      }
    }
  }
  
  // Check gluten-free status
  if (preferences.isGlutenFree) {
    const glutenIngredients = [
      'wheat', 'barley', 'rye', 'oats', 'malt', 'gluten'
    ];
    
    for (const ingredient of glutenIngredients) {
      if (ingredientsLower.some(i => i.includes(ingredient))) {
        warnings.push('Contains gluten');
        break;
      }
    }
  }
  
  // Check lactose-free status
  if (preferences.isLactoseFree) {
    const lactoseIngredients = [
      'milk', 'cream', 'cheese', 'butter', 'yogurt', 'whey',
      'lactose', 'casein'
    ];
    
    for (const ingredient of lactoseIngredients) {
      if (ingredientsLower.some(i => i.includes(ingredient))) {
        warnings.push('Contains lactose');
        break;
      }
    }
  }
  
  // Check low sugar status
  if (preferences.isLowSugar && nutrition && nutrition.sugar > 5) {
    warnings.push('Contains more than 5g of sugar per 100g');
  }
  
  // Check low sodium status
  if (preferences.isLowSodium && nutrition && nutrition.sodium > 120) {
    warnings.push('Contains more than 120mg of sodium per 100g');
  }
  
  // Check high protein status
  if (preferences.isHighProtein && nutrition && nutrition.protein < 10) {
    warnings.push('Contains less than 10g of protein per 100g');
  }
  
  // Check organic preference
  if (preferences.isOrganicOnly && !ingredientsLower.some(i => i.includes('organic'))) {
    warnings.push('Product may not be organic');
  }
  
  // Check palm oil status
  if (preferences.noPalmOil) {
    if (ingredientsLower.some(i => i.includes('palm oil') || i.includes('palm kernel oil'))) {
      warnings.push('Contains palm oil');
    }
  }
  
  // Check artificial colors
  if (preferences.noArtificialColors) {
    const artificialColors = [
      'yellow 5', 'yellow 6', 'red 40', 'blue 1', 'blue 2',
      'E102', 'E104', 'E110', 'E122', 'E124', 'E129', 'E133'
    ];
    
    for (const color of artificialColors) {
      if (ingredientsLower.some(i => i.includes(color))) {
        warnings.push('Contains artificial colors');
        break;
      }
    }
  }
  
  // Check artificial flavors
  if (preferences.noArtificialFlavors) {
    if (ingredientsLower.some(i => 
      i.includes('artificial flavor') || 
      i.includes('artificial flavour')
    )) {
      warnings.push('Contains artificial flavors');
    }
  }
  
  // Check preservatives
  if (preferences.noPreservatives) {
    const preservatives = [
      'sodium benzoate', 'potassium sorbate', 'BHA', 'BHT',
      'E200', 'E211', 'E212', 'E220', 'E250', 'E251'
    ];
    
    for (const preservative of preservatives) {
      if (ingredientsLower.some(i => i.includes(preservative))) {
        warnings.push('Contains preservatives');
        break;
      }
    }
  }
  
  return {
    matches: warnings.length === 0,
    warnings
  };
}
