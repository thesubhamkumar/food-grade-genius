
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import RandomFactGenerator from "@/components/RandomFactGenerator";
import DidYouKnowWidget from "@/components/DidYouKnowWidget";
import { pageTransition } from "@/utils/animations";

const Index = () => {
  return (
    <motion.div 
      className="flex flex-col min-h-screen"
      variants={pageTransition}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      <Header />
      <motion.main 
        className="flex-grow"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <HeroSection />
        <FeaturesSection />
        <RandomFactGenerator />
      </motion.main>
      <DidYouKnowWidget />
      <Footer />
    </motion.div>
  );
};

export default Index;
