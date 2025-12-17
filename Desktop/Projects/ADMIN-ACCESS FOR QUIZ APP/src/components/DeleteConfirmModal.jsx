import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { t } from "../store/translations";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="medical-card p-6 max-w-md w-full mx-4 animate-slide-up relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-4 pr-8">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
              {title || t("modal.deleteQuiz")}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {message || t("modal.cannotUndo")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onConfirm}
                className="flex-1 medical-button bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800"
              >
                {t("common.delete")}
              </button>
              <button
                onClick={onClose}
                className="flex-1 medical-button-secondary"
              >
                {t("common.cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

