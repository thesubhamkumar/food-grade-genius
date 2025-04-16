
import { useState, useEffect } from 'react';
import { Quote } from 'lucide-react';

const quotes = [
  {
    text: "Let food be thy medicine and medicine be thy food.",
    author: "Hippocrates"
  },
  {
    text: "You are what you eat, so don't be fast, cheap, easy, or fake.",
    author: "Unknown"
  },
  {
    text: "The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison.",
    author: "Ann Wigmore"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  },
  {
    text: "Your diet is a bank account. Good food choices are good investments.",
    author: "Bethenny Frankel"
  }
];

export const QuotesCarousel = () => {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-health-secondary/30 rounded-xl p-8 max-w-3xl mx-auto">
      <div className="flex justify-center mb-4">
        <Quote className="h-10 w-10 text-health-primary" />
      </div>
      <div className="text-center">
        <p className="text-xl md:text-2xl font-medium italic text-gray-800">
          "{quotes[currentQuoteIndex].text}"
        </p>
        <p className="mt-4 text-gray-600">— {quotes[currentQuoteIndex].author}</p>
      </div>
      <div className="flex justify-center mt-6 space-x-2">
        {quotes.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentQuoteIndex(index)}
            className={`h-2 w-2 rounded-full transition-colors ${
              index === currentQuoteIndex ? 'bg-health-primary' : 'bg-gray-300'
            }`}
            aria-label={`Go to quote ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
