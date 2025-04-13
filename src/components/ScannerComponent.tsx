
import { useState, useRef, useEffect } from "react";
import { Camera, FileUp, X, AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import Quagga from "@ericblade/quagga2";

type ScannerProps = {
  onBarcodeCaptured: (barcodeData: string) => void;
};

const ScannerComponent = ({ onBarcodeCaptured }: ScannerProps) => {
  const [scanning, setScanning] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [lastResult, setLastResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Clean up Quagga when component unmounts
  useEffect(() => {
    return () => {
      if (scanning) {
        Quagga.stop();
      }
    };
  }, [scanning]);

  // Set up Quagga barcode scanner
  const startBarcodeScanner = async () => {
    setCameraError(null);
    
    try {
      console.log("Initializing barcode scanner...");
      
      // Make sure we wait for the video element to be rendered
      setTimeout(() => {
        if (!videoRef.current) {
          console.error("Video container not found");
          setCameraError("Scanner initialization failed. Please try again.");
          return;
        }
        
        Quagga.init({
          inputStream: {
            name: "Live",
            type: "LiveStream",
            target: videoRef.current,
            constraints: {
              facingMode: "environment",
              width: { min: 640 },
              height: { min: 480 },
              aspectRatio: { min: 1, max: 2 }
            },
          },
          locator: {
            patchSize: "medium",
            halfSample: true
          },
          numOfWorkers: navigator.hardwareConcurrency || 4,
          decoder: {
            readers: [
              "ean_reader",
              "ean_8_reader",
              "upc_reader",
              "upc_e_reader"
            ]
          },
          locate: true
        }, function(err) {
          if (err) {
            console.error("Quagga initialization error:", err);
            setCameraError(err.toString());
            toast({
              variant: "destructive",
              title: "Scanner Error",
              description: `Could not access your camera. ${err}`
            });
            return;
          }
          
          Quagga.start();
          setScanning(true);
          
          Quagga.onDetected((result) => {
            if (result && result.codeResult) {
              const code = result.codeResult.code;
              if (code && code !== lastResult) {
                console.log("Barcode detected:", code);
                setLastResult(code);
                handleBarcodeDetected(code);
              }
            }
          });
          
          console.log("Barcode scanner started successfully");
        });
      }, 500); // Give a little time for the DOM to update
    } catch (error) {
      console.error("Error initializing barcode scanner:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown camera error";
      setCameraError(errorMessage);
      toast({
        variant: "destructive",
        title: "Scanner Error",
        description: `Could not access your camera. ${errorMessage}`
      });
    }
  };

  const stopBarcodeScanner = () => {
    console.log("Stopping barcode scanner...");
    Quagga.stop();
    setScanning(false);
    setLastResult(null);
    console.log("Barcode scanner stopped");
  };

  const handleBarcodeDetected = (barcodeData: string) => {
    console.log("Processing barcode:", barcodeData);
    stopBarcodeScanner();
    onBarcodeCaptured(barcodeData);
    toast({
      title: "Barcode Detected",
      description: `Barcode: ${barcodeData}`,
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          processImageFile(e.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const processImageFile = (imageUrl: string) => {
    const image = new Image();
    image.src = imageUrl;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not process the image. Please try again."
        });
        return;
      }
      
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      
      Quagga.decodeSingle({
        src: canvas.toDataURL(),
        numOfWorkers: navigator.hardwareConcurrency || 4,
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "upc_reader",
            "upc_e_reader"
          ]
        },
        locate: true,
      }, (result) => {
        if (result && result.codeResult) {
          handleBarcodeDetected(result.codeResult.code);
        } else {
          toast({
            variant: "destructive",
            title: "No Barcode Found",
            description: "Could not detect a valid barcode in the image. Please try again."
          });
        }
      });
    };
  };

  const tryAgain = () => {
    setCameraError(null);
    setScanning(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      {!scanning ? (
        <div className="flex flex-col items-center space-y-4 w-full">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Scan Product Barcode</h2>
            <p className="text-gray-600 mt-1">Scan UPC/EAN code on food packaging</p>
          </div>
          
          {cameraError ? (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 w-full">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Scanner Error</h3>
                  <p className="text-sm text-red-700 mt-1">{cameraError}</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="mt-3"
                    onClick={tryAgain}
                  >
                    Try Again
                  </Button>
                </div>
              </div>
            </div>
          ) : null}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <Button 
              variant="outline" 
              onClick={startBarcodeScanner}
              className="h-24 border-dashed border-2 hover:border-health-primary hover:bg-health-secondary/20"
            >
              <div className="flex flex-col items-center">
                <Camera className="h-8 w-8 text-health-primary mb-2" />
                <span>Scan Barcode</span>
              </div>
            </Button>
            
            <Button 
              variant="outline" 
              onClick={() => fileInputRef.current?.click()}
              className="h-24 border-dashed border-2 hover:border-health-primary hover:bg-health-secondary/20"
            >
              <div className="flex flex-col items-center">
                <FileUp className="h-8 w-8 text-health-primary mb-2" />
                <span>Upload Image</span>
              </div>
            </Button>
            <input 
              type="file" 
              ref={fileInputRef}
              accept="image/*" 
              onChange={handleFileUpload} 
              className="hidden" 
            />
          </div>
        </div>
      ) : (
        <div className="relative w-full">
          <div ref={videoRef} className="w-full h-[70vh] max-h-[600px] overflow-hidden rounded-lg border-2 border-health-primary"></div>
          <div className="absolute top-4 right-4 flex justify-center space-x-4">
            <Button 
              variant="destructive"
              size="icon"
              onClick={stopBarcodeScanner}
              className="rounded-full shadow-lg"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
            <div className="bg-white/80 p-2 rounded-full shadow-lg text-sm">
              <p className="text-center">Hold steady, searching for barcode...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerComponent;
