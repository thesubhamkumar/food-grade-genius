
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

const IntroPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/scan');
    }, 3000); // Intro screen will show for 3 seconds

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 animate-fade-in">
      <div className="text-center p-8 rounded-xl glass-morphism">
        <div className="flex justify-center mb-4">
          <Sparkles className="text-purple-600 animate-pulse" size={48} />
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Made by Subham 
          <Heart 
            className="inline-block ml-2 text-red-500 animate-bounce" 
            size={32} 
            fill="currentColor"
          />
        </h1>
        <p className="text-gray-600 animate-fade-in">Loading FoodGrade Genius...</p>
      </div>
    </div>
  );
};

export default IntroPage;
