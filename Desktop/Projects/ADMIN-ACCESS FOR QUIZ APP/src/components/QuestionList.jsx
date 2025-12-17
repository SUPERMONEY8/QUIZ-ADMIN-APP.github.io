import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, EyeOff, Video } from "lucide-react";
import { questionOperations } from "../utils/databaseConfig";
import useAuth from "../hooks/useAuth";
import DeleteConfirmModal from "./DeleteConfirmModal.jsx";

// Props: quizId (string)
export default function QuestionList({ quizId }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, question: null });
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    if ((!user?.id && !user?.uid) || !quizId || quizId.startsWith('temp-')) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError("");
    
    // Fetch questions from Firebase
    const fetchQuestions = async () => {
      try {
        if (!isMountedRef.current || !quizId || quizId.startsWith('temp-')) return;
        
        const questionsData = await questionOperations.getByQuiz(quizId);
        
        if (!isMountedRef.current) return;
        
        // Transform data to match expected format
        const items = (questionsData || []).map((q) => {
          // Convert options JSONB back to array format for display
          let optionsArray = [];
          let correctIndex = -1;
          
          if (q.question_type === "multiple_choice" && q.options) {
            // Convert {"A": "option 1", "B": "option 2"} to array
            const optionKeys = Object.keys(q.options).sort();
            optionsArray = optionKeys.map((key) => q.options[key]);
            
            // Find correct index from correct_answer letter
            if (q.correct_answer) {
              correctIndex = optionKeys.indexOf(q.correct_answer);
            }
          }
          
          return {
            id: q.id,
            type: q.question_type,
            text: q.question_text,
            options: optionsArray,
            correctIndex: correctIndex >= 0 ? correctIndex : undefined,
            correctAnswer: q.correct_answer,
            expectedAnswer: q.question_type === "short_answer" ? q.correct_answer : undefined,
            points: q.points,
            imageUrl: q.image_url,
            videoUrl: q.video_url,
            streamableEmbedUrl: q.video_url, // For backward compatibility
            order: q.question_order || 0,
            createdAt: q.created_at ? { seconds: Math.floor(new Date(q.created_at).getTime() / 1000) } : null,
            status: q.status || "published", // Use status from database
          };
        });
        
        if (isMountedRef.current) {
          setQuestions(items);
          setLoading(false);
        }
      } catch (err) {
        if (!isMountedRef.current) return;
        console.error("QuestionList error:", err);
        const errorMsg = err.message || "Failed to load questions";
        // Only show error if it's not a network error (which might be temporary)
        if (!errorMsg.includes("Failed to fetch") && !errorMsg.includes("network")) {
          setError(errorMsg);
        }
        setLoading(false);
        setQuestions([]);
      }
    };
    
    fetchQuestions();
    
    // Refresh every 5 seconds (Firebase real-time can be added later with onSnapshot)
    const interval = setInterval(() => {
      if (isMountedRef.current && quizId && !quizId.startsWith('temp-')) {
        fetchQuestions();
      }
    }, 5000);
    
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [user, quizId]);

  const totalPoints = useMemo(() => questions.reduce((sum, q) => sum + (Number(q.points) || 0), 0), [questions]);

  const labelForType = (type) => {
    if (type === "multiple_choice") return "MC";
    if (type === "true_false") return "TF";
    if (type === "short_answer") return "SA";
    return "?";
  };

  const renderCorrectAnswer = (q) => {
    if (q.type === "multiple_choice") {
      return typeof q.correctIndex === "number" && q.options?.[q.correctIndex]
        ? q.options[q.correctIndex]
        : "—";
    }
    if (q.type === "true_false") {
      return q.correctAnswer ? "True" : "False";
    }
    if (q.type === "short_answer") {
      return q.expectedAnswer || "—";
    }
    return "—";
  };

  const handleDeleteClick = useCallback((question, e) => {
    e?.stopPropagation();
    setDeleteModal({ isOpen: true, question });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if ((!user?.id && !user?.uid) || !deleteModal.question) return;
    try {
      await questionOperations.delete(deleteModal.question.id);
      setDeleteModal({ isOpen: false, question: null });
    } catch (err) {
      console.error("Failed to delete question:", err);
      alert("Failed to delete question. Please try again.");
    }
  }, [user, quizId, deleteModal.question]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModal({ isOpen: false, question: null });
  }, []);

  const handleEdit = useCallback((question) => {
    navigate(`/admin/quizzes/${quizId}/questions/${question.id}`);
  }, [navigate, quizId]);

  const handleAdd = useCallback(() => {
    navigate(`/admin/quizzes/${quizId}/questions/new`);
  }, [navigate, quizId]);

  const handleToggleQuestionStatus = useCallback(async (question) => {
    if (!user?.id && !user?.uid) return;
    
    const currentStatus = question.status || "draft";
    const newStatus = currentStatus === "published" ? "draft" : "published";
    
    // Optimistic UI update - update immediately for instant feedback
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === question.id ? { ...q, status: newStatus } : q
      )
    );
    
    // Then sync with database in background
    try {
      await questionOperations.update(question.id, { status: newStatus });
    } catch (err) {
      // Revert on error
      console.error("Error toggling question status:", err);
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === question.id ? { ...q, status: currentStatus } : q
        )
      );
      alert("Failed to update question status. Please try again.");
    }
  }, [user, quizId]);

  const reorder = (list, from, to) => {
    const copy = list.slice();
    const [moved] = copy.splice(from, 1);
    copy.splice(to, 0, moved);
    return copy.map((item, idx) => ({ ...item, order: idx }));
  };

  const persistOrder = useCallback(async (newList) => {
    if (!user?.id && !user?.uid) return;
    
    // Update all question orders
    try {
      await Promise.all(
        newList.map((q) =>
          questionOperations.update(q.id, { question_order: q.order })
        )
      );
    } catch (err) {
      console.error("Failed to update question order:", err);
      alert("Failed to save question order. Please try again.");
    }
  }, [user, quizId]);

  const onDragStart = (idx) => setDragIndex(idx);
  const onDragOver = (e) => e.preventDefault();
  const onDrop = async (idx) => {
    if (dragIndex === null || dragIndex === idx) return;
    const newList = reorder(questions, dragIndex, idx);
    setQuestions(newList);
    setDragIndex(null);
    await persistOrder(newList);
  };

  if (!user) return null;

  return (
    <div>
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone."
      />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Questions</h2>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
          {typeof error === "string" ? error : error}
        </div>
      ) : null}

      <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">Total Points: {totalPoints}</div>

      {loading ? (
        <div className="mt-6 text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-medical-600 border-t-transparent rounded-full"></div>
          Loading questions...
        </div>
      ) : questions.length === 0 ? (
        <div className="mt-6 medical-card p-8 text-center">
          <p className="text-gray-600 dark:text-gray-400">No questions yet. Add your first question.</p>
        </div>
      ) : (
        <ul className="mt-4 space-y-3">
          {questions.map((q, idx) => (
            <li
              key={q.id}
              draggable
              onDragStart={() => onDragStart(idx)}
              onDragOver={onDragOver}
              onDrop={() => onDrop(idx)}
              className="medical-card p-4 group transition-transform duration-200 hover:scale-105"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 w-6 shrink-0">{idx + 1}.</div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {q.text || "Untitled question"}
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 flex items-center gap-3 flex-wrap">
                      {q.streamableEmbedUrl ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5">
                          <Video className="h-3 w-3" />
                          Video
                        </span>
                      ) : null}
                      <span className="inline-flex items-center rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5">
                        {labelForType(q.type)}
                      </span>
                      <span>Points: {q.points || 0}</span>
                      <span>Correct: {renderCorrectAnswer(q)}</span>
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        (q.status || "draft") === "published" 
                          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      }`}>
                        {(q.status || "draft") === "published" ? "Published" : "Draft"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleQuestionStatus(q);
                    }}
                    className="relative inline-flex h-7 w-12 items-center rounded-full bg-gray-200 dark:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-medical-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
                    title={(q.status || "draft") === "published" ? "Set as Draft" : "Publish Question"}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md transition-transform duration-300 ${
                        (q.status || "draft") === "published" ? "translate-x-5" : "translate-x-0"
                      }`}
                    >
                      {(q.status || "draft") === "published" ? (
                        <Globe className="h-3 w-3 text-medical-600 dark:text-medical-400" />
                      ) : (
                        <EyeOff className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                      )}
                    </span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(q);
                    }}
                    className="medical-button-secondary inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs"
                  >
                    Edit
                  </button>
                  <button
                    onClick={(e) => handleDeleteClick(q, e)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-2.5 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-105"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


