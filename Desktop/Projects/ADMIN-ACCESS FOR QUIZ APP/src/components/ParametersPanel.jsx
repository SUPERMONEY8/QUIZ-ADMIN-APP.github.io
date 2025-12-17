import { useState } from "react";
import { Settings, X, Check, Palette, Image as ImageIcon, Type } from "lucide-react";
import useAppCustomizationStore, { colorPalettes, appIcons } from "../store/appCustomizationStore";
import FirstTimeSetup from "./FirstTimeSetup";

export default function ParametersPanel({ isOpen, onClose }) {
  const { appName, colorPalette, selectedIcon, setAppName, setColorPalette, setSelectedIcon, setShowSetup } = useAppCustomizationStore();
  const [localAppName, setLocalAppName] = useState(appName || "");
  const [localPalette, setLocalPalette] = useState(colorPalette || "medical");
  const [localIcon, setLocalIcon] = useState(selectedIcon || "medical");
  const [showFullSetup, setShowFullSetup] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (localAppName.trim()) {
      setAppName(localAppName.trim());
    }
    setColorPalette(localPalette);
    setSelectedIcon(localIcon);
    onClose();
  };

  const handleOpenFullSetup = () => {
    setShowFullSetup(true);
    setShowSetup(true);
  };

  if (showFullSetup) {
    return (
      <FirstTimeSetup
        onComplete={() => {
          setShowFullSetup(false);
          onClose();
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <Settings className="h-5 w-5 text-medical-600 dark:text-medical-400" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Paramètres</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* App Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Type className="h-4 w-4" />
              Nom de l'application
            </label>
            <input
              type="text"
              value={localAppName}
              onChange={(e) => setLocalAppName(e.target.value)}
              placeholder="Quiz Maker"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500 focus:border-transparent"
              maxLength={50}
            />
          </div>

          {/* Color Palette */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <Palette className="h-4 w-4" />
              Palette de couleurs
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(colorPalettes).map(([key, palette]) => (
                <button
                  key={key}
                  onClick={() => setLocalPalette(key)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    localPalette === key
                      ? "border-medical-500 bg-medical-50 dark:bg-medical-900/20 shadow-lg"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-2xl">{palette.icon}</div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white text-center">
                      {palette.name}
                    </div>
                    <div className="flex gap-1">
                      {[500, 600, 700].map((shade) => (
                        <div
                          key={shade}
                          className="w-4 h-4 rounded-full border border-gray-200 dark:border-gray-600"
                          style={{ backgroundColor: palette.primary[shade] }}
                        />
                      ))}
                    </div>
                    {localPalette === key && (
                      <Check className="h-4 w-4 text-medical-600 dark:text-medical-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* App Icon */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              <ImageIcon className="h-4 w-4" />
              Icône de l'application
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {Object.entries(appIcons).map(([key, icon]) => (
                <button
                  key={key}
                  onClick={() => setLocalIcon(key)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                    localIcon === key
                      ? "border-medical-500 bg-medical-50 dark:bg-medical-900/20 shadow-lg"
                      : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-3xl">{icon.emoji}</div>
                    <div className="text-xs font-semibold text-gray-900 dark:text-white text-center">
                      {icon.name}
                    </div>
                    {localIcon === key && (
                      <Check className="h-4 w-4 text-medical-600 dark:text-medical-400" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Setup Button */}
          <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={handleOpenFullSetup}
              className="w-full px-4 py-2.5 rounded-lg border border-medical-600 text-medical-600 dark:text-medical-400 hover:bg-medical-50 dark:hover:bg-medical-900/20 transition-colors font-medium"
            >
              Ouvrir le setup complet
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium"
          >
            Annuler
          </button>
          <button
            onClick={handleSave}
            className="flex-1 px-4 py-2.5 rounded-lg bg-medical-600 hover:bg-medical-700 text-white font-medium transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Check className="h-4 w-4" />
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}

