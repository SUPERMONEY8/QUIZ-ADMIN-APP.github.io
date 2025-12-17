import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import QuestionList from "../components/QuestionList.jsx";
import QuestionForm from "../components/QuestionForm.jsx";
import QuestionFormTrueFalse from "../components/QuestionFormTrueFalse.jsx";
import QuestionFormShortAnswer from "../components/QuestionFormShortAnswer.jsx";
import { useState, useEffect } from "react";
import { quizOperations } from "../utils/databaseConfig";
import useAuth from "../hooks/useAuth";

export default function QuizQuestionsPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [questionType, setQuestionType] = useState("multiple_choice");
  const [showForm, setShowForm] = useState(false);
  const [waitingForQuiz, setWaitingForQuiz] = useState(quizId?.startsWith('temp-'));

  const handleQuestionSaved = () => {
    setShowForm(false);
    // Form will refresh automatically via QuestionList subscription
  };

  // If quizId is temp, poll for the real quiz to be created
  useEffect(() => {
    if (!quizId) {
      setWaitingForQuiz(false);
      return;
    }
    
    if (quizId?.startsWith('temp-')) {
      setWaitingForQuiz(true);
      
      // Poll Firebase for the newly created quiz (by checking recent quizzes)
      const adminId = user?.id || user?.uid || 'admin-access-direct';
      let attempts = 0;
      const maxAttempts = 20; // 10 seconds max (20 * 500ms)
      let isMounted = true;
      
      const pollInterval = setInterval(async () => {
        if (!isMounted) {
          clearInterval(pollInterval);
          return;
        }
        
        attempts++;
        
        try {
          // Get all quizzes and find the most recent one (should be the one we just created)
          const quizzes = await quizOperations.getByAdmin(adminId);
          
          if (!isMounted) return;
          
          if (quizzes && quizzes.length > 0) {
            // Get the most recent quiz (first in sorted list)
            const newestQuiz = quizzes[0];
            
            if (newestQuiz && newestQuiz.id && !newestQuiz.id.startsWith('temp-')) {
              // Found real quiz! Update URL and reload
              clearInterval(pollInterval);
              if (isMounted) {
                setWaitingForQuiz(false);
                navigate(`/admin/quizzes/${newestQuiz.id}/questions`, { replace: true });
              }
              return;
            }
          }
        } catch (err) {
          console.error("Error polling for quiz:", err);
          // Don't show error to user, just continue polling
        }
        
        // Timeout after max attempts
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          if (isMounted) {
            setWaitingForQuiz(false);
            navigate('/admin/new-quiz', { 
              state: { error: 'Quiz creation is taking longer than expected. Please try again.' }
            });
          }
        }
      }, 500); // Check every 500ms
      
      return () => {
        isMounted = false;
        clearInterval(pollInterval);
      };
    } else {
      setWaitingForQuiz(false);
    }
  }, [quizId, navigate, user]);

  if (waitingForQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Creating quiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 animate-fade-in">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/admin")}
          className="mb-4 medical-button-secondary inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </button>

        {!showForm ? (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="h-6 w-6 text-medical-600 dark:text-medical-400" />
                Manage Questions
              </h1>
              <div className="flex gap-2">
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="medical-input text-sm py-2 px-3 h-9 text-xs focus:ring-2 focus:ring-medical-500 transition-all duration-200 hover:border-medical-400 dark:hover:border-medical-500"
                >
                  <option value="multiple_choice">Multiple Choice</option>
                  <option value="true_false">True/False</option>
                  <option value="short_answer">Short Answer</option>
                </select>
                <button
                  onClick={() => setShowForm(true)}
                  className="medical-button inline-flex items-center gap-1.5 px-3 py-2 text-xs h-9 transition-all duration-200 hover:scale-105 active:scale-95"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add Question
                </button>
              </div>
            </div>
            <QuestionList quizId={quizId} />
          </>
        ) : (
          <div className="space-y-4 animate-slide-up">
            <button
              onClick={() => setShowForm(false)}
              className="mb-4 medical-button-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Questions List
            </button>
            {questionType === "multiple_choice" && (
              <QuestionForm quizId={quizId} onSaved={handleQuestionSaved} />
            )}
            {questionType === "true_false" && (
              <QuestionFormTrueFalse quizId={quizId} onSaved={handleQuestionSaved} />
            )}
            {questionType === "short_answer" && (
              <QuestionFormShortAnswer quizId={quizId} onSaved={handleQuestionSaved} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

