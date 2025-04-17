
import React, { useState, useRef, useEffect } from 'react';
import Quagga from '@ericblade/quagga2';
import ScanGuideOverlay from './ScanGuideOverlay';
import { toast } from "@/components/ui/use-toast"

// Utility function for barcode validation
const validateBarcode = (barcode: string): 'VALID' | 'INVALID' => {
  // Check if the barcode contains only numbers
  if (!/^\d+$/.test(barcode)) {
    return 'INVALID';
  }

  // Check if the barcode is either 12 digits (UPC-A) or 13 digits (EAN-13)
  if (barcode.length === 12 || barcode.length === 13) {
    return 'VALID';
  }

  return 'INVALID';
};

// List of harmful additives to check against
const HARMFUL_ADDITIVES = {
  'E250': 'Sodium Nitrite - May form carcinogenic compounds',
  'E951': 'Aspartame - Controversial artificial sweetener linked to headaches and other issues',
  'E110': 'Sunset Yellow - Artificial color linked to hyperactivity and allergies',
  'E129': 'Allura Red - Artificial color linked to hyperactivity in children',
  'E621': 'Monosodium Glutamate (MSG) - May cause headaches and hypersensitivity reactions',
  'E102': 'Tartrazine - Artificial color that may trigger allergic reactions and hyperactivity',
  'E122': 'Carmoisine - Artificial color that may trigger allergic reactions',
  'E211': 'Sodium Benzoate - May form benzene (carcinogen) when combined with vitamin C',
  'E220': 'Sulphur Dioxide - May trigger asthma attacks and allergic reactions',
  'E320': 'Butylated Hydroxyanisole (BHA) - Potential endocrine disruptor and carcinogen',
  'E321': 'Butylated Hydroxytoluene (BHT) - Potential endocrine disruptor',
  'E407': 'Carrageenan - May cause digestive issues and inflammation',
  'E171': 'Titanium Dioxide - Potential carcinogen under investigation',
  'E330': 'Citric Acid - Generally safe but may cause sensitivity in some individuals',
};

// Helper function to check for harmful additives
export const checkHarmfulAdditives = (additivesTags: string[]): { harmful: boolean, details: string[] } => {
  if (!additivesTags || additivesTags.length === 0) {
    return { harmful: false, details: ["No additives listed in the product."] };
  }
  
  const harmfulFound: string[] = [];
  
  additivesTags.forEach(additive => {
    // Clean up the additive code (remove 'en:' prefix if present)
    const cleanCode = additive.replace('en:', '').toUpperCase();
    
    // Check exact matches
    if (HARMFUL_ADDITIVES[cleanCode as keyof typeof HARMFUL_ADDITIVES]) {
      harmfulFound.push(HARMFUL_ADDITIVES[cleanCode as keyof typeof HARMFUL_ADDITIVES]);
    }
    
    // Check for general harmful categories
    if (
      cleanCode.includes('COLOR') || 
      cleanCode.includes('ARTIFICIAL') || 
      cleanCode.includes('PRESERVATIVE') || 
      cleanCode.includes('SWEETENER')
    ) {
      harmfulFound.push(`${cleanCode} - May be an artificial additive with potential health concerns`);
    }
  });
  
  if (harmfulFound.length === 0) {
    return { harmful: false, details: ["No harmful additives detected."] };
  }
  
  return { harmful: true, details: harmfulFound };
};

// Helper function to validate nutritional information
export const validateNutrition = (nutriments: any): { valid: boolean, details: string } => {
  if (!nutriments) {
    return { valid: false, details: "Nutritional information not available for this product." };
  }
  
  const requiredNutrients = ['energy', 'fat', 'sugars', 'proteins'];
  const missingNutrients = requiredNutrients.filter(nutrient => 
    nutriments[nutrient] === undefined || nutriments[nutrient] === null
  );
  
  if (missingNutrients.length > 0) {
    return { 
      valid: false, 
      details: `Nutritional information incomplete. Missing: ${missingNutrients.join(', ')}.` 
    };
  }
  
  return { valid: true, details: "Nutritional information available." };
};

interface ScannerComponentProps {
  onDetected: (result: string) => void;
  onBarcodeCaptured?: (result: string) => void;
}

const ScannerComponent: React.FC<ScannerComponentProps> = ({ onDetected, onBarcodeCaptured }) => {
  const [scanning, setScanning] = useState(false);
  const scannerRef = useRef<HTMLDivElement>(null);

  const configure = () => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            facingMode: "environment",
          },
          target: scannerRef.current || undefined,
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        decoder: {
          readers: ["ean_reader", "ean_8_reader", "upc_reader", "upc_e_reader"],
        },
        locate: true,
      },
      (err: any) => {
        if (err) {
          console.error("Error initializing Quagga:", err);
          return;
        }
        Quagga.start();
        setScanning(true);
      }
    );
  };

  useEffect(() => {
    configure();

    Quagga.onDetected((result) => {
      if (result && result.codeResult && result.codeResult.code) {
        const scannedCode = result.codeResult.code;
        const validationResult = validateBarcode(scannedCode);

        if (validationResult === 'VALID') {
          // Call both handlers to support both prop names
          onDetected(scannedCode);
          if (onBarcodeCaptured) {
            onBarcodeCaptured(scannedCode);
          }
          
          Quagga.stop();
          setScanning(false);
          toast({
            title: "Barcode Detected",
            description: "Product Found!",
          });
        } else {
          toast({
            variant: "destructive",
            title: "Invalid Barcode",
            description: "The scanned code is not a valid product barcode.",
          });
          // Optional: you might want to continue scanning after an invalid barcode
        }
      }
    });

    return () => {
      Quagga.offDetected(null);
      Quagga.stop();
    };
  }, [onDetected, onBarcodeCaptured]);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div ref={scannerRef} className="relative w-full aspect-square overflow-hidden rounded-lg">
        {!scanning && (
          <div className="absolute inset-0 bg-gray-100 flex items-center justify-center text-gray-500">
            Loading Scanner...
          </div>
        )}
        <ScanGuideOverlay />
      </div>
    </div>
  );
};

export default ScannerComponent;
