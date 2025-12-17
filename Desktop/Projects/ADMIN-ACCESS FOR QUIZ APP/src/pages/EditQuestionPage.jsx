import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { questionOperations } from "../utils/databaseConfig";
import useAuth from "../hooks/useAuth";
import EditQuestionForm from "../components/EditQuestionForm.jsx";
import EditQuestionFormTrueFalse from "../components/EditQuestionFormTrueFalse.jsx";
import EditQuestionFormShortAnswer from "../components/EditQuestionFormShortAnswer.jsx";
import VideoPlayer from "../components/VideoPlayer.jsx";

export default function EditQuestionPage() {
  const { quizId, questionId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadQuestion = async () => {
      if ((!user?.id && !user?.uid) || !quizId || !questionId) {
        setError("Missing required parameters");
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError("");
      try {
        // Get all questions for this quiz and find the one we need
        const questions = await questionOperations.getByQuiz(quizId);
        const questionData = questions.find(q => q.id === questionId);
        
        if (!questionData) {
          setError("Question not found");
          setLoading(false);
          return;
        }
        
        // Transform Firebase data to expected format
        let transformedQuestion = {
          id: questionData.id,
          type: questionData.type || questionData.question_type,
          text: questionData.text || questionData.question_text,
          points: questionData.points,
          imageUrl: questionData.imageUrl || questionData.image_url,
          image_url: questionData.imageUrl || questionData.image_url, // For backward compatibility
          videoUrl: questionData.videoUrl || questionData.video_url,
          streamableEmbedUrl: questionData.videoUrl || questionData.video_url, // For backward compatibility
        };
        
        // Handle different question types
        const questionType = questionData.type || questionData.question_type;
        if (questionType === "multiple_choice" && questionData.options) {
          // Options should already be an array from Firebase
          transformedQuestion.options = Array.isArray(questionData.options) 
            ? questionData.options 
            : Object.values(questionData.options);
          
          // Find correct index from correct_answer
          const correctAnswer = questionData.correctAnswer || questionData.correct_answer;
          if (correctAnswer && transformedQuestion.options) {
            transformedQuestion.correctIndex = transformedQuestion.options.indexOf(correctAnswer);
            transformedQuestion.correctAnswer = correctAnswer;
          }
        } else if (questionType === "true_false") {
          const correctAnswer = questionData.correctAnswer || questionData.correct_answer;
          transformedQuestion.correctAnswer = correctAnswer === "true" || correctAnswer === true;
        } else if (questionType === "short_answer") {
          transformedQuestion.expectedAnswer = questionData.correctAnswer || questionData.correct_answer || "";
        }
        
        setQuestion(transformedQuestion);
      } catch (e) {
        console.error("Error loading question:", e);
        setError(e?.message || "Failed to load question");
      } finally {
        setLoading(false);
      }
    };
    loadQuestion();
  }, [user, quizId, questionId]);

  const handleSaved = () => {
    navigate(`/admin/quizzes/${quizId}/questions`, { replace: false });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
            <div className="animate-spin h-4 w-4 border-2 border-medical-600 border-t-transparent rounded-full"></div>
            Loading question...
          </div>
        </div>
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 animate-fade-in">
            {error || "Question not found"}
          </div>
          <button
            onClick={() => navigate(`/admin/quizzes/${quizId}/questions`, { replace: false })}
            className="mt-4 medical-button-secondary inline-flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Questions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6 animate-fade-in">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(`/admin/quizzes/${quizId}/questions`, { replace: false })}
          className="mb-4 medical-button-secondary inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Questions
        </button>

        {/* Video Preview for Admin */}
        {question.streamableEmbedUrl && (
          <div className="mb-6 medical-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Video Preview
            </h3>
            <VideoPlayer streamableEmbedUrl={question.streamableEmbedUrl} />
          </div>
        )}
        
        {question.type === "multiple_choice" && (
          <EditQuestionForm question={question} quizId={quizId} onSaved={handleSaved} />
        )}
        {question.type === "true_false" && (
          <EditQuestionFormTrueFalse question={question} quizId={quizId} onSaved={handleSaved} />
        )}
        {question.type === "short_answer" && (
          <EditQuestionFormShortAnswer question={question} quizId={quizId} onSaved={handleSaved} />
        )}
      </div>
    </div>
  );
}

