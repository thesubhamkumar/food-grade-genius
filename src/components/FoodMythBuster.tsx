
import { useState } from 'react';
import { motion } from 'framer-motion';
import { BadgeX, BadgeCheck, RefreshCcw } from 'lucide-react';

interface MythProps {
  myth: string;
  truth: string;
}

const myths: MythProps[] = [
  {
    myth: "Eating carrots gives you night vision",
    truth: "While carrots contain vitamin A which is important for eye health, they won't give you superhuman night vision. This myth began as WWII propaganda to hide the use of radar technology."
  },
  {
    myth: "Microwaving food destroys all its nutrients",
    truth: "Microwaving actually preserves nutrients better than many cooking methods because of shorter cooking times. Water-soluble vitamins are preserved better in microwaving than in boiling."
  },
  {
    myth: "Eating before bed causes weight gain",
    truth: "Weight gain is determined by total calorie intake versus expenditure, not the time you eat. However, eating heavy meals before bed may disrupt sleep quality."
  },
  {
    myth: "Brown sugar is healthier than white sugar",
    truth: "Brown sugar is simply white sugar with molasses added back in. While it contains trace minerals, the difference is nutritionally insignificant."
  },
  {
    myth: "MSG (monosodium glutamate) is dangerous",
    truth: "Extensive scientific research has found MSG to be safe for consumption. The 'Chinese Restaurant Syndrome' fears were largely based on unfounded claims and racial bias."
  }
];

const MythCard = ({ myth, truth }: MythProps) => {
  const [isFlipped, setIsFlipped] = useState(false);
  
  return (
    <div 
      className="h-72 w-full perspective-1000 cursor-pointer my-4"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div 
        className="relative w-full h-full transition-all duration-500"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring", damping: 20 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Myth Side (Front) */}
        <div 
          className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg p-6 flex flex-col"
        >
          <div className="flex items-center mb-4">
            <BadgeX className="h-6 w-6 text-health-f mr-2" />
            <h3 className="text-xl font-bold text-gray-800">Food Myth</h3>
          </div>
          <p className="text-lg flex-grow flex items-center justify-center text-center font-medium text-gray-700">
            "{myth}"
          </p>
          <div className="text-center mt-4 text-sm text-gray-500">
            <RefreshCcw className="h-4 w-4 inline mr-1" /> Tap to reveal the truth
          </div>
        </div>
        
        {/* Truth Side (Back) */}
        <div 
          className="absolute w-full h-full backface-hidden bg-white rounded-xl shadow-lg p-6 flex flex-col"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div className="flex items-center mb-4">
            <BadgeCheck className="h-6 w-6 text-health-a mr-2" />
            <h3 className="text-xl font-bold text-gray-800">The Truth</h3>
          </div>
          <p className="text-base flex-grow overflow-auto text-gray-700">
            {truth}
          </p>
          <div className="text-center mt-4 text-sm text-gray-500">
            <RefreshCcw className="h-4 w-4 inline mr-1" /> Tap to see the myth
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FoodMythBuster = () => {
  return (
    <div className="py-12 bg-health-secondary/10">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <h2 className="text-3xl font-bold text-gray-900">Food Myth Busters</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Tap the cards to discover the truth behind common food misconceptions
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myths.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true, margin: "-50px" }}
            >
              <MythCard myth={item.myth} truth={item.truth} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FoodMythBuster;
