import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import ScannerComponent, { checkHarmfulAdditives, validateNutrition } from "@/components/ScannerComponent";
import ResultsComponent from "@/components/ResultsComponent";
import ResultsSkeleton from "@/components/ResultsSkeleton";
import { FoodAnalysis } from "@/components/ResultsComponent";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clipboard, Plus, AlertCircle, Clock, XCircle } from "lucide-react";
import { IngredientExplainer } from "@/components/IngredientExplainer";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { calculateTrustScore, getTrustScoreColor, getTrustScoreDescription } from "@/utils/trustScoreCalculator";
import { UserPreferences, defaultPreferences } from "@/utils/userPreferences";
import { cacheProduct, getCachedProduct, getRecentScans } from "@/utils/productCache";
import { addScannedProductToFoods } from "@/utils/foodDatabaseManager";

// Types for the Open Food Facts API response
type OpenFoodFactsProduct = {
  product_name: string;
  brands: string;
  ingredients_text: string;
  nutriments: {
    energy: number;
    fat: number;
    "saturated-fat": number;
    carbohydrates: number;
    sugars: number;
    proteins: number;
    fiber: number;
    salt: number;
    sodium: number;
    [key: string]: number;
  };
  allergens_tags: string[];
  additives_tags: string[];
  ecoscore_grade?: string;
  nutriscore_grade?: string;
  image_url?: string;
  [key: string]: any;
};

// Secondary API response type (simplified)
type SecondaryApiProduct = {
  name: string;
  brand: string;
  ingredients: string;
  nutrients: {
    [key: string]: number;
  };
  allergens?: string[];
  image?: string;
  [key: string]: any;
};

const ScanPage = () => {
  const [scanning, setScanning] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<FoodAnalysis | null>(null);
  const [productDetails, setProductDetails] = useState<OpenFoodFactsProduct | null>(null);
  const [barcode, setBarcode] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<string | null>(null);
  const [trustScore, setTrustScore] = useState<number>(0);
  const [dataSource, setDataSource] = useState<string>("Not found");
  const [userPreferences, setUserPreferences] = useState<UserPreferences>(defaultPreferences);
  const [recentScans, setRecentScans] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("scan");
  const [loadingRecent, setLoadingRecent] = useState(false);
  const { toast } = useToast();

  // Add a new state variable for "added to foods" status
  const [addedToFoods, setAddedToFoods] = useState(false);

  // Load recent scans on component mount
  useEffect(() => {
    const scans = getRecentScans();
    setRecentScans(scans);
  }, []);

  const handleBarcodeCaptured = async (barcodeData: string) => {
    console.log("Barcode captured and being processed:", barcodeData);
    setAnalyzing(true);
    setBarcode(barcodeData);
    setNotFound(false);
    setDataSource("Not found");
    
    // Check cache first
    const cachedProduct = getCachedProduct(barcodeData);
    if (cachedProduct) {
      console.log("Product found in cache:", cachedProduct);
      setProductDetails(cachedProduct.data);
      setDataSource(cachedProduct.source === 'primary' ? 'Open Food Facts (Cached)' : 
                   `${cachedProduct.source} (Cached)`);
      setTrustScore(cachedProduct.trustScore);
      
      // Process the data into our FoodAnalysis format
      const results = processProductData(cachedProduct.data);
      setResults(results);

      // Validate nutritional information
      const nutritionValidation = validateNutrition(cachedProduct.data.nutriments);
      if (!nutritionValidation.valid) {
        toast({
          variant: "destructive",
          title: "Nutrition Warning",
          description: nutritionValidation.details
        });
      }
      
      // Check for harmful additives
      if (cachedProduct.data.additives_tags && cachedProduct.data.additives_tags.length > 0) {
        const additivesCheck = checkHarmfulAdditives(cachedProduct.data.additives_tags);
        if (additivesCheck.harmful) {
          toast({
            variant: "destructive",
            title: "Harmful Additives Detected",
            description: `This product contains potentially harmful additives. Check the details section.`
          });
        }
      }
      
      toast({
        title: "Product Found (Cached)",
        description: `${results.productName} loaded from cache`,
      });
      
      setAnalyzing(false);
      setScanning(false);
      return;
    }
    
    try {
      // Primary lookup: Open Food Facts API
      const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcodeData}.json`);
      const data = await response.json();
      
      if (data.status === 1 && data.product) {
        console.log("Product found in Open Food Facts:", data.product);
        setProductDetails(data.product);
        setDataSource("Open Food Facts");
        
        // Process the data into our FoodAnalysis format
        const results = processProductData(data.product);
        
        // Validate nutritional information
        const nutritionValidation = validateNutrition(data.product.nutriments);
        if (!nutritionValidation.valid) {
          toast({
            variant: "destructive",
            title: "Nutrition Warning",
            description: nutritionValidation.details
          });
        }
        
        // Check for harmful additives
        if (data.product.additives_tags && data.product.additives_tags.length > 0) {
          const additivesCheck = checkHarmfulAdditives(data.product.additives_tags);
          if (additivesCheck.harmful) {
            toast({
              variant: "destructive",
              title: "Harmful Additives Detected",
              description: `This product contains potentially harmful additives. Check the details section.`
            });
          }
        }
        
        // Calculate trust score
        const calculatedTrustScore = calculateTrustScore(data.product);
        setTrustScore(calculatedTrustScore);
        
        // Cache the product for future use
        cacheProduct(barcodeData, data.product, 'primary', calculatedTrustScore);
        
        // Update recent scans list
        const updatedRecentScans = getRecentScans();
        setRecentScans(updatedRecentScans);
        
        setResults(results);
        
        toast({
          title: "Product Found",
          description: `${results.productName} information retrieved successfully`,
        });
      } else {
        console.log("Product not found in Open Food Facts, trying secondary sources...");
        
        // Attempt to get data from a secondary source (simulated for now)
        const secondaryResult = await trySecondaryApis(barcodeData);
        
        if (secondaryResult) {
          console.log("Product found in secondary API:", secondaryResult);
          // Convert to our format
          const convertedData = convertSecondaryApiData(secondaryResult);
          setProductDetails(convertedData);
          setDataSource(secondaryResult.source);
          
          // Process into FoodAnalysis
          const results = processProductData(convertedData);
          
          // Calculate trust score (lower for secondary sources)
          const calculatedTrustScore = calculateTrustScore(convertedData, "secondary");
          setTrustScore(calculatedTrustScore);
          
          // Cache the product
          cacheProduct(barcodeData, convertedData, 'secondary', calculatedTrustScore);
          
          // Update recent scans list
          const updatedRecentScans = getRecentScans();
          setRecentScans(updatedRecentScans);
          
          setResults(results);
          
          toast({
            title: "Product Found (Alternative Source)",
            description: `${results.productName} information retrieved from ${secondaryResult.source}`,
          });
        } else {
          console.log("Product not found in any database");
          setNotFound(true);
          toast({
            variant: "destructive",
            title: "Product Not Found",
            description: "This product was not found in any database. Would you like to add it?"
          });
        }
      }
    } catch (error) {
      console.error("Error fetching product data:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem retrieving product information."
      });
      setNotFound(true);
    } finally {
      setAnalyzing(false);
      setScanning(false);
    }
  };

  // This is a placeholder function - in a real app, this would call actual secondary APIs
  const trySecondaryApis = async (barcode: string): Promise<SecondaryApiProduct & { source: string } | null> => {
    console.log("Attempting secondary API lookup for barcode:", barcode);
    
    // For now, returning null to simulate that no secondary source has the product
    // In a real app, you would call other APIs here like USDA, RapidAPI, etc.
    return null;
  };

  // Convert secondary API data to match our expected OpenFoodFactsProduct format
  const convertSecondaryApiData = (secondaryData: SecondaryApiProduct & { source: string }): OpenFoodFactsProduct => {
    return {
      product_name: secondaryData.name,
      brands: secondaryData.brand,
      ingredients_text: secondaryData.ingredients,
      nutriments: {
        energy: secondaryData.nutrients.energy || 0,
        fat: secondaryData.nutrients.fat || 0,
        "saturated-fat": secondaryData.nutrients.saturatedFat || 0,
        carbohydrates: secondaryData.nutrients.carbohydrates || 0,
        sugars: secondaryData.nutrients.sugars || 0,
        proteins: secondaryData.nutrients.proteins || 0,
        fiber: secondaryData.nutrients.fiber || 0,
        salt: secondaryData.nutrients.salt || 0,
        sodium: secondaryData.nutrients.sodium || 0,
      },
      allergens_tags: secondaryData.allergens || [],
      additives_tags: [],
      image_url: secondaryData.image,
      // Add a source property to track where this data came from
      data_source: secondaryData.source,
    };
  };

  const processProductData = (product: OpenFoodFactsProduct): FoodAnalysis => {
    // Extract and normalize nutritional values
    const nutrition = {
      calories: product.nutriments.energy ? Math.round(product.nutriments.energy / 4.184) : 0, // Convert kJ to kcal
      fat: product.nutriments.fat || 0,
      saturatedFat: product.nutriments["saturated-fat"] || 0,
      carbs: product.nutriments.carbohydrates || 0,
      sugar: product.nutriments.sugars || 0,
      protein: product.nutriments.proteins || 0,
      fiber: product.nutriments.fiber || 0,
      sodium: product.nutriments.sodium || Math.round((product.nutriments.salt || 0) * 400) // Convert salt to sodium approx
    };

    // Process ingredients into a list
    const ingredients = product.ingredients_text 
      ? product.ingredients_text.split(",").map(i => i.trim()) 
      : [];

    // Determine health grade based on Nutri-Score if available
    let grade: "A" | "B" | "C" | "D" | "F" = "C"; // Default grade
    if (product.nutriscore_grade) {
      switch (product.nutriscore_grade.toUpperCase()) {
        case "A": grade = "A"; break;
        case "B": grade = "B"; break;
        case "C": grade = "C"; break;
        case "D": grade = "D"; break;
        case "E": grade = "F"; break; // Convert E to F for consistency
        default: grade = "C";
      }
    } else {
      // Assess based on WHO standards if no Nutri-Score
      grade = assessFoodQuality(nutrition, ingredients).grade;
    }

    // Process concerns (from additives, allergens, etc.)
    const concerns: string[] = [];
    
    // Add allergen warnings
    if (product.allergens_tags && product.allergens_tags.length > 0) {
      concerns.push(`Contains allergens: ${product.allergens_tags.map(a => a.replace('en:', '')).join(', ')}`);
    }
    
    // Add additive warnings - Enhanced with more detailed harmful additive information
    if (product.additives_tags && product.additives_tags.length > 0) {
      const additivesCheck = checkHarmfulAdditives(product.additives_tags);
      
      if (additivesCheck.harmful) {
        // Add each harmful additive as a separate concern for more details
        additivesCheck.details.forEach(detail => {
          concerns.push(detail);
        });
      } else {
        const additivesList = product.additives_tags.slice(0, 3).map(a => a.replace('en:', ''));
        concerns.push(`Contains additives: ${additivesList.join(', ')}${product.additives_tags.length > 3 ? ' and others' : ''}`);
      }
    }
    
    // Nutritional concerns based on WHO standards
    if (nutrition.saturatedFat > 5) {
      concerns.push("High saturated fat content (exceeds WHO recommendation of <10% of energy)");
    }
    
    if (nutrition.sodium > 500) {
      concerns.push("High sodium content (WHO recommends <2000mg/day)");
    }
    
    if (nutrition.sugar > 10) {
      concerns.push("High sugar content (exceeds WHO recommendation of <10% of energy)");
    }

    // Process positives
    const positives: string[] = [];
    
    // Eco-score positives
    if (product.ecoscore_grade && product.ecoscore_grade.toUpperCase() in ['A', 'B']) {
      positives.push(`Good environmental impact (Eco-score ${product.ecoscore_grade.toUpperCase()})`);
    }
    
    // Nutri-score positives
    if (product.nutriscore_grade && product.nutriscore_grade.toUpperCase() in ['A', 'B']) {
      positives.push(`Good nutritional quality (Nutri-score ${product.nutriscore_grade.toUpperCase()})`);
    }
    
    // Nutritional positives based on WHO standards
    if (nutrition.saturatedFat <= 2) {
      positives.push("Low saturated fat (within WHO guideline of <10% of energy)");
    }
    
    if (nutrition.sodium < 140) {
      positives.push("Low sodium content (well within WHO guideline of <2000mg/day)");
    }
    
    if (nutrition.sugar <= 5) {
      positives.push("Low sugar content (within WHO guideline of <10% of energy)");
    }
    
    if (nutrition.fiber > 5) {
      positives.push("Good source of dietary fiber (WHO recommends 25g+ daily)");
    }
    
    if (nutrition.protein > 10) {
      positives.push("Good source of protein");
    }

    // Ensure we have at least one entry for each
    if (concerns.length === 0) concerns.push("No significant nutritional concerns detected");
    if (positives.length === 0) positives.push("No specific health benefits detected");

    return {
      productName: product.product_name || "Unknown Product",
      grade,
      nutrition,
      concerns,
      positives,
      ingredients,
      // Additional fields
      brand: product.brands || "Unknown Brand",
      image: product.image_url || null
    };
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
      ingredients,
      brand: "Unknown Brand",
      image: null
    };
  };

  const resetScan = () => {
    setScanning(true);
    setAnalyzing(false);
    setResults(null);
    setProductDetails(null);
    setBarcode(null);
    setNotFound(false);
    setSelectedIngredient(null);
    setTrustScore(0);
    setDataSource("Not found");
    setActiveTab("scan");
  };

  const copyBarcode = () => {
    if (barcode) {
      navigator.clipboard.writeText(barcode);
      toast({
        title: "Barcode Copied",
        description: `Barcode ${barcode} copied to clipboard`
      });
    }
  };

  const handleAddProduct = () => {
    // Open the Open Food Facts product submission page
    window.open(`https://world.openfoodfacts.org/cgi/product.pl?code=${barcode}`, '_blank');
    toast({
      title: "Add Product",
      description: "Opening Open Food Facts submission page"
    });
  };

  const handleIngredientClick = (ingredient: string) => {
    setSelectedIngredient(ingredient);
  };

  const closeIngredientExplainer = () => {
    setSelectedIngredient(null);
  };

  // Update user preferences (this would be expanded in a real app)
  const updatePreferences = (key: keyof UserPreferences, value: boolean) => {
    setUserPreferences({
      ...userPreferences,
      [key]: value
    });
  };

  // Load a previously scanned product
  const loadRecentProduct = async (barcode: string) => {
    setLoadingRecent(true);
    setActiveTab("scan");
    setBarcode(barcode);
    await handleBarcodeCaptured(barcode);
    setLoadingRecent(false);
  };

  const handleAddToFoods = async () => {
    if (!results) return;
    
    try {
      const newFood = await addScannedProductToFoods(results);
      if (newFood) {
        setAddedToFoods(true);
        toast({
          title: "Added to Foods",
          description: `${results.productName} has been added to your food database.`,
        });
      } else {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add the product to your food database.",
        });
      }
    } catch (error) {
      console.error("Error adding to foods:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred while adding the product to your food database.",
      });
    }
  };

  return (
    <Layout>
      <main className="flex-grow container px-4 py-8 mx-auto">
        <div className="max-w-3xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scan">Scan</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
            
            <TabsContent value="scan" className="mt-4">
              {!scanning && !analyzing && !loadingRecent && (
                <Button 
                  variant="ghost" 
                  className="mb-6 flex items-center text-gray-600 hover:text-health-primary"
                  onClick={resetScan}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Scan Another Product
                </Button>
              )}
              
              {(scanning || loadingRecent) && !analyzing && (
                <ScannerComponent onDetected={handleBarcodeCaptured} />
              )}
              
              {analyzing && (
                <div className="text-center py-12">
                  <ResultsSkeleton />
                </div>
              )}
              
              {!scanning && !analyzing && !loadingRecent && notFound && barcode && (
                <div className="bg-white p-6 rounded-xl shadow-sm">
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 mb-4">
                      <AlertCircle className="h-8 w-8 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800">Product Not Found</h3>
                    <p className="text-gray-600 mt-2">The product with barcode {barcode} was not found in our database.</p>
                  </div>
                  
                  <div className="flex flex-col space-y-4">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm text-gray-500">Barcode</p>
                        <p className="font-medium">{barcode}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={copyBarcode}>
                        <Clipboard className="h-5 w-5" />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="default" 
                      className="w-full gap-2"
                      onClick={handleAddProduct}
                    >
                      <Plus className="h-4 w-4" />
                      Add to Open Food Facts Database
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={resetScan}
                    >
                      Scan Another Product
                    </Button>
                  </div>
                </div>
              )}
              
              {!scanning && !analyzing && !loadingRecent && results && !notFound && (
                <>
                  {trustScore > 0 && (
                    <Card className="mb-4">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-sm font-medium text-gray-700">Data Source: {dataSource}</p>
                            <p className="text-sm text-gray-500">Trust Score: {getTrustScoreDescription(trustScore)}</p>
                          </div>
                          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
                            <span className={`text-xl font-bold ${getTrustScoreColor(trustScore)}`}>
                              {trustScore}%
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                  
                  <ResultsComponent 
                    analysis={results} 
                    onIngredientClick={handleIngredientClick}
                    userPreferences={userPreferences}
                  />
                  
                  {/* Add a button to save the scanned product to foods database */}
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={handleAddToFoods}
                      disabled={addedToFoods}
                    >
                      <Plus className="h-4 w-4" />
                      {addedToFoods ? "Added to Food Database" : "Add to Food Database"}
                    </Button>
                  </div>
                  
                  {selectedIngredient && (
                    <IngredientExplainer 
                      ingredient={selectedIngredient} 
                      onClose={closeIngredientExplainer} 
                    />
                  )}
                </>
              )}
            </TabsContent>
            
            <TabsContent value="history" className="mt-4">
              <div className="bg-white p-6 rounded-xl shadow-sm">
                <h3 className="text-lg font-medium text-gray-900 flex items-center mb-4">
                  <Clock className="h-5 w-5 mr-2 text-blue-500" />
                  Recent Scans
                </h3>
                
                {recentScans.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <p>You haven't scanned any products yet.</p>
                    <Button 
                      variant="outline" 
                      className="mt-4" 
                      onClick={() => setActiveTab("scan")}
                    >
                      Scan Your First Product
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentScans.map((code, index) => {
                      const cached = getCachedProduct(code);
                      return (
                        <div 
                          key={index}
                          className="p-3 border border-gray-200 rounded-lg flex justify-between items-center hover:bg-gray-50 transition-colors cursor-pointer"
                          onClick={() => loadRecentProduct(code)}
                        >
                          <div>
                            <p className="font-medium">
                              {cached?.data?.product_name || `Product ${code}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              {cached?.data?.brands || 'Unknown Brand'} • Barcode: {code}
                            </p>
                          </div>
                          <div>
                            {cached && (
                              <div className={`text-sm font-medium rounded-full w-8 h-8 flex items-center justify-center 
                                ${getTrustScoreColor(cached.trustScore)} bg-gray-100`}>
                                {cached.trustScore}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </Layout>
  );
};

export default ScanPage;
