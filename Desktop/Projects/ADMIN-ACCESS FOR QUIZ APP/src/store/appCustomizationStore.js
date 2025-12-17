import { create } from "zustand";
import { persist } from "zustand/middleware";

// Color palette presets
export const colorPalettes = {
  medical: {
    name: "Médical",
    primary: {
      50: "#f0fdfa",
      100: "#ccfbf1",
      200: "#99f6e4",
      300: "#5eead4",
      400: "#2dd4bf",
      500: "#14b8a6",
      600: "#0d9488",
      700: "#0f766e",
      800: "#115e59",
      900: "#134e4a",
    },
    icon: "🩺",
  },
  tech: {
    name: "Technologie",
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      200: "#bfdbfe",
      300: "#93c5fd",
      400: "#60a5fa",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      800: "#1e40af",
      900: "#1e3a8a",
    },
    icon: "💻",
  },
  wood: {
    name: "Bois",
    primary: {
      50: "#faf5f0",
      100: "#f5e8d8",
      200: "#e8d0b0",
      300: "#d4b088",
      400: "#b88a5c",
      500: "#9d6b3f",
      600: "#7d5534",
      700: "#5d3f28",
      800: "#3d2a1c",
      900: "#1d1510",
    },
    icon: "🪵",
  },
  agency: {
    name: "Agence",
    primary: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7e22ce",
      800: "#6b21a8",
      900: "#581c87",
    },
    icon: "🎯",
  },
  ocean: {
    name: "Océan",
    primary: {
      50: "#f0f9ff",
      100: "#e0f2fe",
      200: "#bae6fd",
      300: "#7dd3fc",
      400: "#38bdf8",
      500: "#0ea5e9",
      600: "#0284c7",
      700: "#0369a1",
      800: "#075985",
      900: "#0c4a6e",
    },
    icon: "🌊",
  },
  sunset: {
    name: "Coucher de soleil",
    primary: {
      50: "#fff7ed",
      100: "#ffedd5",
      200: "#fed7aa",
      300: "#fdba74",
      400: "#fb923c",
      500: "#f97316",
      600: "#ea580c",
      700: "#c2410c",
      800: "#9a3412",
      900: "#7c2d12",
    },
    icon: "🌅",
  },
  forest: {
    name: "Forêt",
    primary: {
      50: "#f0fdf4",
      100: "#dcfce7",
      200: "#bbf7d0",
      300: "#86efac",
      400: "#4ade80",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
      800: "#166534",
      900: "#14532d",
    },
    icon: "🌲",
  },
  royal: {
    name: "Royal",
    primary: {
      50: "#faf5ff",
      100: "#f3e8ff",
      200: "#e9d5ff",
      300: "#d8b4fe",
      400: "#c084fc",
      500: "#a855f7",
      600: "#9333ea",
      700: "#7e22ce",
      800: "#6b21a8",
      900: "#581c87",
    },
    icon: "👑",
  },
};

// Available app icons
export const appIcons = {
  medical: { emoji: "🩺", name: "Stéthoscope" },
  brain: { emoji: "🧠", name: "Cerveau" },
  book: { emoji: "📚", name: "Livre" },
  rocket: { emoji: "🚀", name: "Fusée" },
  star: { emoji: "⭐", name: "Étoile" },
  trophy: { emoji: "🏆", name: "Trophée" },
  lightbulb: { emoji: "💡", name: "Ampoule" },
  target: { emoji: "🎯", name: "Cible" },
  graduation: { emoji: "🎓", name: "Diplôme" },
  puzzle: { emoji: "🧩", name: "Puzzle" },
  diamond: { emoji: "💎", name: "Diamant" },
  flame: { emoji: "🔥", name: "Flamme" },
};

const useAppCustomizationStore = create(
  persist(
    (set) => ({
      // App name (internal)
      appName: "Quiz Maker",
      // Color palette key
      colorPalette: "medical",
      // Selected app icon
      selectedIcon: "medical",
      // Show setup modal (always show on load)
      showSetup: true,
      
      // Actions
      setAppName: (name) => {
        try {
          set({ appName: name || "Quiz Maker" });
        } catch (error) {
          console.error("Error setting app name:", error);
        }
      },
      setColorPalette: (palette) => {
        try {
          set({ colorPalette: palette || "medical" });
        } catch (error) {
          console.error("Error setting color palette:", error);
        }
      },
      setSelectedIcon: (icon) => {
        try {
          set({ selectedIcon: icon || "medical" });
        } catch (error) {
          console.error("Error setting icon:", error);
        }
      },
      setShowSetup: (show) => {
        try {
          set({ showSetup: show });
        } catch (error) {
          console.error("Error setting showSetup:", error);
        }
      },
      resetSetup: () => {
        try {
          set({ showSetup: true });
        } catch (error) {
          console.error("Error resetting setup:", error);
        }
      },
    }),
    {
      name: "quiz-app-customization",
      // Add error handling for persistence
      partialize: (state) => ({
        appName: state.appName,
        colorPalette: state.colorPalette,
        selectedIcon: state.selectedIcon,
        showSetup: state.showSetup,
      }),
    }
  )
);

export default useAppCustomizationStore;

