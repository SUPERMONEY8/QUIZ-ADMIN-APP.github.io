import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import CreateQuizPage from "./pages/CreateQuizPage.jsx";
import QuizQuestionsPage from "./pages/QuizQuestionsPage.jsx";
import EditQuestionPage from "./pages/EditQuestionPage.jsx";
import QuizAnalyticsPage from "./pages/QuizAnalyticsPage.jsx";
import ManualGradingPage from "./pages/ManualGradingPage.jsx";
import TakeQuizPage from "./pages/TakeQuizPage.jsx";
import PageTransition from "./components/PageTransition.jsx";
import useThemeStore from "./store/themeStore.js";
import useAppCustomizationStore from "./store/appCustomizationStore.js";
import FirstTimeSetup from "./components/FirstTimeSetup.jsx";
import ColorPaletteProvider from "./components/ColorPaletteProvider.jsx";
import OfflineDetector from "./components/OfflineDetector.jsx";
import { getOrCreateUserId } from "./utils/userManager.js";

// Admin route without login - directly shows dashboard
function AdminRoute({ children }) {
  // No authentication check - directly show content
  return children;
}

function AppRoutes() {
  return (
    <PageTransition>
      <Routes>
          {/* Admin Routes - No login required */}
          <Route
            path="/"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/new-quiz"
            element={
              <AdminRoute>
                <CreateQuizPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/quizzes/:quizId/questions"
            element={
              <AdminRoute>
                <QuizQuestionsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/quizzes/:quizId/questions/:questionId"
            element={
              <AdminRoute>
                <EditQuestionPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/results/:quizId"
            element={
              <AdminRoute>
                <QuizAnalyticsPage />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/grading"
            element={
              <AdminRoute>
                <ManualGradingPage />
              </AdminRoute>
            }
          />
          
          {/* Quiz Taking Route - Public access */}
          <Route
            path="/quiz/:quizId/start"
            element={<TakeQuizPage />}
          />
          
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </PageTransition>
  );
}

export default function App() {
  const { theme } = useThemeStore();
  const customizationStore = useAppCustomizationStore();
  const showSetup = customizationStore?.showSetup ?? true;
  const appName = customizationStore?.appName;
  const [isClient, setIsClient] = useState(false);

  // Only check setup on client side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
    // Initialize user ID for multi-tenant support
    getOrCreateUserId().catch(console.error);
  }, []);

  // Debug logging in production
  useEffect(() => {
    if (import.meta.env.PROD) {
      console.log('🔍 App state:', {
        isClient,
        showSetup,
        hasCustomizationStore: !!customizationStore,
      });
    }
  }, [isClient, showSetup, customizationStore]);

  useEffect(() => {
    try {
      const root = document.documentElement;
      if (theme === "dark") {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    } catch (err) {
      console.error("Error setting theme:", err);
    }
  }, [theme]);

  useEffect(() => {
    try {
      // Update document title with custom app name
      if (appName) {
        document.title = appName;
        
        // Update meta tags for PWA
        const appleTitleMeta = document.querySelector('meta[name="apple-mobile-web-app-title"]');
        if (appleTitleMeta) {
          appleTitleMeta.setAttribute('content', appName);
        }
        
        // Update manifest.json dynamically
        const manifestLink = document.querySelector('link[rel="manifest"]');
        if (manifestLink) {
          // Fetch and update manifest
          fetch('/manifest.json')
            .then(res => res.json())
            .then(manifest => {
              manifest.name = appName;
              manifest.short_name = appName.length > 12 ? appName.substring(0, 12) : appName;
              
              // Create blob URL for updated manifest
              const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              
              // Update manifest link
              manifestLink.setAttribute('href', url);
            })
            .catch(err => console.error('Error updating manifest:', err));
        }
      }
    } catch (err) {
      console.error("Error setting title:", err);
    }
  }, [appName]);

  // Show loading state until client-side hydration is complete
  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-teal-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
        </div>
      </div>
    );
  }

  // Always wrap in Router and ColorPaletteProvider first
  return (
    <ColorPaletteProvider>
      <OfflineDetector>
        <BrowserRouter>
          {showSetup ? (
            <FirstTimeSetup
              onComplete={() => {
                customizationStore.setShowSetup(false);
              }}
            />
          ) : (
            <AppRoutes />
          )}
        </BrowserRouter>
      </OfflineDetector>
    </ColorPaletteProvider>
  );
}

