
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Lightbulb, Apple, Brain, Heart, Salad } from "lucide-react";
import { fadeIn, buttonHover } from '@/utils/animations';

const foodFacts = [
  {
    fact: "Honey is the only food that doesn't spoil. Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible!",
    icon: <Apple className="h-8 w-8 text-health-primary" />
  },
  {
    fact: "Your brain uses about 20% of your total calorie intake, making nutrient-dense foods crucial for cognitive function.",
    icon: <Brain className="h-8 w-8 text-health-primary" />
  },
  {
    fact: "Avocados have more potassium than bananas, making them excellent for heart health and blood pressure regulation.",
    icon: <Heart className="h-8 w-8 text-health-primary" />
  },
  {
    fact: "Broccoli contains more vitamin C than oranges by weight, supporting immune health and collagen production.",
    icon: <Salad className="h-8 w-8 text-health-primary" />
  },
  {
    fact: "Cinnamon has been shown to lower blood sugar levels and has a positive effect on blood markers for those with Type 2 diabetes.",
    icon: <Heart className="h-8 w-8 text-health-primary" />
  },
  {
    fact: "Eating dark chocolate has been shown to reduce the risk of heart disease by up to 30% when consumed in moderation.",
    icon: <Heart className="h-8 w-8 text-health-primary" />
  },
  {
    fact: "Eggs contain all nine essential amino acids, making them one of the most complete protein sources available.",
    icon: <Apple className="h-8 w-8 text-health-primary" />
  },
];

const RandomFactGenerator = () => {
  const [currentFact, setCurrentFact] = useState(foodFacts[0]);
  const [isAnimating, setIsAnimating] = useState(false);

  const generateRandomFact = () => {
    setIsAnimating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * foodFacts.length);
      setCurrentFact(foodFacts[randomIndex]);
      setIsAnimating(false);
    }, 500);
  };

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-2xl mx-auto my-10">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Lightbulb className="h-6 w-6 text-health-primary" />
        <h3 className="text-xl font-bold text-gray-800">Random Food Fact Generator</h3>
      </div>
      
      <motion.div 
        className="bg-health-secondary/20 rounded-lg p-6 my-4 relative overflow-hidden"
        variants={fadeIn}
        initial="hidden"
        animate={isAnimating ? "hidden" : "show"}
      >
        <div className="flex items-start gap-4">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isAnimating ? 360 : 0 }}
            transition={{ duration: 0.5 }}
            className="flex-shrink-0 mt-1"
          >
            {currentFact.icon}
          </motion.div>
          <p className="text-gray-700 text-lg">{currentFact.fact}</p>
        </div>
      </motion.div>

      <motion.div className="flex justify-center" variants={buttonHover} whileHover="hover" whileTap="tap">
        <Button 
          onClick={generateRandomFact}
          className="flex items-center gap-2 bg-health-primary hover:bg-green-600 text-white px-6 py-2"
          disabled={isAnimating}
        >
          <Lightbulb className="h-5 w-5" />
          Reveal New Fact
        </Button>
      </motion.div>
    </div>
  );
};

export default RandomFactGenerator;
