
// Calculate trust score based on product data and source
export function calculateTrustScore(
  product: any, 
  source: 'primary' | 'secondary' | 'tertiary' | 'community' = 'primary'
): number {
  // Base score depends on the data source
  let score = source === 'primary' ? 70 : 
             source === 'secondary' ? 50 : 
             source === 'community' ? 40 : 30;
  
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
  
  // Data verification/cross-checking (for primary source only)
  if (source === 'primary' && product._last_edit_dates_tags && Array.isArray(product._last_edit_dates_tags)) {
    // More recent edits earn higher scores (max 5 points)
    const lastEditDate = new Date(product._last_edit_dates_tags[0]);
    const currentDate = new Date();
    const monthsSinceLastEdit = (currentDate.getFullYear() - lastEditDate.getFullYear()) * 12 + 
                                (currentDate.getMonth() - lastEditDate.getMonth());
    
    if (monthsSinceLastEdit < 3) dataCompletenessScore += 5;  // Updated in last 3 months
    else if (monthsSinceLastEdit < 6) dataCompletenessScore += 3;  // Updated in last 6 months
    else if (monthsSinceLastEdit < 12) dataCompletenessScore += 1;  // Updated in last year
  }
  
  // Cap completeness score at 30
  dataCompletenessScore = Math.min(dataCompletenessScore, 30);
  
  // Final score calculation
  score += dataCompletenessScore;
  
  // Cap the final score at 100
  return Math.min(Math.round(score), 100);
}

// Function to get a color class based on trust score
export function getTrustScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-amber-500';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-500';
}

// Function to get a qualitative description of the trust score
export function getTrustScoreDescription(score: number): string {
  if (score >= 80) return 'Highly Reliable';
  if (score >= 60) return 'Mostly Reliable';
  if (score >= 40) return 'Somewhat Reliable';
  return 'Low Reliability';
}
