
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Apple, Carrot, LeafyGreen, Egg, Utensils, Salad } from "lucide-react";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  icon: string;
  rotation: number;
  delay: number;
  duration: number;
}

const BackgroundParticles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  
  useEffect(() => {
    // Create random particles
    const icons = ["apple", "carrot", "leaf", "egg", "utensils", "salad"];
    const newParticles: Particle[] = [];
    
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 20 + 10,
        icon: icons[Math.floor(Math.random() * icons.length)],
        rotation: Math.random() * 360,
        delay: Math.random() * 5,
        duration: Math.random() * 10 + 10 // Between 10-20 seconds
      });
    }
    
    setParticles(newParticles);
  }, []);

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case "apple": 
        return <Apple className="text-health-a/20" />;
      case "carrot": 
        return <Carrot className="text-health-c/20" />;
      case "leaf": 
        return <LeafyGreen className="text-health-primary/20" />;
      case "egg": 
        return <Egg className="text-health-b/20" />;
      case "utensils": 
        return <Utensils className="text-gray-300/20" />;
      case "salad": 
        return <Salad className="text-health-a/20" />;
      default:
        return <Apple className="text-health-a/20" />;
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          initial={{ opacity: 0, scale: 0, rotate: 0 }}
          animate={{ 
            opacity: [0, 0.4, 0],
            scale: [0, 1, 0],
            rotate: particle.rotation,
            y: [0, -100, -200],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear"
          }}
        >
          {renderIcon(particle.icon)}
        </motion.div>
      ))}
    </div>
  );
};

export default BackgroundParticles;
