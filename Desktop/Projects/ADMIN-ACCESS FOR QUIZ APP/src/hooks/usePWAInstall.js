import { useState, useEffect } from 'react';

/**
 * Custom hook for handling PWA installation
 * @returns {Object} { isInstallable, isInstalled, install, showIOSInstructions }
 */
export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if running on iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
    setIsIOS(iOS);

    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone) {
      setIsInstalled(true);
      return;
    }

    // Listen for the beforeinstallprompt event (Chrome/Edge on Android)
    const handleBeforeInstallPrompt = (e) => {
      // Prevent the mini-infobar from appearing
      e.preventDefault();
      // Save the event so it can be triggered later
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) {
      return false;
    }

    try {
      // Show the install prompt
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        setIsInstalled(true);
        setIsInstallable(false);
      }
      
      // Clear the deferred prompt
      setDeferredPrompt(null);
      return outcome === 'accepted';
    } catch (error) {
      console.error('Error during installation:', error);
      return false;
    }
  };

  const showIOSInstructions = () => {
    // Show instructions for iOS users
    alert(
      'To install this app on your iOS device:\n\n' +
      '1. Tap the Share button (square with arrow) at the bottom of the screen\n' +
      '2. Scroll down and tap "Add to Home Screen"\n' +
      '3. Tap "Add" in the top right corner\n\n' +
      'The app will then appear on your home screen!'
    );
  };

  return {
    isInstallable,
    isInstalled,
    isIOS,
    install,
    showIOSInstructions,
  };
}

