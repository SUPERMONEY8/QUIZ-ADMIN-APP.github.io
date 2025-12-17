import { Moon, Sun } from "lucide-react";
import useThemeStore from "../store/themeStore";
import { useEffect } from "react";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <button
      onClick={toggleTheme}
      className="relative inline-flex h-8 w-14 md:h-9 md:w-16 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
      aria-label="Toggle theme"
      title={theme === "dark" ? "Mode clair" : "Mode sombre"}
    >
      <span
        className={`absolute left-0.5 md:left-1 top-0.5 md:top-1 flex h-7 w-7 md:h-7 md:w-7 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 ${
          theme === "dark" ? "translate-x-6 md:translate-x-7" : "translate-x-0"
        }`}
      >
        {theme === "dark" ? (
          <Moon className="h-3.5 w-3.5 md:h-4 md:w-4 text-medical-600 dark:text-medical-400" />
        ) : (
          <Sun className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-500" />
        )}
      </span>
    </button>
  );
}

