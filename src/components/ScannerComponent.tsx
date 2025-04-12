import { useState, useRef, useEffect } from "react";
import { Camera, FileUp, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ScannerComponent = ({ onImageCaptured }: { onImageCaptured: (imageData: string) => void }) => {
  const [capturing, setCapturing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Cleanup function to ensure camera is stopped when component unmounts
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    // Reset any previous errors
    setCameraError(null);
    
    try {
      console.log("Attempting to access camera...");
      
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in your browser");
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      console.log("Camera access granted:", stream);
      
      // Set capturing state first to ensure video element is rendered
      setCapturing(true);
      
      // Add a small delay to ensure video element is mounted before setting srcObject
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            console.log("Video metadata loaded, playing video");
            if (videoRef.current) {
              videoRef.current.play().catch(e => {
                console.error("Error playing video:", e);
                setCameraError("Could not play camera stream");
              });
            }
          };
        } else {
          console.error("Video element still not found after delay");
          setCameraError("Camera initialization failed. Please try again.");
          
          // Clean up the stream if video element is not available
          stream.getTracks().forEach(track => track.stop());
        }
      }, 100);
      
    } catch (error) {
      console.error("Error accessing camera:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown camera error";
      setCameraError(errorMessage);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: `Could not access your camera. ${errorMessage}`
      });
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera...");
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCapturing(false);
      console.log("Camera stopped");
    }
  };

  const captureImage = () => {
    console.log("Capturing image...");
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Make sure dimensions are set correctly
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg");
        console.log("Image captured successfully");
        setPreviewImage(imageData);
        stopCamera();
        onImageCaptured(imageData);
      } else {
        console.error("Could not get canvas context");
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not process the image. Please try again."
        });
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("File selected:", file.name);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageData = e.target?.result as string;
        setPreviewImage(imageData);
        onImageCaptured(imageData);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetCapture = () => {
    setPreviewImage(null);
    setCameraError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const tryAgain = () => {
    setCameraError(null);
    setCapturing(false);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      {/* Always render the canvas to ensure it's available */}
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      {!previewImage ? (
        <>
          {capturing ? (
            <div className="relative w-full">
              {/* Add a key to force re-render of video element */}
              <video 
                key="camera-video"
                ref={videoRef} 
                autoPlay 
                playsInline 
                className="w-full h-auto rounded-lg border-2 border-health-primary"
              ></video>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <Button 
                  variant="destructive"
                  size="icon"
                  onClick={stopCamera}
                  className="rounded-full shadow-lg"
                >
                  <X className="h-5 w-5" />
                </Button>
                <Button 
                  variant="default"
                  size="lg"
                  onClick={captureImage}
                  className="rounded-full bg-white text-health-primary hover:bg-gray-100 shadow-lg"
                >
                  <Camera className="h-6 w-6" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="text-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Scan Food Label</h2>
                <p className="text-gray-600 mt-1">Take a photo of the nutrition facts label</p>
              </div>
              
              {cameraError ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 w-full">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                    <div>
                      <h3 className="text-sm font-medium text-red-800">Camera Error</h3>
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
                  onClick={startCamera}
                  className="h-24 border-dashed border-2 hover:border-health-primary hover:bg-health-secondary/20"
                >
                  <div className="flex flex-col items-center">
                    <Camera className="h-8 w-8 text-health-primary mb-2" />
                    <span>Take Photo</span>
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
          )}
        </>
      ) : (
        <div className="w-full">
          <div className="relative">
            <img 
              src={previewImage} 
              alt="Captured food label" 
              className="w-full h-auto rounded-lg border-2 border-health-primary" 
            />
            <button 
              onClick={resetCapture}
              className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-gray-100"
            >
              <X className="h-5 w-5 text-gray-700" />
            </button>
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Analyzing image...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScannerComponent;
