
import { Layout } from "@/components/Layout";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { addNewFood, getUserFoods, requestMissingFood } from "@/utils/foodDatabaseManager";

interface FoodItem {
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

const foodDatabase: FoodItem[] = [
  // Dairy Products
  {
    id: "milk-whole",
    name: "Milk (Whole)",
    category: "dairy",
    calories: 149,
    protein: 7.7,
    carbs: 11.7,
    sugar: 12.3,
    fat: 8,
    fiber: 0,
    servingSize: "240ml (1 cup)",
    notes: "Good source of calcium and vitamin D"
  },
  {
    id: "milk-skim",
    name: "Milk (Skim)",
    category: "dairy",
    calories: 83,
    protein: 8.3,
    carbs: 12.2,
    sugar: 12.5,
    fat: 0.2,
    fiber: 0,
    servingSize: "240ml (1 cup)",
    notes: "Lower in calories and fat than whole milk"
  },
  {
    id: "paneer",
    name: "Paneer (Cottage Cheese)",
    category: "dairy",
    calories: 265,
    protein: 18.3,
    carbs: 3.4,
    sugar: 2.1,
    fat: 20.8,
    fiber: 0,
    servingSize: "100g",
    notes: "High in protein and calcium"
  },
  {
    id: "cheese-cheddar",
    name: "Cheddar Cheese",
    category: "dairy",
    calories: 402,
    protein: 24.9,
    carbs: 1.3,
    sugar: 0.5,
    fat: 33.1,
    fiber: 0,
    servingSize: "100g",
    notes: "High in calcium and vitamin B12"
  },
  {
    id: "yogurt-plain",
    name: "Yogurt (Plain)",
    category: "dairy",
    calories: 59,
    protein: 3.5,
    carbs: 4.7,
    sugar: 4.7,
    fat: 3.3,
    fiber: 0,
    servingSize: "100g",
    notes: "Contains probiotics beneficial for gut health"
  },

  // Protein Sources
  {
    id: "soya-chunks",
    name: "Soya Chunks",
    category: "protein",
    calories: 345,
    protein: 52,
    carbs: 33,
    sugar: 0,
    fat: 0.5,
    fiber: 13,
    servingSize: "100g (dry)",
    notes: "Complete plant protein source"
  },
  {
    id: "tofu",
    name: "Tofu",
    category: "protein",
    calories: 76,
    protein: 8,
    carbs: 1.9,
    sugar: 0.5,
    fat: 4.8,
    fiber: 0.3,
    servingSize: "100g",
    notes: "Good source of plant-based protein and calcium"
  },
  {
    id: "chicken-breast",
    name: "Chicken Breast",
    category: "protein",
    calories: 165,
    protein: 31,
    carbs: 0,
    sugar: 0,
    fat: 3.6,
    fiber: 0,
    servingSize: "100g (cooked)",
    notes: "Excellent lean protein source"
  },
  {
    id: "eggs",
    name: "Eggs (Whole)",
    category: "protein",
    calories: 143,
    protein: 12.6,
    carbs: 0.7,
    sugar: 0.4,
    fat: 9.5,
    fiber: 0,
    servingSize: "100g (2 large eggs)",
    notes: "Complete protein with essential nutrients"
  },
  {
    id: "lentils",
    name: "Lentils (Cooked)",
    category: "protein",
    calories: 116,
    protein: 9,
    carbs: 20,
    sugar: 1.8,
    fat: 0.4,
    fiber: 7.9,
    servingSize: "100g",
    notes: "Good source of plant protein and iron"
  },

  // Fruits
  {
    id: "apple",
    name: "Apple",
    category: "fruits",
    calories: 52,
    protein: 0.3,
    carbs: 13.8,
    sugar: 10.4,
    fat: 0.2,
    fiber: 2.4,
    servingSize: "100g (medium apple)",
    notes: "Rich in antioxidants and dietary fiber"
  },
  {
    id: "banana",
    name: "Banana",
    category: "fruits",
    calories: 89,
    protein: 1.1,
    carbs: 22.8,
    sugar: 12.2,
    fat: 0.3,
    fiber: 2.6,
    servingSize: "100g (medium banana)",
    notes: "Good source of potassium and vitamin B6"
  },
  {
    id: "orange",
    name: "Orange",
    category: "fruits",
    calories: 47,
    protein: 0.9,
    carbs: 11.8,
    sugar: 9.4,
    fat: 0.1,
    fiber: 2.4,
    servingSize: "100g",
    notes: "High in vitamin C and antioxidants"
  },

  // Vegetables
  {
    id: "spinach",
    name: "Spinach (Raw)",
    category: "vegetables",
    calories: 23,
    protein: 2.9,
    carbs: 3.6,
    sugar: 0.4,
    fat: 0.4,
    fiber: 2.2,
    servingSize: "100g",
    notes: "Excellent source of iron and vitamins A and K"
  },
  {
    id: "carrot",
    name: "Carrot",
    category: "vegetables",
    calories: 41,
    protein: 0.9,
    carbs: 9.6,
    sugar: 4.7,
    fat: 0.2,
    fiber: 2.8,
    servingSize: "100g",
    notes: "Rich in beta-carotene and vitamin A"
  },
  {
    id: "broccoli",
    name: "Broccoli",
    category: "vegetables",
    calories: 34,
    protein: 2.8,
    carbs: 6.6,
    sugar: 1.7,
    fat: 0.4,
    fiber: 2.6,
    servingSize: "100g",
    notes: "High in vitamin C, K, and folate"
  },

  // Grains
  {
    id: "rice-white",
    name: "Rice (White, Cooked)",
    category: "grains",
    calories: 130,
    protein: 2.7,
    carbs: 28.2,
    sugar: 0.1,
    fat: 0.3,
    fiber: 0.4,
    servingSize: "100g",
    notes: "Easily digestible carbohydrate source"
  },
  {
    id: "rice-brown",
    name: "Rice (Brown, Cooked)",
    category: "grains",
    calories: 112,
    protein: 2.6,
    carbs: 23.5,
    sugar: 0.7,
    fat: 0.9,
    fiber: 1.8,
    servingSize: "100g",
    notes: "Contains more fiber and nutrients than white rice"
  },
  {
    id: "oats",
    name: "Oats (Rolled)",
    category: "grains",
    calories: 389,
    protein: 16.9,
    carbs: 66.3,
    sugar: 0,
    fat: 6.9,
    fiber: 10.6,
    servingSize: "100g (dry)",
    notes: "Rich in soluble fiber beta-glucan"
  },
  {
    id: "quinoa",
    name: "Quinoa (Cooked)",
    category: "grains",
    calories: 120,
    protein: 4.4,
    carbs: 21.3,
    sugar: 0.9,
    fat: 1.9,
    fiber: 2.8,
    servingSize: "100g",
    notes: "Complete protein grain with all essential amino acids"
  },

  // Beverages
  {
    id: "green-tea",
    name: "Green Tea",
    category: "beverages",
    calories: 0,
    protein: 0,
    carbs: 0,
    sugar: 0,
    fat: 0,
    fiber: 0,
    servingSize: "240ml (1 cup)",
    notes: "Contains antioxidants called catechins"
  },
  {
    id: "orange-juice",
    name: "Orange Juice",
    category: "beverages",
    calories: 45,
    protein: 0.7,
    carbs: 10.4,
    sugar: 8.3,
    fat: 0.2,
    fiber: 0.2,
    servingSize: "100ml",
    notes: "High in vitamin C but contains natural sugars"
  },

  // Other
  {
    id: "almonds",
    name: "Almonds",
    category: "other",
    calories: 579,
    protein: 21.2,
    carbs: 21.7,
    sugar: 4.2,
    fat: 49.9,
    fiber: 12.5,
    servingSize: "100g",
    notes: "Good source of vitamin E and healthy fats"
  },
  {
    id: "dark-chocolate",
    name: "Dark Chocolate (70% cocoa)",
    category: "other",
    calories: 598,
    protein: 7.8,
    carbs: 45.9,
    sugar: 24,
    fat: 43,
    fiber: 10.9,
    servingSize: "100g",
    notes: "Contains antioxidants and may improve heart health in moderation"
  }
];

const FoodCompositionsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>(foodDatabase);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [newFoodName, setNewFoodName] = useState("");
  const [missingFoodName, setMissingFoodName] = useState("");
  const [userFoods, setUserFoods] = useState<FoodItem[]>([]);
  const [showUserFoods, setShowUserFoods] = useState(false);
  const { toast } = useToast();

  // Load user's foods from local storage on component mount
  useEffect(() => {
    const loadUserFoods = async () => {
      const foods = await getUserFoods();
      setUserFoods(foods);
    };
    
    loadUserFoods();
  }, []);

  useEffect(() => {
    // Combine built-in database with user-added foods
    const allFoods = [...foodDatabase, ...userFoods];
    
    const filtered = allFoods.filter((food) => {
      const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === "all" || food.category === activeCategory;
      const matchesSource = !showUserFoods || (showUserFoods && food.source === 'user');
      return matchesSearch && matchesCategory && matchesSource;
    });
    
    setFilteredFoods(filtered);
  }, [searchTerm, activeCategory, userFoods, showUserFoods]);

  const handleAddNewFood = async (newFood: Partial<FoodItem>) => {
    try {
      // Call utility function to add the food to local storage
      const addedFood = await addNewFood({
        ...newFood,
        id: `user-${Date.now()}`,
        name: newFoodName,
        category: activeCategory === "all" ? "other" : activeCategory as any,
        calories: parseFloat(newFood.calories?.toString() || "0"),
        protein: parseFloat(newFood.protein?.toString() || "0"),
        carbs: parseFloat(newFood.carbs?.toString() || "0"),
        sugar: parseFloat(newFood.sugar?.toString() || "0"),
        fat: parseFloat(newFood.fat?.toString() || "0"),
        fiber: parseFloat(newFood.fiber?.toString() || "0"),
        servingSize: newFood.servingSize || "100g",
        notes: newFood.notes || "User added food",
        source: 'user',
        dateAdded: Date.now()
      });
      
      // Update the local state
      setUserFoods(prev => [...prev, addedFood]);
      
      toast({
        title: "Food Added",
        description: `${newFoodName} has been added to your food database.`,
      });
      
      // Reset form
      setNewFoodName("");
    } catch (error) {
      console.error("Error adding food:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add food to the database.",
      });
    }
  };

  const handleRequestMissingFood = async () => {
    if (!missingFoodName.trim()) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please enter a food name.",
      });
      return;
    }
    
    try {
      await requestMissingFood(missingFoodName);
      
      toast({
        title: "Request Sent",
        description: `Your request for ${missingFoodName} has been recorded. We'll add it soon!`,
      });
      
      setMissingFoodName("");
    } catch (error) {
      console.error("Error requesting food:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to submit your request.",
      });
    }
  };

  return (
    <Layout>
      <div className="container max-w-6xl px-4 py-8 mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Your Food Compositions</h1>
        
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="search"
              placeholder="Search for foods..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Add Food
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Add New Food</DialogTitle>
                  <DialogDescription>
                    Add a new food item to your personal database.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g. Brown Rice"
                      className="col-span-3"
                      value={newFoodName}
                      onChange={(e) => setNewFoodName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="calories" className="text-right">
                      Calories
                    </Label>
                    <Input
                      id="calories"
                      type="number"
                      placeholder="per serving"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="protein" className="text-right">
                      Protein (g)
                    </Label>
                    <Input
                      id="protein"
                      type="number"
                      placeholder="per serving"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="carbs" className="text-right">
                      Carbs (g)
                    </Label>
                    <Input
                      id="carbs"
                      type="number"
                      placeholder="per serving"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="sugar" className="text-right">
                      Sugar (g)
                    </Label>
                    <Input
                      id="sugar"
                      type="number"
                      placeholder="per serving"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fat" className="text-right">
                      Fat (g)
                    </Label>
                    <Input
                      id="fat"
                      type="number"
                      placeholder="per serving"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="fiber" className="text-right">
                      Fiber (g)
                    </Label>
                    <Input
                      id="fiber"
                      type="number"
                      placeholder="per serving"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="serving" className="text-right">
                      Serving Size
                    </Label>
                    <Input
                      id="serving"
                      placeholder="e.g. 100g, 1 cup"
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="notes" className="text-right">
                      Notes
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Any additional information"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={() => {
                    const newFood: Partial<FoodItem> = {
                      calories: parseFloat((document.getElementById('calories') as HTMLInputElement).value || "0"),
                      protein: parseFloat((document.getElementById('protein') as HTMLInputElement).value || "0"),
                      carbs: parseFloat((document.getElementById('carbs') as HTMLInputElement).value || "0"),
                      sugar: parseFloat((document.getElementById('sugar') as HTMLInputElement).value || "0"),
                      fat: parseFloat((document.getElementById('fat') as HTMLInputElement).value || "0"),
                      fiber: parseFloat((document.getElementById('fiber') as HTMLInputElement).value || "0"),
                      servingSize: (document.getElementById('serving') as HTMLInputElement).value || "100g",
                      notes: (document.getElementById('notes') as HTMLTextAreaElement).value || ""
                    };
                    handleAddNewFood(newFood);
                  }}>
                    Add Food
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Request Food
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Request Missing Food</DialogTitle>
                  <DialogDescription>
                    Can't find what you're looking for? Let us know and we'll add it to our database.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="missing-food" className="text-right">
                      Food Name
                    </Label>
                    <Input
                      id="missing-food"
                      placeholder="e.g. Quinoa Milk"
                      className="col-span-3"
                      value={missingFoodName}
                      onChange={(e) => setMissingFoodName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="additional-info" className="text-right">
                      Details
                    </Label>
                    <Textarea
                      id="additional-info"
                      placeholder="Any additional information about this food"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" onClick={handleRequestMissingFood}>
                    Submit Request
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="flex justify-end mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`text-sm ${showUserFoods ? 'bg-gray-100' : ''}`}
            onClick={() => setShowUserFoods(!showUserFoods)}
          >
            {showUserFoods ? "Show All Foods" : "Show My Added Foods"}
          </Button>
        </div>

        <Tabs defaultValue="all" onValueChange={setActiveCategory}>
          <TabsList className="mb-6 flex flex-wrap">
            <TabsTrigger value="all">All Foods</TabsTrigger>
            <TabsTrigger value="dairy">Dairy</TabsTrigger>
            <TabsTrigger value="protein">Protein Sources</TabsTrigger>
            <TabsTrigger value="fruits">Fruits</TabsTrigger>
            <TabsTrigger value="vegetables">Vegetables</TabsTrigger>
            <TabsTrigger value="grains">Grains</TabsTrigger>
            <TabsTrigger value="beverages">Beverages</TabsTrigger>
            <TabsTrigger value="other">Other</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            <FoodTable foods={filteredFoods} />
          </TabsContent>
          
          {["dairy", "protein", "fruits", "vegetables", "grains", "beverages", "other"].map((category) => (
            <TabsContent key={category} value={category} className="mt-0">
              <FoodTable foods={filteredFoods} />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </Layout>
  );
};

const FoodTable = ({ foods }: { foods: FoodItem[] }) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[200px]">Food</TableHead>
            <TableHead className="text-right">Calories</TableHead>
            <TableHead className="text-right">Protein (g)</TableHead>
            <TableHead className="text-right">Carbs (g)</TableHead>
            <TableHead className="text-right">Sugar (g)</TableHead>
            <TableHead className="text-right">Fat (g)</TableHead>
            <TableHead className="text-right">Fiber (g)</TableHead>
            <TableHead>Serving Size</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {foods.length > 0 ? (
            foods.map((food) => (
              <TableRow key={food.id} className={`hover:bg-gray-50 ${food.source === 'user' ? 'bg-blue-50 hover:bg-blue-100' : ''}`}>
                <TableCell className="font-medium">
                  <div>
                    <div>{food.name} {food.source === 'user' && <span className="text-xs text-blue-500 ml-1">(added by you)</span>}</div>
                    {food.notes && (
                      <div className="text-xs text-gray-500 mt-1">{food.notes}</div>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">{food.calories}</TableCell>
                <TableCell className="text-right">{food.protein}</TableCell>
                <TableCell className="text-right">{food.carbs}</TableCell>
                <TableCell className="text-right">{food.sugar}</TableCell>
                <TableCell className="text-right">{food.fat}</TableCell>
                <TableCell className="text-right">{food.fiber}</TableCell>
                <TableCell>{food.servingSize}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                No foods found matching your search criteria
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default FoodCompositionsPage;
