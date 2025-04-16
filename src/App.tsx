
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import ScrollProgress from "./components/ScrollProgress";
import BackgroundParticles from "./components/BackgroundParticles";
import IntroPage from "./pages/IntroPage";
import Index from "./pages/Index";
import ScanPage from "./pages/ScanPage";
import AboutPage from "./pages/AboutPage";
import HowToUsePage from "./pages/HowToUsePage";
import FoodCompositionsPage from "./pages/FoodCompositionsPage";
import NotFound from "./pages/NotFound";

// Create a client
const queryClient = new QueryClient();

// Animated routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<IntroPage />} />
        <Route path="/home" element={<Index />} />
        <Route path="/food-compositions" element={<FoodCompositionsPage />} />
        <Route path="/scan" element={<ScanPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/how-to-use" element={<HowToUsePage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <ScrollProgress />
          <BackgroundParticles />
          <Toaster />
          <Sonner />
          <AnimatedRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
