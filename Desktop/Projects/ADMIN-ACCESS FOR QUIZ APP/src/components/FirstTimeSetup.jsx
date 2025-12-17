import { useState, useEffect } from "react";
import { Check, Palette, Sparkles, Image as ImageIcon } from "lucide-react";
import useAppCustomizationStore, { colorPalettes, appIcons } from "../store/appCustomizationStore";
import { t } from "../store/translations";

export default function FirstTimeSetup({ onComplete }) {
  const { setAppName, setColorPalette, setSelectedIcon, appName: storedAppName, colorPalette: storedPalette, selectedIcon: storedIcon } = useAppCustomizationStore();
  const [step, setStep] = useState(1);
  const [appName, setAppNameLocal] = useState(storedAppName || "");
  const [selectedPalette, setSelectedPalette] = useState(storedPalette || "medical");
  const [selectedIcon, setSelectedIconLocal] = useState(storedIcon || "medical");

  // Prevent body scroll when setup is open
  useEffect(() => {
    document.body.classList.add('setup-open');
    return () => {
      document.body.classList.remove('setup-open');
    };
  }, []);

  const handleComplete = () => {
    try {
      if (appName.trim()) {
        setAppName(appName.trim());
      }
      setColorPalette(selectedPalette);
      setSelectedIcon(selectedIcon);
      if (onComplete) onComplete();
      // Use window.location for navigation since we're inside Router now
      setTimeout(() => {
        window.location.href = "/admin";
      }, 200);
    } catch (error) {
      console.error("Error completing setup:", error);
      // Still redirect even if there's an error
      if (onComplete) onComplete();
      window.location.href = "/admin";
    }
  };

  const handleSkip = () => {
    try {
      // Keep current values but close setup
      if (onComplete) onComplete();
      setTimeout(() => {
        window.location.href = "/admin";
      }, 200);
    } catch (error) {
      console.error("Error skipping setup:", error);
      if (onComplete) onComplete();
      window.location.href = "/admin";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-2 sm:p-4" style={{ overflow: 'hidden' }}>
      <div className="max-w-2xl w-full h-full max-h-[95vh] bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-2xl flex flex-col animate-slide-up" style={{ overflow: 'hidden' }}>
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 sm:p-6 text-white flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
            <Sparkles className="h-6 w-6 sm:h-8 sm:w-8" />
            <h1 className="text-2xl sm:text-3xl font-bold">{t("setup.welcome")}</h1>
          </div>
          <p className="text-sm sm:text-base text-teal-100">{t("setup.welcomeSubtitle")}</p>
        </div>

        {/* Progress Steps */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-center gap-1 sm:gap-2">
            <div className={`flex items-center gap-1 sm:gap-2 ${step >= 1 ? "text-teal-600 dark:text-teal-400" : "text-gray-400"}`}>
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm ${
                step >= 1 ? "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}>
                {step > 1 ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : "1"}
              </div>
              <span className="text-xs font-medium hidden sm:block">{t("setup.step1")}</span>
            </div>
            <div className={`h-1 w-4 sm:w-8 ${step >= 2 ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"}`} />
            <div className={`flex items-center gap-1 sm:gap-2 ${step >= 2 ? "text-teal-600 dark:text-teal-400" : "text-gray-400"}`}>
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm ${
                step >= 2 ? "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}>
                {step > 2 ? <Check className="h-3 w-3 sm:h-4 sm:w-4" /> : "2"}
              </div>
              <span className="text-xs font-medium hidden sm:block">{t("setup.step2")}</span>
            </div>
            <div className={`h-1 w-4 sm:w-8 ${step >= 3 ? "bg-teal-500" : "bg-gray-300 dark:bg-gray-600"}`} />
            <div className={`flex items-center gap-1 sm:gap-2 ${step >= 3 ? "text-teal-600 dark:text-teal-400" : "text-gray-400"}`}>
              <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-semibold text-xs sm:text-sm ${
                step >= 3 ? "bg-teal-100 dark:bg-teal-900/30 text-teal-600 dark:text-teal-400" : "bg-gray-200 dark:bg-gray-700 text-gray-500"
              }`}>
                3
              </div>
              <span className="text-xs font-medium hidden sm:block">Icône</span>
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8">
          {step === 1 && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("setup.enterAppName")}
                </label>
                <input
                  type="text"
                  value={appName}
                  onChange={(e) => setAppNameLocal(e.target.value)}
                  placeholder={t("setup.appNamePlaceholder")}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-base sm:text-lg"
                  autoFocus
                  maxLength={50}
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-end pt-2">
                <button
                  onClick={handleSkip}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base"
                >
                  {t("setup.skip")}
                </button>
                <button
                  onClick={() => setStep(2)}
                  disabled={!appName.trim()}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-medium transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {t("common.next")}
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-4">
                  {t("setup.selectColorPalette")}
                </label>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                  {t("setup.colorPaletteDescription")}
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4" style={{ maxHeight: 'calc(50vh - 100px)', overflowY: 'auto', paddingRight: '4px' }}>
                  {Object.entries(colorPalettes).map(([key, palette]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedPalette(key)}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        selectedPalette === key
                          ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-lg"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="text-3xl sm:text-4xl">{palette.icon}</div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white text-center">
                          {palette.name}
                        </div>
                        <div className="flex gap-1">
                          {[500, 600, 700].map((shade) => (
                            <div
                              key={shade}
                              className="w-5 h-5 sm:w-6 sm:h-6 rounded-full border border-gray-200 dark:border-gray-600"
                              style={{ backgroundColor: palette.primary[shade] }}
                            />
                          ))}
                        </div>
                        {selectedPalette === key && (
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 dark:text-teal-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setStep(1)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base"
                >
                  {t("common.back")}
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors shadow-lg hover:shadow-xl text-sm sm:text-base"
                >
                  {t("common.next")}
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-4">
                  Choisissez une icône pour votre application
                </label>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-3 sm:mb-4">
                  Cette icône sera utilisée pour représenter votre application
                </p>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4" style={{ maxHeight: 'calc(50vh - 100px)', overflowY: 'auto', paddingRight: '4px' }}>
                  {Object.entries(appIcons).map(([key, icon]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedIconLocal(key)}
                      className={`p-4 sm:p-5 rounded-xl border-2 transition-all duration-200 hover:scale-105 ${
                        selectedIcon === key
                          ? "border-teal-500 bg-teal-50 dark:bg-teal-900/20 shadow-lg"
                          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-2 sm:gap-3">
                        <div className="text-4xl sm:text-5xl">{icon.emoji}</div>
                        <div className="text-xs sm:text-sm font-semibold text-gray-900 dark:text-white text-center">
                          {icon.name}
                        </div>
                        {selectedIcon === key && (
                          <Check className="h-4 w-4 sm:h-5 sm:w-5 text-teal-600 dark:text-teal-400" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={() => setStep(2)}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors font-medium text-sm sm:text-base"
                >
                  {t("common.back")}
                </button>
                <button
                  onClick={handleComplete}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium transition-colors shadow-lg hover:shadow-xl flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <ImageIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                  {t("setup.finish")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

