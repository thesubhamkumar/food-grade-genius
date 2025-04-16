
// Constants
const USER_FOODS_KEY = 'user_foods';
const MISSING_FOODS_REQUESTS_KEY = 'missing_foods_requests';

// Types
export interface FoodItem {
  id: string;
  name: string;
  category: "dairy" | "protein" | "fruits" | "vegetables" | "grains" | "beverages" | "other";
  calories: number;
  protein: number;
  carbs: number;
  sugar: number;
  fat: number;
  fiber: number;
  servingSize: string;
  notes?: string;
  source?: string;
  dateAdded?: number;
}

export interface MissingFoodRequest {
  name: string;
  details?: string;
  requestDate: number;
  status: 'pending' | 'approved' | 'rejected';
}

// Get all user-added foods from localStorage
export const getUserFoods = async (): Promise<FoodItem[]> => {
  try {
    const storedFoods = localStorage.getItem(USER_FOODS_KEY);
    if (storedFoods) {
      return JSON.parse(storedFoods);
    }
    return [];
  } catch (error) {
    console.error('Error retrieving user foods:', error);
    return [];
  }
};

// Add a new food to the user's personal database
export const addNewFood = async (food: FoodItem): Promise<FoodItem> => {
  try {
    const existingFoods = await getUserFoods();
    const newFoods = [...existingFoods, food];
    localStorage.setItem(USER_FOODS_KEY, JSON.stringify(newFoods));
    return food;
  } catch (error) {
    console.error('Error adding new food:', error);
    throw new Error('Failed to add food to database');
  }
};

// Add scanned product to user's food database
export const addScannedProductToFoods = async (productData: any): Promise<FoodItem | null> => {
  if (!productData) return null;
  
  try {
    // Extract relevant nutritional information from the scanned product
    const newFood: FoodItem = {
      id: `scanned-${Date.now()}`,
      name: productData.productName || 'Unknown Product',
      category: 'other', // Default category
      calories: productData.nutrition?.calories || 0,
      protein: productData.nutrition?.protein || 0,
      carbs: productData.nutrition?.carbs || 0,
      sugar: productData.nutrition?.sugar || 0,
      fat: productData.nutrition?.fat || 0,
      fiber: productData.nutrition?.fiber || 0,
      servingSize: '100g', // Default serving size
      notes: `Added from scan. Brand: ${productData.brand || 'Unknown'}`,
      source: 'scan',
      dateAdded: Date.now()
    };
    
    return await addNewFood(newFood);
  } catch (error) {
    console.error('Error adding scanned product to foods:', error);
    return null;
  }
};

// Request a missing food to be added to the database
export const requestMissingFood = async (foodName: string, details?: string): Promise<void> => {
  try {
    const request: MissingFoodRequest = {
      name: foodName,
      details: details || '',
      requestDate: Date.now(),
      status: 'pending'
    };
    
    // Get existing requests
    const storedRequests = localStorage.getItem(MISSING_FOODS_REQUESTS_KEY);
    const existingRequests: MissingFoodRequest[] = storedRequests ? JSON.parse(storedRequests) : [];
    
    // Add new request
    localStorage.setItem(
      MISSING_FOODS_REQUESTS_KEY,
      JSON.stringify([...existingRequests, request])
    );
  } catch (error) {
    console.error('Error requesting missing food:', error);
    throw new Error('Failed to submit food request');
  }
};

// Get all missing food requests
export const getMissingFoodRequests = async (): Promise<MissingFoodRequest[]> => {
  try {
    const storedRequests = localStorage.getItem(MISSING_FOODS_REQUESTS_KEY);
    if (storedRequests) {
      return JSON.parse(storedRequests);
    }
    return [];
  } catch (error) {
    console.error('Error retrieving missing food requests:', error);
    return [];
  }
};
