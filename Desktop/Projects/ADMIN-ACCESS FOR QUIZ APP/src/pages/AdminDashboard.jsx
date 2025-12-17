import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FileText, BarChart3, Users, Settings } from "lucide-react";
import useAuth from "../hooks/useAuth";
import QuizList from "../components/QuizList.jsx";
import AnalyticsOverview from "../components/AnalyticsOverview.jsx";
import ParticipantManagement from "../components/ParticipantManagement.jsx";
import ThemeToggle from "../components/ThemeToggle";
import PWAInstallButton from "../components/PWAInstallButton.jsx";
import ParametersPanel from "../components/ParametersPanel.jsx";
import { t } from "../store/translations";
import useAppCustomizationStore, { appIcons } from "../store/appCustomizationStore";

const tabs = [
  { key: "quizzes", label: t("nav.myQuizzes"), icon: FileText },
  { key: "analytics", label: t("nav.analytics"), icon: BarChart3 },
  { key: "participants", label: t("nav.participants"), icon: Users },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("quizzes");
  const [showParameters, setShowParameters] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const { appName, selectedIcon } = useAppCustomizationStore();
  const selectedIconData = appIcons[selectedIcon] || appIcons.medical;

  const avatarText = useMemo(() => {
    if (!user?.email) return "A";
    const name = user.email.split("@")[0];
    return name.charAt(0).toUpperCase();
  }, [user]);

  return (
    <div className="min-h-screen transition-colors duration-300">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden md:flex md:w-64 md:flex-col bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-r border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="bg-medical-100 dark:bg-medical-900 p-2 rounded-lg flex items-center justify-center">
                <span className="text-2xl">{selectedIconData.emoji}</span>
              </div>
              <span className="text-lg font-semibold text-gray-900 dark:text-white">{appName || "Quiz Maker"}</span>
            </div>
          </div>
          <nav className="flex-1 px-3 py-4 space-y-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              if (t.path) {
                // External link
                return (
                  <a
                    key={t.key}
                    href={t.path}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 group text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Icon className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    {t.label}
                  </a>
                );
              }
              return (
                <button
                  key={t.key}
                  onClick={() => setActiveTab(t.key)}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 group ${
                    activeTab === t.key
                      ? "bg-medical-100 dark:bg-medical-900/50 text-medical-700 dark:text-medical-400 shadow-sm"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-200 ${activeTab === t.key ? "scale-110" : "group-hover:scale-110"}`} />
                  {t.label}
                </button>
              );
            })}
            
            {/* Parameters Section */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowParameters(true)}
                className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-3 group text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                Paramètres
              </button>
            </div>
          </nav>
        </aside>
        
        {/* Parameters Panel */}
        <ParametersPanel isOpen={showParameters} onClose={() => setShowParameters(false)} />

        {/* Main area */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 px-3 md:px-6 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
              <img
                src="/logo.png"
                alt="Forechole Logo"
                className="h-10 w-10 md:h-12 md:w-12 hidden md:block flex-shrink-0"
              />
              {/* Mobile Layout */}
              <div className="md:hidden flex items-center gap-2 flex-1 min-w-0">
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <div className="bg-medical-100 dark:bg-medical-900/50 p-1.5 rounded-lg flex items-center justify-center shadow-sm">
                    <span className="text-base">{selectedIconData.emoji}</span>
                  </div>
                  <span className="text-xs font-semibold text-gray-900 dark:text-white truncate max-w-[80px]">
                    {appName || "Quiz Maker"}
                  </span>
                </div>
                <div className="relative flex-1 min-w-0">
                  <select
                    value={activeTab}
                    onChange={(e) => setActiveTab(e.target.value)}
                    className="medical-input block w-full text-xs px-2 py-1.5"
                  >
                    {tabs.map((t) => (
                      <option key={t.key} value={t.key}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Right side - Mobile optimized */}
            <div className="flex items-center gap-1.5 md:gap-3 flex-shrink-0">
              {/* Mobile: Compact controls */}
              <div className="md:hidden flex items-center gap-1.5">
                <button
                  onClick={() => setShowParameters(true)}
                  className="p-1.5 rounded-lg text-medical-600 dark:text-medical-400 hover:bg-medical-100 dark:hover:bg-medical-900/30 transition-colors"
                  title="Paramètres"
                  aria-label="Paramètres"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <div className="scale-75 origin-right">
                  <ThemeToggle />
                </div>
                <div className="w-7 h-7 rounded-full bg-medical-600 dark:bg-medical-500 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
                  {avatarText}
                </div>
              </div>
              
              {/* Desktop: Full controls */}
              <div className="hidden md:flex items-center gap-3">
                <PWAInstallButton />
                <ThemeToggle />
                <div className="text-right hidden lg:block">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">{user?.email || "Admin"}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{t("nav.administrator")}</div>
                </div>
                <div className="w-9 h-9 rounded-full bg-medical-600 dark:bg-medical-500 text-white flex items-center justify-center text-sm font-semibold shadow-md hover:shadow-lg transition-shadow duration-200">
                  {avatarText}
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <main className="flex-1 p-4 md:p-6 relative z-10 bg-transparent">
            {activeTab === "quizzes" && <QuizList />}

            {activeTab === "analytics" && (
              <section className="animate-slide-up">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                  <BarChart3 className="h-6 w-6 text-medical-600 dark:text-medical-400" />
                  {t("analytics.title")}
                </h2>
                <p className="mt-2 text-gray-600 dark:text-gray-400 mb-6">
                  {t("analytics.overview")}
                </p>
                <AnalyticsOverview />
              </section>
            )}

            {activeTab === "participants" && (
              <section className="animate-slide-up">
                <ParticipantManagement />
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}



