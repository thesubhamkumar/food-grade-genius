
// Add this to your app's styles or tailwind config extend section
export const scanAnimations = {
  keyframes: {
    scanline: {
      '0%': { top: '0%' },
      '50%': { top: '100%' },
      '100%': { top: '0%' }
    }
  },
  animation: {
    scanline: 'scanline 2s ease-in-out infinite'
  }
};
