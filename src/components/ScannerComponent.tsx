
import { useState, useRef } from "react";
import { Camera, FileUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const ScannerComponent = ({ onImageCaptured }: { onImageCaptured: (imageData: string) => void }) => {
  const [capturing, setCapturing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCapturing(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast({
        variant: "destructive",
        title: "Camera Error",
        description: "Could not access your camera. Please check permissions."
      });
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCapturing(false);
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = canvas.toDataURL("image/jpeg");
        setPreviewImage(imageData);
        stopCamera();
        onImageCaptured(imageData);
      }
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
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
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto">
      <canvas ref={canvasRef} className="hidden"></canvas>
      
      {!previewImage ? (
        <>
          {capturing ? (
            <div className="relative w-full">
              <video 
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
