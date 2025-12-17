import { useEffect, useMemo, useState } from "react";
import { quizOperations, questionOperations } from "../utils/databaseConfig";
import useAuth from "../hooks/useAuth";
import { Check, Copy, Link2, X } from "lucide-react";

// Props: quizId (string)
export default function PublishQuiz({ quizId }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [shareCode, setShareCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);

  const totalPoints = useMemo(
    () => questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0),
    [questions]
  );

  useEffect(() => {
    const load = async () => {
      if ((!user?.id && !user?.uid) || !quizId) return;
      setLoading(true);
      setError("");
      
      try {
        // Load quiz
        const quizData = await quizOperations.get(quizId);
        
        if (!quizData) {
          throw new Error("Quiz not found");
        }
        
        setQuiz({
          id: quizId,
          name: quizData.title || quizData.name,
          description: quizData.description,
          status: quizData.status,
          shareCode: quizData.shareCode || quizData.share_code || "",
        });
        setShareCode(quizData.shareCode || quizData.share_code || "");
        
        // Load questions
        const questionsData = await questionOperations.getByQuiz(quizId);
        
        // Transform questions to match expected format
        const transformedQuestions = (questionsData || []).map((q) => ({
          id: q.id,
          text: q.text || q.question_text,
          type: q.type || q.question_type,
          points: q.points,
          correctAnswer: q.correctAnswer || q.correct_answer,
          options: q.options,
          imageUrl: q.imageUrl || q.image_url,
          videoUrl: q.videoUrl || q.video_url,
        }));
        
        setQuestions(transformedQuestions);
      } catch (e) {
        console.error("Error loading quiz:", e);
        setError(e?.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, quizId]);

  const validateQuestions = () => {
    if (!questions.length) return "Quiz must have at least one question.";
    for (const q of questions) {
      if (!q.text || !q.type) return "All questions must have text and type.";
      if (typeof q.points !== "number" || q.points <= 0) return "Each question must have valid points.";
      if (q.type === "multiple_choice") {
        if (!Array.isArray(q.options) || q.options.length < 2) return "MC questions need at least 2 options.";
        if (typeof q.correctIndex !== "number" || q.correctIndex < 0 || q.correctIndex >= q.options.length) return "MC questions need a valid correct option.";
      }
      if (q.type === "true_false") {
        if (typeof q.correctAnswer !== "boolean") return "TF questions need a True/False answer.";
      }
      if (q.type === "short_answer") {
        // expectedAnswer is optional for guidance; manual grading applies
      }
    }
    return "";
  };

  const generateShareCode = () => {
    // 6-char base36 code
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  };

  const handlePublish = async () => {
    setError("");
    const issue = validateQuestions();
    if (issue) {
      setError(issue);
      return;
    }
    if (!user?.id && !user?.uid) {
      setError("Missing user context.");
      return;
    }
    
    const code = shareCode || generateShareCode();
    const previousStatus = quiz?.status;
    const previousShareCode = shareCode;
    
    // Optimistic UI update - update immediately for instant feedback
    setPublishing(true);
    setShareCode(code);
    setQuiz((prev) => ({ ...(prev || {}), status: "published", shareCode: code }));
    
    // Then sync with database in background
    try {
      await quizOperations.update(quizId, {
        status: "published",
        share_code: code,
        published_at: new Date().toISOString(),
      });
    } catch (e) {
      // Revert on error
      setShareCode(previousShareCode);
      setQuiz((prev) => ({ ...(prev || {}), status: previousStatus, shareCode: previousShareCode }));
      setError(e?.message || "Failed to publish quiz");
    } finally {
      setPublishing(false);
    }
  };

  const handleBackToDraft = async () => {
    setError("");
    if (!user?.id && !user?.uid) return;
    
    const previousStatus = quiz?.status;
    
    // Optimistic UI update - update immediately for instant feedback
    setQuiz((prev) => ({ ...(prev || {}), status: "draft" }));
    
    // Then sync with database in background
    try {
      const { error } = await supabase
        .from("quizzes")
        .update({ status: "draft" })
        .eq("id", quizId);
      
      if (error) {
        throw error;
      }
    } catch (e) {
      // Revert on error
      setQuiz((prev) => ({ ...(prev || {}), status: previousStatus }));
      setError(e?.message || "Failed to update status");
    }
  };

  const shareLink = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/quiz/${quizId}/start`;
  }, [quizId]);

  const quizLink = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return `${origin}/quiz/${quizId}/start`;
  }, [quizId]);

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  const copyCode = async () => {
    if (!shareCode) return;
    try {
      await navigator.clipboard.writeText(shareCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(quizLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900">Publish Quiz</h2>
      <p className="mt-1 text-sm text-gray-600">Review details before publishing</p>

      {error ? (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>
      ) : null}

      {loading ? (
        <div className="mt-6 text-gray-600">Loading...</div>
      ) : (
        <div className="mt-6 space-y-6">
          <section>
            <h3 className="text-sm font-medium text-gray-700">Summary</h3>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-xs text-gray-500">Title</div>
                <div className="text-sm font-medium text-gray-900">{quiz?.name || "Untitled"}</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="text-xs text-gray-500">Questions</div>
                <div className="text-sm font-medium text-gray-900">{questions.length}</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 sm:col-span-2">
                <div className="text-xs text-gray-500">Description</div>
                <div className="text-sm text-gray-800">{quiz?.description || "—"}</div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 sm:col-span-2">
                <div className="text-xs text-gray-500">Total Points</div>
                <div className="text-sm font-medium text-gray-900">{totalPoints}</div>
              </div>
            </div>
          </section>

          <section className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handlePublish}
              disabled={publishing}
              className="inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            >
              {publishing ? "Publishing..." : "Publish"}
            </button>
            <button
              onClick={handleBackToDraft}
              className="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              Back to Draft
            </button>
            {quiz?.status === "published" && (
              <button
                onClick={() => setLinkModalOpen(true)}
                className="inline-flex justify-center items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <Link2 className="h-4 w-4 mr-2" />
                Get Link
              </button>
            )}
          </section>

          <section>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Quiz Access Code</h3>
            {shareCode ? (
              <>
                <div className="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-6 mb-4 border-2 border-indigo-200">
                  <div className="text-center">
                    <div className="text-xs text-indigo-600 mb-2 font-medium uppercase tracking-wider">
                      Share This Code With Participants
                    </div>
                    <div className="text-4xl font-bold text-indigo-700 font-mono tracking-wider">
                      {shareCode}
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={copyCode}
                    className="flex-1 inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Code Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Code
                      </>
                    )}
                  </button>
                </div>
                <div className="mt-4 bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <div className="text-xs text-gray-500 mb-1">Full Link (Optional):</div>
                  <code className="text-xs text-gray-700 break-all">{shareLink}</code>
                </div>
              </>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-sm text-yellow-700">
                  Code will be generated when you publish the quiz.
                </p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Link Modal */}
      {linkModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          onClick={() => setLinkModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center">
                  <Link2 className="h-5 w-5 text-teal-600 dark:text-teal-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Quiz Link
                </h3>
              </div>
              <button
                onClick={() => setLinkModalOpen(false)}
                className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Share this link with participants to allow them to take the quiz: <span className="font-semibold text-gray-900 dark:text-white">{quiz?.name || "Untitled Quiz"}</span>
            </p>
            
            <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 mb-4 border border-teal-200 dark:border-teal-800">
              <code className="text-sm font-mono text-teal-700 dark:text-teal-300 break-all">
                {quizLink}
              </code>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={copyLink}
                className="flex-1 inline-flex justify-center items-center rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                {linkCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Link Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                  </>
                )}
              </button>
              <button
                onClick={() => setLinkModalOpen(false)}
                className="inline-flex justify-center items-center rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


