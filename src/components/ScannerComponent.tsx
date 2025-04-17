
import React, { useState, useRef, useEffect } from 'react';
import Quagga from '@ericblade/quagga2';
import ScanGuideOverlay from './ScanGuideOverlay';
import { toast } from "@/components/ui/use-toast"

// New utility function for barcode validation
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
