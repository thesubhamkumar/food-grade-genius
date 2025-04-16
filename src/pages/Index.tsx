
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
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
      </motion.main>
      <Footer />
    </motion.div>
  );
};

export default Index;
