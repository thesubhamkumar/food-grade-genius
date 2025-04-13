
import React from 'react';

export const ScanGuideOverlay = () => {
  return (
    <div className="absolute inset-0 z-10 pointer-events-none">
      {/* Darkened corners */}
      <div className="absolute inset-0 bg-black/40"></div>
      
      {/* Cut-out center box */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-32 border-2 border-white/80 rounded-lg">
        {/* Corner markers */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-health-primary"></div>
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-health-primary"></div>
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-health-primary"></div>
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-health-primary"></div>
        
        {/* Scanner line animation */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-health-primary/70 animate-[scanline_2s_ease-in-out_infinite]"></div>
      </div>
      
      {/* Instructions */}
      <div className="absolute bottom-12 left-0 right-0 text-center">
        <div className="inline-block px-3 py-1 bg-white/80 rounded-full text-sm font-medium text-gray-800">
          Align barcode within the box
        </div>
      </div>
    </div>
  );
};

export default ScanGuideOverlay;
