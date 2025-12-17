import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseConfig";
import useAuth from "../hooks/useAuth";
import { CheckCircle, XCircle, Clock, Save, ArrowLeft } from "lucide-react";

export default function ManualGradingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Pending short-answer questions that need grading
  const [pendingQuestions, setPendingQuestions] = useState([]);
  
  // Graded questions (for display)
  const [gradedQuestions, setGradedQuestions] = useState([]);
  
  // Filter state
  const [filterQuiz, setFilterQuiz] = useState("all");
  const [quizzes, setQuizzes] = useState([]);
  
  // Grading state - map of question_attempt_id -> { points, isCorrect }
  const [gradingState, setGradingState] = useState(new Map());

  useEffect(() => {
    const load = async () => {
      if (!user?.id && !user?.uid) return;
      setLoading(true);
      setError("");
      
      try {
        const adminId = user?.id || user?.uid;
        
        // Load quizzes for this admin
        const { data: quizzesData, error: quizzesError } = await supabase
          .from("quizzes")
          .select("id, title")
          .eq("admin_id", adminId)
          .order("created_at", { ascending: false });

        if (quizzesError) {
          throw quizzesError;
        }

        const quizzesList = (quizzesData || []).map((q) => ({
          id: q.id,
          name: q.title || "Untitled",
        }));
        setQuizzes(quizzesList);

        const quizIds = quizzesList.map((q) => q.id);
        if (quizIds.length === 0) {
          setPendingQuestions([]);
          setGradedQuestions([]);
          setLoading(false);
          return;
        }

        // Query: SELECT from question_attempts WHERE question_type = 'short_answer'
        // Join with questions to get question details and filter by short_answer type
        // First, get all short_answer questions for admin's quizzes
        const { data: questionsData, error: questionsError } = await supabase
          .from("questions")
          .select("id, quiz_id, question_text, question_type, points")
          .in("quiz_id", quizIds)
          .eq("question_type", "short_answer");

        if (questionsError) {
          throw questionsError;
        }

        const shortAnswerQuestionIds = (questionsData || []).map((q) => q.id);
        
        if (shortAnswerQuestionIds.length === 0) {
          setPendingQuestions([]);
          setGradedQuestions([]);
          setLoading(false);
          return;
        }

        // Get all question_attempts for short_answer questions with joins
        const { data: attemptsData, error: attemptsError } = await supabase
          .from("question_attempts")
          .select(`
            *,
            questions!inner(id, quiz_id, question_text, points, question_type),
            results!inner(id, quiz_id, participant_name, total_score)
          `)
          .in("question_id", shortAnswerQuestionIds)
          .order("created_at", { ascending: false });

        if (attemptsError) {
          throw attemptsError;
        }

        // Separate pending (not graded) from graded
        const pending = [];
        const graded = [];
        
        (attemptsData || []).forEach((attempt) => {
          const question = attempt.questions;
          const result = attempt.results;
          const quiz = quizzesList.find((q) => q.id === question.quiz_id);
          
          const item = {
            attemptId: attempt.id,
            questionId: question.id,
            quizId: question.quiz_id,
            quizName: quiz?.name || "Untitled",
            questionText: question.question_text,
            maxPoints: Number(question.points) || 1,
            userAnswer: attempt.user_answer || "",
            isCorrect: attempt.is_correct,
            awardedPoints: attempt.points_awarded != null ? Number(attempt.points_awarded) : (attempt.is_correct ? Number(question.points) || 1 : 0),
            attemptNumber: attempt.attempt_number,
            participantName: result.participant_name,
            resultId: result.id,
            createdAt: attempt.created_at,
          };

          // Show as pending if not graded
          // Consider it graded if: is_correct is true OR points_awarded is set
          const isGraded = attempt.is_correct === true || (attempt.points_awarded != null);
          
          if (isGraded) {
            graded.push(item);
          } else {
            pending.push(item);
          }
        });

        setPendingQuestions(pending);
        setGradedQuestions(graded);
      } catch (e) {
        console.error("Error loading pending questions:", e);
        setError(e?.message || "Failed to load pending questions");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // Filter questions by quiz
  const filteredPending = useMemo(() => {
    if (filterQuiz === "all") return pendingQuestions;
    return pendingQuestions.filter((q) => q.quizId === filterQuiz);
  }, [pendingQuestions, filterQuiz]);

  const filteredGraded = useMemo(() => {
    if (filterQuiz === "all") return gradedQuestions;
    return gradedQuestions.filter((q) => q.quizId === filterQuiz);
  }, [gradedQuestions, filterQuiz]);

  const handlePointsChange = (attemptId, points, maxPoints) => {
    const newGradingState = new Map(gradingState);
    const clampedPoints = Math.max(0, Math.min(maxPoints, Number(points) || 0));
    newGradingState.set(attemptId, {
      points: clampedPoints,
      isCorrect: clampedPoints > 0,
    });
    setGradingState(newGradingState);
  };

  const handleSaveGrade = async (attemptId, questionItem) => {
    const grade = gradingState.get(attemptId);
    if (!grade) {
      setError("Please enter points before saving.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      // UPDATE question_attempts SET is_correct = true, points_awarded = X
      // Note: If points_awarded column doesn't exist, run: supabase_add_points_awarded.sql
      const updateData = {
        is_correct: grade.isCorrect,
      };
      
      // Try to update points_awarded if the column exists
      // If it doesn't exist, Supabase will ignore it
      try {
        updateData.points_awarded = grade.points;
      } catch (e) {
        // Column might not exist yet - that's okay, we'll use is_correct only
        console.warn("points_awarded column may not exist. Run supabase_add_points_awarded.sql to enable partial credit.");
      }
      
      const { error: updateError } = await supabase
        .from("question_attempts")
        .update(updateData)
        .eq("id", attemptId);

      if (updateError) {
        throw updateError;
      }

      // Recalculate total_score in results table
      // Get all question_attempts for this result with question details
      // Include points_awarded if the column exists
      const { data: allAttempts, error: attemptsError } = await supabase
        .from("question_attempts")
        .select(`
          *,
          questions!inner(id, points, question_type)
        `)
        .eq("result_id", questionItem.resultId);

      if (attemptsError) {
        throw attemptsError;
      }

      // Get the result to know max_score
      const { data: resultData, error: resultFetchError } = await supabase
        .from("results")
        .select("max_score")
        .eq("id", questionItem.resultId)
        .single();

      if (resultFetchError) {
        throw resultFetchError;
      }

      // Calculate new total score
      // Group attempts by question_id to get the best attempt per question
      const questionBestAttempts = new Map();
      
      (allAttempts || []).forEach((attempt) => {
        const question = attempt.questions;
        const questionId = question.id;
        const existing = questionBestAttempts.get(questionId);
        
        // For the question we just graded, use the new grade
        if (attempt.id === attemptId) {
          questionBestAttempts.set(questionId, {
            attempt,
            points: grade.points,
            isCorrect: grade.isCorrect,
          });
        } else {
          // For other questions, calculate points based on is_correct and points_awarded
          const questionPoints = Number(question.points) || 1;
          let attemptPoints = 0;
          
          // Check if points_awarded exists (for partial credit on short_answer)
          if (attempt.points_awarded != null && typeof attempt.points_awarded === 'number') {
            attemptPoints = Number(attempt.points_awarded);
          } else if (attempt.is_correct === true) {
            // Fallback: if is_correct = true but no points_awarded, use full points
            attemptPoints = questionPoints;
          }
          
          if (!existing || attemptPoints > existing.points) {
            questionBestAttempts.set(questionId, {
              attempt,
              points: attemptPoints,
              isCorrect: attempt.is_correct === true,
            });
          }
        }
      });

      // Sum up all points
      let newTotalScore = 0;
      questionBestAttempts.forEach(({ points }) => {
        newTotalScore += points;
      });

      // Update result total_score
      const { error: resultError } = await supabase
        .from("results")
        .update({
          total_score: newTotalScore,
        })
        .eq("id", questionItem.resultId);

      if (resultError) {
        throw resultError;
      }

      // Remove from pending and add to graded
      setPendingQuestions((prev) => prev.filter((q) => q.attemptId !== attemptId));
      setGradedQuestions((prev) => [
        {
          ...questionItem,
          isCorrect: grade.isCorrect,
          awardedPoints: grade.points,
        },
        ...prev,
      ]);

      // Clear grading state for this attempt
      const newGradingState = new Map(gradingState);
      newGradingState.delete(attemptId);
      setGradingState(newGradingState);

      setSuccess(`Points awarded: ${grade.points}/${questionItem.maxPoints}. Total score updated.`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (e) {
      console.error("Error saving grade:", e);
      setError(e?.message || "Failed to save grade");
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Please log in to access manual grading.</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manual Grading</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Review and grade short-answer questions
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
            {success}
          </div>
        )}

        {/* Filters */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Quiz
          </label>
          <select
            value={filterQuiz}
            onChange={(e) => setFilterQuiz(e.target.value)}
            className="block w-full max-w-xs rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-medical-500"
          >
            <option value="all">All Quizzes</option>
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>{q.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin h-8 w-8 border-2 border-medical-600 border-t-transparent rounded-full"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">Loading...</span>
          </div>
        ) : (
          <>
            {/* Pending Questions */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Pending Review ({filteredPending.length})
                </h2>
              </div>

              {filteredPending.length === 0 ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-600 dark:text-gray-400 text-center">
                    No pending short-answer questions to grade.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredPending.map((item) => {
                    const grade = gradingState.get(item.attemptId) || { points: 0, isCorrect: false };
                    return (
                      <div
                        key={item.attemptId}
                        className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                          <div className="lg:col-span-2">
                            <div className="mb-3">
                              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                {item.quizName}
                              </span>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                              {item.questionText}
                            </h3>
                            <div className="mb-4">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Participant Answer:
                              </label>
                              <div className="bg-gray-50 dark:bg-gray-700 rounded-md p-3 border border-gray-200 dark:border-gray-600">
                                <p className="text-gray-900 dark:text-white whitespace-pre-wrap">
                                  {item.userAnswer || "(No answer provided)"}
                                </p>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <p>Participant: <span className="font-medium">{item.participantName}</span></p>
                              <p>Attempt #: {item.attemptNumber}</p>
                            </div>
                          </div>

                          <div className="lg:col-span-1">
                            <div className="bg-medical-50 dark:bg-medical-900/20 rounded-lg p-4 border border-medical-200 dark:border-medical-800">
                              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Award Points (0 - {item.maxPoints})
                              </label>
                              <input
                                type="number"
                                min="0"
                                max={item.maxPoints}
                                value={grade.points}
                                onChange={(e) => handlePointsChange(item.attemptId, e.target.value, item.maxPoints)}
                                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-lg font-semibold text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-medical-500"
                                placeholder="0"
                              />
                              <div className="mt-3 flex items-center gap-2">
                                <button
                                  onClick={() => handlePointsChange(item.attemptId, item.maxPoints, item.maxPoints)}
                                  className="flex-1 text-xs px-2 py-1 bg-medical-100 dark:bg-medical-900/30 text-medical-700 dark:text-medical-400 rounded hover:bg-medical-200 dark:hover:bg-medical-900/50 transition-colors"
                                >
                                  Full ({item.maxPoints})
                                </button>
                                <button
                                  onClick={() => handlePointsChange(item.attemptId, Math.floor(item.maxPoints / 2), item.maxPoints)}
                                  className="flex-1 text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                >
                                  Half ({Math.floor(item.maxPoints / 2)})
                                </button>
                                <button
                                  onClick={() => handlePointsChange(item.attemptId, 0, item.maxPoints)}
                                  className="flex-1 text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                                >
                                  Zero (0)
                                </button>
                              </div>
                              <button
                                onClick={() => handleSaveGrade(item.attemptId, item)}
                                disabled={saving || grade.points === undefined}
                                className="mt-4 w-full flex items-center justify-center gap-2 bg-medical-600 dark:bg-medical-500 text-white px-4 py-2 rounded-md hover:bg-medical-700 dark:hover:bg-medical-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                              >
                                <Save className="h-4 w-4" />
                                {saving ? "Saving..." : "Save Grade"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Graded Questions */}
            {filteredGraded.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Already Graded ({filteredGraded.length})
                  </h2>
                </div>
                <div className="space-y-3">
                  {filteredGraded.map((item) => (
                    <div
                      key={item.attemptId}
                      className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                              {item.quizName}
                            </span>
                            {item.isCorrect ? (
                              <span className="text-xs font-medium text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">
                                Graded
                              </span>
                            ) : (
                              <span className="text-xs font-medium text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/30 px-2 py-1 rounded">
                                No Points
                              </span>
                            )}
                          </div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                            {item.questionText}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            {item.participantName} • Points: {item.awardedPoints || 0}/{item.maxPoints}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

