import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { quizOperations } from "../utils/databaseConfig";
import useAuth from "../hooks/useAuth";
import { t } from "../store/translations";

const maxTitle = 100;
const maxDescription = 500;

export default function CreateQuizForm() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [difficulty, setDifficulty] = useState("Medium");
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [randomizeAnswers, setRandomizeAnswers] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const realQuizIdRef = useRef(null);

  const validate = () => {
    const errs = [];
    if (!title.trim()) errs.push(t("error.updateFailed"));
    if (title.length > maxTitle) errs.push(`Title must be ≤ ${maxTitle} characters.`);
    if (description.length > maxDescription) errs.push(`Description must be ≤ ${maxDescription} characters.`);
    const d = Number(duration);
    if (!Number.isFinite(d) || d < 1 || d > 180) errs.push("Duration must be between 1 and 180 minutes.");
    return errs;
  };

  const buildPayload = async (status = "draft") => {
    // Get the real user ID from userManager (creates user if doesn't exist)
    const { getOrCreateUserId } = await import("../utils/userManager.js");
    const adminId = await getOrCreateUserId();
    
    return {
      title: title.trim(),
      description: description.trim(),
      duration_minutes: Number(duration),
      difficulty,
      randomize_questions: randomizeQuestions,
      randomize_answers: randomizeAnswers,
      status,
      admin_id: adminId, // Use real user ID from userManager
    };
  };

  const getErrorMessage = (error) => {
    if (!error) return "Failed to save quiz. Please try again.";
    const message = error.message || "";
    const code = error.code || "";
    
    if (message.includes("permission") || message.includes("denied")) {
      return "Permission denied. Please check your Firebase security rules.";
    }
    if (message.includes("timeout") || message.includes("network")) {
      return "Network error. Please check your connection and try again.";
    }
    if (message.includes("foreign key") || message.includes("admin_id")) {
      return "Invalid admin ID. Please log in again.";
    }
    return message || "Failed to save quiz. Please try again.";
  };

  const saveQuiz = async (status = "draft") => {
    setError("");
    setSuccess(false);
    setSaving(true);
    
    const issues = validate();
    if (issues.length) {
      setError(issues.join(" "));
      setSaving(false);
      return null;
    }
    
    try {
      // Get the real user ID from userManager (creates user if doesn't exist)
      const { getOrCreateUserId } = await import("../utils/userManager.js");
      const adminId = await getOrCreateUserId();
      console.log("Using admin ID:", adminId);
      
      // Build payload with real admin_id
      const payload = {
        title: title.trim(),
        description: description.trim(),
        duration_minutes: Number(duration),
        difficulty,
        randomize_questions: randomizeQuestions,
        randomize_answers: randomizeAnswers,
        status,
        admin_id: adminId, // Use real user ID
      };
      
      console.log("Saving quiz to PostgreSQL (Neon)...", { adminId, payload });
      
      // Save quiz and wait for result
      const quizId = await quizOperations.create(payload);
      
      if (quizId) {
        console.log("✅ Quiz saved successfully with ID:", quizId);
        setSuccess(true);
        setSaving(false);
        return quizId;
      } else {
        throw new Error("No quiz ID returned");
      }
    } catch (error) {
      console.error("❌ Error saving quiz:", error);
      setError(error?.message || "Failed to save quiz. Please try again.");
      setSaving(false);
      return null;
    }
  };

  const handleSaveDraft = async (e) => {
    e.preventDefault();
    const id = await saveQuiz("draft");
    if (id) {
      // Show success and redirect after a brief delay
      setTimeout(() => {
        navigate("/admin");
      }, 1000);
    }
  };

  const handleContinue = async (e) => {
    e.preventDefault();
    try {
      // Save quiz and wait for real ID
      const id = await saveQuiz("draft");
      
      if (id) {
        console.log("✅ Navigation: Navigating with real quiz ID:", id);
        // Navigate with real quiz ID
        navigate(`/admin/quizzes/${id}/questions`, { replace: true });
      } else {
        console.error("❌ Failed to save quiz - no ID returned");
        setError("Failed to save quiz. Check the console for details.");
      }
    } catch (err) {
      console.error("❌ Error in handleContinue:", err);
      setError(err?.message || "An error occurred. Please try again. Check browser console for details.");
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t("quiz.createNew")}</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Part 1: Quiz details</p>

      {error ? (
        <div className="mt-4 rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">{error}</div>
      ) : null}
      
      {success ? (
        <div className="mt-4 rounded-md bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
          {t("quiz.savedSuccessfully")}
        </div>
      ) : null}
      
      {saving ? (
        <div className="mt-4 rounded-md bg-blue-50 dark:bg-blue-900/20 p-3 text-sm text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800 flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {t("quiz.saving")}
        </div>
      ) : null}

      <form className="mt-6" onSubmit={handleContinue}>
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("quiz.quizTitle")} <span className="text-red-600 dark:text-red-400">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value.slice(0, maxTitle))}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-300"
              placeholder={t("quiz.quizTitle")}
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{title.length}/{maxTitle}</div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {t("quiz.quizDescription")}
            </label>
            <textarea
              id="description"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, maxDescription))}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-300"
              placeholder={t("quiz.quizDescription")}
            />
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">{description.length}/{maxDescription}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("quiz.duration")}
              </label>
              <input
                id="duration"
                type="number"
                min={1}
                max={180}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-300"
              />
            </div>

            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t("quiz.difficulty")}
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-300"
              >
                <option>{t("quiz.easy")}</option>
                <option>{t("quiz.medium")}</option>
                <option>{t("quiz.hard")}</option>
              </select>
            </div>

            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={randomizeQuestions}
                  onChange={(e) => setRandomizeQuestions(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 bg-white dark:bg-gray-700"
                />
                {t("quiz.randomizeQuestions")}
              </label>

              <label className="inline-flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <input
                  type="checkbox"
                  checked={randomizeAnswers}
                  onChange={(e) => setRandomizeAnswers(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 text-indigo-600 dark:text-indigo-400 focus:ring-indigo-500 bg-white dark:bg-gray-700"
                />
                {t("quiz.randomizeAnswers")}
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving}
            className="inline-flex justify-center items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("quiz.saving")}
              </>
            ) : (
              t("quiz.saveAsDraft")
            )}
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t("quiz.saving")}
              </>
            ) : (
              t("quiz.continueToQuestions")
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


