
// Calculate trust score based on product data and source
export function calculateTrustScore(
  product: any, 
  source: 'primary' | 'secondary' = 'primary'
): number {
  // Base score depends on the data source
  let score = source === 'primary' ? 70 : 50;
  
  // Data completeness score components (maximum +30 points)
  let dataCompletenessScore = 0;
  
  // Check essential data fields
  if (product.product_name) dataCompletenessScore += 3;
  if (product.brands) dataCompletenessScore += 2;
  
  // Ingredients check (up to 8 points)
  if (product.ingredients_text) {
    dataCompletenessScore += 4;
    
    // More detailed if we have structured ingredients
    if (product.ingredients && Array.isArray(product.ingredients) && product.ingredients.length > 0) {
      dataCompletenessScore += 4;
    }
  }
  
  // Nutrition data (up to 8 points)
  if (product.nutriments) {
    const nutriments = product.nutriments;
    const nutritionFields = [
      'energy', 'fat', 'saturated-fat', 'carbohydrates', 
      'sugars', 'proteins', 'fiber', 'salt'
    ];
    
    // +1 point for each nutrition field present
    nutritionFields.forEach(field => {
      if (nutriments[field] !== undefined) {
        dataCompletenessScore += 1;
      }
    });
  }
  
  // Image (up to 3 points)
  if (product.image_url) dataCompletenessScore += 3;
  
  // Nutrition/Health scores (up to 6 points)
  if (product.nutriscore_grade) dataCompletenessScore += 3;
  if (product.ecoscore_grade) dataCompletenessScore += 3;
  
  // Cap completeness score at 30
  dataCompletenessScore = Math.min(dataCompletenessScore, 30);
  
  // Final score calculation
  score += dataCompletenessScore;
  
  // Cap the final score at 100
  return Math.min(Math.round(score), 100);
}
