import React, { useState, useRef, useEffect } from 'react';
import Quagga from 'quagga';
import ScanGuideOverlay from './ScanGuideOverlay';
import { toast } from "@/components/ui/use-toast"

interface ScannerComponentProps {
  onDetected: (result: string) => void;
}

const ScannerComponent: React.FC<ScannerComponentProps> = ({ onDetected }) => {
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
        onDetected(result.codeResult.code);
        Quagga.stop();
        setScanning(false);
        toast({
          title: "Barcode Detected",
          description: "Product Found!",
        })
      }
    });

    return () => {
      Quagga.offDetected(null);
      Quagga.stop();
    };
  }, [onDetected]);

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
