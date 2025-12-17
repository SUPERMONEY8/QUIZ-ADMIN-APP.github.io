import { useEffect, useMemo, useState } from "react";
import { supabase } from "../supabaseConfig";
import useAuth from "../hooks/useAuth";

// Props: quizId (string)
export default function QuizSettings({ quizId }) {
  const { user } = useAuth();

  const [showAnswers, setShowAnswers] = useState(false);
  const [maxAttemptsPerQuestion, setMaxAttemptsPerQuestion] = useState(3);
  const [maxAttemptsPerUser, setMaxAttemptsPerUser] = useState(3);
  const [startAt, setStartAt] = useState(""); // datetime-local string
  const [endAt, setEndAt] = useState(""); // datetime-local string
  const [randomizeQuestions, setRandomizeQuestions] = useState(false);
  const [randomizeAnswers, setRandomizeAnswers] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const run = async () => {
      if ((!user?.id && !user?.uid) || !quizId) return;
      setLoading(true);
      setSaved(false);
      setError("");
      try {
        const { data, error: fetchError } = await supabase
          .from("quizzes")
          .select("*")
          .eq("id", quizId)
          .single();
        
        if (fetchError) {
          throw fetchError;
        }
        
        if (data) {
          setShowAnswers(!!data.show_answers_after);
          setMaxAttemptsPerQuestion(Number(data.max_attempts_per_question ?? 3));
          setMaxAttemptsPerUser(Number(data.max_attempts_per_user ?? 3));
          setRandomizeQuestions(!!data.randomize_questions);
          setRandomizeAnswers(!!data.randomize_answers);
          setStartAt(tsToLocalInput(data.start_date));
          setEndAt(tsToLocalInput(data.end_date));
        }
      } catch (e) {
        setError(e?.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    };
    run();
  }, [user, quizId]);

  const tsToLocalInput = (ts) => {
    if (!ts) return "";
    try {
      const date = new Date(ts);
      if (isNaN(date.getTime())) return "";
      const pad = (n) => String(n).padStart(2, "0");
      const yyyy = date.getFullYear();
      const mm = pad(date.getMonth() + 1);
      const dd = pad(date.getDate());
      const hh = pad(date.getHours());
      const mi = pad(date.getMinutes());
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
    } catch {
      return "";
    }
  };

  const localInputToISO = (val) => {
    if (!val) return null;
    const date = new Date(val);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  };

  const validate = () => {
    const errs = [];
    const s = startAt ? new Date(startAt) : null;
    const e = endAt ? new Date(endAt) : null;
    if (s && e && e < s) errs.push("End time must be after start time.");
    const q = Number(maxAttemptsPerQuestion);
    const u = Number(maxAttemptsPerUser);
    if (!Number.isFinite(q) || q < 1 || q > 10) errs.push("Max attempts per question must be 1-10.");
    if (!Number.isFinite(u) || u < 1 || u > 10) errs.push("Max attempts per user must be 1-10.");
    return errs;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaved(false);
    setError("");
    const issues = validate();
    if (issues.length) {
      setError(issues.join(" "));
      return;
    }
    if ((!user?.id && !user?.uid) || !quizId) {
      setError("Missing quiz context or user.");
      return;
    }
    try {
      setSaving(true);
      const { error } = await supabase
        .from("quizzes")
        .update({
          show_answers_after: !!showAnswers,
          max_attempts_per_question: Number(maxAttemptsPerQuestion),
          max_attempts_per_user: Number(maxAttemptsPerUser),
          start_date: localInputToISO(startAt),
          end_date: localInputToISO(endAt),
          randomize_questions: !!randomizeQuestions,
          randomize_answers: !!randomizeAnswers,
        })
        .eq("id", quizId);
      
      if (error) {
        throw error;
      }
      setSaved(true);
    } catch (e2) {
      setError(e2?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900">Quiz Settings</h2>
      <p className="mt-1 text-sm text-gray-600">Control availability and behavior</p>

      {error ? (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>
      ) : null}
      {saved ? (
        <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">Settings saved</div>
      ) : null}

      {loading ? (
        <div className="mt-6 text-gray-600">Loading settings...</div>
      ) : (
        <form className="mt-6" onSubmit={handleSave}>
          <div className="grid grid-cols-1 gap-5">
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={showAnswers}
                  onChange={(e) => setShowAnswers(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Show correct answers after completion
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max attempts per question</label>
                <select
                  value={maxAttemptsPerQuestion}
                  onChange={(e) => setMaxAttemptsPerQuestion(Number(e.target.value))}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max attempts per user</label>
                <select
                  value={maxAttemptsPerUser}
                  onChange={(e) => setMaxAttemptsPerUser(Number(e.target.value))}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start date/time</label>
                <input
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End date/time</label>
                <input
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={randomizeQuestions}
                  onChange={(e) => setRandomizeQuestions(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Randomize questions
              </label>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={randomizeAnswers}
                  onChange={(e) => setRandomizeAnswers(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                Randomize answer options
              </label>
            </div>

            <div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Settings"}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}


