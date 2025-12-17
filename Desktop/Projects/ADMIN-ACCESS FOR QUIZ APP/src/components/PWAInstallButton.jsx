import { Download, Check } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export default function PWAInstallButton() {
  const { isInstallable, isInstalled, isIOS, install, showIOSInstructions } = usePWAInstall();

  // Don't show button if already installed
  if (isInstalled) {
    return null;
  }

  // Don't show button if not installable and not iOS
  if (!isInstallable && !isIOS) {
    return null;
  }

  const handleClick = () => {
    if (isIOS) {
      showIOSInstructions();
    } else {
      install();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 bg-medical-600 hover:bg-medical-700 text-white shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      title={isIOS ? "Install App (iOS)" : "Install App"}
    >
      {isInstalled ? (
        <>
          <Check className="h-4 w-4" />
          <span className="hidden sm:inline">Installed</span>
        </>
      ) : (
        <>
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Install App</span>
        </>
      )}
    </button>
  );
}

