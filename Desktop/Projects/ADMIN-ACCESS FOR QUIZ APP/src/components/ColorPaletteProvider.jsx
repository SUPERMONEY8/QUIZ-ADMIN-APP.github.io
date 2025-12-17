import { useEffect } from "react";
import useAppCustomizationStore, { colorPalettes } from "../store/appCustomizationStore";

export default function ColorPaletteProvider({ children }) {
  const customizationStore = useAppCustomizationStore();
  const colorPalette = customizationStore?.colorPalette || "medical";
  const palette = colorPalettes[colorPalette] || colorPalettes.medical;

  useEffect(() => {
    try {
      // Apply color palette to CSS variables
      const root = document.documentElement;
      Object.entries(palette.primary).forEach(([shade, color]) => {
        root.style.setProperty(`--color-primary-${shade}`, color);
      });

      // Update Tailwind classes by adding custom CSS
      const styleId = "dynamic-color-palette";
      let styleElement = document.getElementById(styleId);
      
      if (!styleElement) {
        styleElement = document.createElement("style");
        styleElement.id = styleId;
        document.head.appendChild(styleElement);
      }

      // Generate CSS for medical-* classes using the current palette
      // IMPORTANT: Colors stay the same in dark mode - only backgrounds change, not the palette colors
      const css = `
        .bg-medical-50 { background-color: ${palette.primary[50]} !important; }
        .bg-medical-100 { background-color: ${palette.primary[100]} !important; }
        .bg-medical-200 { background-color: ${palette.primary[200]} !important; }
        .bg-medical-300 { background-color: ${palette.primary[300]} !important; }
        .bg-medical-400 { background-color: ${palette.primary[400]} !important; }
        .bg-medical-500 { background-color: ${palette.primary[500]} !important; }
        .bg-medical-600 { background-color: ${palette.primary[600]} !important; }
        .bg-medical-700 { background-color: ${palette.primary[700]} !important; }
        .bg-medical-800 { background-color: ${palette.primary[800]} !important; }
        .bg-medical-900 { background-color: ${palette.primary[900]} !important; }
        
        .text-medical-50 { color: ${palette.primary[50]} !important; }
        .text-medical-100 { color: ${palette.primary[100]} !important; }
        .text-medical-200 { color: ${palette.primary[200]} !important; }
        .text-medical-300 { color: ${palette.primary[300]} !important; }
        .text-medical-400 { color: ${palette.primary[400]} !important; }
        .text-medical-500 { color: ${palette.primary[500]} !important; }
        .text-medical-600 { color: ${palette.primary[600]} !important; }
        .text-medical-700 { color: ${palette.primary[700]} !important; }
        .text-medical-800 { color: ${palette.primary[800]} !important; }
        .text-medical-900 { color: ${palette.primary[900]} !important; }
        
        .border-medical-600 { border-color: ${palette.primary[600]} !important; }
        .border-medical-400 { border-color: ${palette.primary[400]} !important; }
        
        .medical-button {
          background-color: ${palette.primary[600]} !important;
          color: white !important;
        }
        .medical-button:hover {
          background-color: ${palette.primary[700]} !important;
        }
        
        .medical-button-secondary {
          border-color: ${palette.primary[600]} !important;
          color: ${palette.primary[600]} !important;
        }
        .medical-button-secondary:hover {
          background-color: ${palette.primary[50]} !important;
        }
        
        .medical-input:focus {
          border-color: ${palette.primary[600]} !important;
          ring-color: ${palette.primary[600]} !important;
        }
        
        .medical-card {
          border-color: ${palette.primary[200]} !important;
        }
        
        /* Dark mode: Keep palette colors the same, only adjust opacity for backgrounds */
        .dark .bg-medical-100 {
          background-color: ${palette.primary[100]} !important;
          opacity: 0.9;
        }
        .dark .bg-medical-900 {
          background-color: ${palette.primary[900]} !important;
          opacity: 0.8;
        }
      `;

      styleElement.textContent = css;

      // Add background image with palette overlay
      const bgStyleId = "app-background-style";
      let bgStyleElement = document.getElementById(bgStyleId);
      
      if (!bgStyleElement) {
        bgStyleElement = document.createElement("style");
        bgStyleElement.id = bgStyleId;
        document.head.appendChild(bgStyleElement);
      }

      // Create overlay color with 60% opacity (0.6)
      const overlayColor = palette.primary[600] || palette.primary[500];
      const overlayColorWithOpacity = overlayColor + '99'; // 60% opacity in hex (99 = ~60% of FF)
      
      const bgCss = `
        body {
          position: relative;
        }
        
        body::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/app-background.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
          background-repeat: no-repeat;
          opacity: 0.5;
          z-index: -2;
          pointer-events: none;
        }
        
        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: ${overlayColor};
          opacity: 0.6;
          z-index: -1;
          pointer-events: none;
        }
        
        /* Ensure content is above overlay */
        #app {
          position: relative;
          z-index: 1;
        }
      `;

      bgStyleElement.textContent = bgCss;
    } catch (error) {
      console.error("Error applying color palette:", error);
    }
  }, [palette]);

  return <>{children}</>;
}
