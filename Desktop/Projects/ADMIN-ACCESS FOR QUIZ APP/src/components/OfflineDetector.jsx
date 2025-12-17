import { useEffect, useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import useAppCustomizationStore from '../store/appCustomizationStore';
import { t } from '../store/translations';

/**
 * OfflineDetector - Shows offline message for PWA when installed on mobile
 * Prevents refresh and shows message with auto-refresh every 2 seconds
 */
export default function OfflineDetector({ children }) {
  const { isInstalled } = usePWAInstall();
  const { appName } = useAppCustomizationStore();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    // Only show offline message if app is installed (PWA mode)
    if (!isInstalled) {
      setShowOfflineMessage(false);
      setIsOnline(navigator.onLine);
      return;
    }

    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
      // Reload page when connection is restored
      window.location.reload();
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
    };

    // Check initial state
    if (!navigator.onLine && isInstalled) {
      setIsOnline(false);
      setShowOfflineMessage(true);
    } else {
      setIsOnline(true);
      setShowOfflineMessage(false);
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Auto-refresh every 2 seconds when offline
    let refreshInterval;
    if (!navigator.onLine && isInstalled) {
      refreshInterval = setInterval(() => {
        // Check if we're back online
        if (navigator.onLine) {
          setIsOnline(true);
          setShowOfflineMessage(false);
          window.location.reload();
        }
      }, 2000);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [isInstalled]);

  // Prevent refresh when offline in PWA mode
  useEffect(() => {
    if (!isInstalled || !showOfflineMessage) return;

    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    // Prevent pull-to-refresh on mobile
    const preventRefresh = (e) => {
      if (!navigator.onLine) {
        e.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('touchmove', preventRefresh, { passive: false });

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('touchmove', preventRefresh);
    };
  }, [isInstalled, showOfflineMessage]);

  // Show offline message overlay
  if (showOfflineMessage && isInstalled) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="medical-card p-8 max-w-md w-full mx-4 text-center">
          <div className="mb-6">
            <div className="bg-medical-100 dark:bg-medical-900/30 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center mb-4">
              <svg
                className="w-10 h-10 text-medical-600 dark:text-medical-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {appName || 'Quiz Maker'}
            </h2>
            <p className="text-lg text-medical-600 dark:text-medical-400 font-medium">
              {t('offline.pleaseEnsureConnected')}
            </p>
          </div>
          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <div className="animate-spin h-4 w-4 border-2 border-medical-600 border-t-transparent rounded-full"></div>
            <span>{t('offline.checkingConnection')}</span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

