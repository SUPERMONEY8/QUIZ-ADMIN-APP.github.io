import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { quizOperations, questionOperations, resultOperations } from "../utils/databaseConfig";
import { Loader2, CheckCircle2, XCircle, Clock, User, ArrowRight, Check, X, AlertCircle } from "lucide-react";
import VideoPlayer from "../components/VideoPlayer";

// Step constants
const STEP_WELCOME = "welcome";
const STEP_NAME_ENTRY = "name_entry";
const STEP_QUIZ = "quiz";
const STEP_THANK_YOU = "thank_you";

export default function TakeQuizPage() {
  const { quizId } = useParams();
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(STEP_WELCOME);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [participantName, setParticipantName] = useState("");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [questionAttempts, setQuestionAttempts] = useState({}); // Track attempts per question
  const [questionFeedback, setQuestionFeedback] = useState({}); // Track feedback per question
  const [questionStartTimes, setQuestionStartTimes] = useState({}); // Track when each question was started
  const [questionTimeSpent, setQuestionTimeSpent] = useState({}); // Track time spent on each question (in seconds)
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null); // Track when quiz started
  const [error, setError] = useState("");

  useEffect(() => {
    loadQuiz();
  }, [quizId]);

  useEffect(() => {
    const duration = quiz?.duration_minutes || quiz?.durationMinutes;
    if (quiz && duration && currentStep === STEP_QUIZ) {
      const totalSeconds = duration * 60;
      setTimeRemaining(totalSeconds);
      
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [quiz, currentStep]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError("");

      if (!quizId || quizId.startsWith('temp-')) {
        throw new Error("Invalid quiz ID. Please check the quiz link.");
      }

      // Load quiz
      const quizData = await quizOperations.get(quizId);

      if (!quizData) {
        console.error("Quiz not found:", quizId);
        throw new Error("Quiz not found. Please check the quiz link or contact the administrator.");
      }

      console.log("Quiz loaded:", { id: quizData.id, status: quizData.status, is_published: quizData.is_published });

      // Check if quiz is published
      const isPublished = quizData.status === "published" || quizData.is_published === true;
      
      if (!isPublished) {
        console.warn("Quiz is not published:", { status: quizData.status, is_published: quizData.is_published });
        throw new Error("This quiz is not available yet. Please publish it first from the admin dashboard.");
      }

      setQuiz(quizData);

      // Load questions
      const questionsData = await questionOperations.getByQuiz(quizId);

      if (!questionsData) {
        throw new Error("Failed to load questions");
      }

      // Convert options from object format to array format
      let processedQuestions = (questionsData || []).map((q) => {
        const questionType = q.question_type || q.type;
        let optionsArray = [];
        let correctAnswerText = q.correct_answer || q.correctAnswer;
        
        if (questionType === "multiple_choice" && q.options) {
          // Convert {"A": "option 1", "B": "option 2"} to array
          if (Array.isArray(q.options)) {
            optionsArray = q.options;
            // If options are already an array but correct_answer is still a letter, convert it
            // This handles edge cases where data might be in a different format
            if (correctAnswerText && correctAnswerText.length === 1 && /^[A-D]$/i.test(correctAnswerText)) {
              const letterIndex = correctAnswerText.toUpperCase().charCodeAt(0) - 65;
              if (letterIndex >= 0 && letterIndex < optionsArray.length) {
                correctAnswerText = optionsArray[letterIndex];
              }
            }
          } else if (typeof q.options === 'object') {
            const optionKeys = Object.keys(q.options).sort();
            optionsArray = optionKeys.map((key) => q.options[key]);
            
            // Convert correct_answer from letter (A, B, C, D) to actual option text
            if (correctAnswerText && q.options[correctAnswerText]) {
              correctAnswerText = q.options[correctAnswerText];
            }
          }
        }
        
        return {
          ...q,
          options: optionsArray,
          question_type: questionType,
          correct_answer: correctAnswerText,
          correctAnswer: correctAnswerText,
        };
      });

      // Randomize if needed
      let finalQuestions = processedQuestions;
      if (quizData.randomize_questions || quizData.randomizeQuestions) {
        finalQuestions = [...finalQuestions].sort(() => Math.random() - 0.5);
      }

      // Randomize answers if needed
      if (quizData.randomize_answers || quizData.randomizeAnswers) {
        finalQuestions = finalQuestions.map((q) => {
          const questionType = q.question_type || q.type;
          const options = q.options;
          if (questionType === "multiple_choice" && Array.isArray(options) && options.length > 0) {
            const optionsCopy = [...options];
            const shuffled = optionsCopy.sort(() => Math.random() - 0.5);
            return { ...q, options: shuffled };
          }
          return q;
        });
      }

      setQuestions(finalQuestions);
    } catch (err) {
      setError(err.message || "Failed to load quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (participantName.trim()) {
      // Store name in localStorage
      localStorage.setItem(`quiz_${quizId}_participant`, participantName.trim());
      // Record quiz start time
      const startTime = new Date();
      setQuizStartTime(startTime);
      
      // Record start time for first question
      if (questions.length > 0 && questions[0]) {
        setQuestionStartTimes({
          [questions[0].id]: startTime
        });
      }
      
      setCurrentStep(STEP_QUIZ);
    }
  };

  const handleAnswerSubmit = (questionId, answer) => {
    const currentQuestion = questions.find(q => q.id === questionId);
    if (!currentQuestion) return;

    const correctAnswer = currentQuestion.correct_answer || currentQuestion.correctAnswer;
    const questionType = currentQuestion.question_type || currentQuestion.type;
    
    // For multiple choice, compare exact text (already converted from letter to text during loading)
    // For true/false and short answer, use case-insensitive comparison
    let isCorrect = false;
    if (questionType === "multiple_choice") {
      isCorrect = answer.trim() === correctAnswer.trim();
    } else {
      isCorrect = answer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
    }
    
    const attempts = questionAttempts[questionId] || 0;
    const newAttempts = attempts + 1;

    // Calculate time spent on this question
    const questionStartTime = questionStartTimes[questionId];
    if (questionStartTime) {
      const timeSpent = Math.round((new Date().getTime() - questionStartTime.getTime()) / 1000); // in seconds
      setQuestionTimeSpent(prev => ({
        ...prev,
        [questionId]: (prev[questionId] || 0) + timeSpent // Add to existing time if they had previous attempts
      }));
    }

    // Update attempts
    setQuestionAttempts(prev => ({
      ...prev,
      [questionId]: newAttempts
    }));

    // Set feedback message
    let feedbackMessage = "";
    if (isCorrect) {
      feedbackMessage = "Correct! Well done!";
    } else {
      if (newAttempts === 1) {
        feedbackMessage = "Wrong answer. You have 2 more attempts.";
      } else if (newAttempts === 2) {
        feedbackMessage = "Wrong answer. You have 1 last attempt.";
      } else {
        feedbackMessage = "Wrong answer. You've used all 3 attempts.";
      }
    }

    setQuestionFeedback(prev => ({
      ...prev,
      [questionId]: {
        isCorrect,
        message: feedbackMessage,
        attempts: newAttempts,
        userAnswer: answer,
        correctAnswer: correctAnswer
      }
    }));

    // Store the answer
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));

    // If correct or all attempts used, move to next question after a delay
    if (isCorrect || newAttempts >= 3) {
      setTimeout(() => {
        if (currentQuestionIndex < questions.length - 1) {
          const nextIndex = currentQuestionIndex + 1;
          const nextQuestion = questions[nextIndex];
          
          // Record start time for next question
          if (nextQuestion) {
            setQuestionStartTimes(prev => ({
              ...prev,
              [nextQuestion.id]: new Date()
            }));
          }
          
          setCurrentQuestionIndex(nextIndex);
          // Clear feedback and answer for next question
          setQuestionFeedback(prev => {
            const newFeedback = { ...prev };
            delete newFeedback[questionId];
            return newFeedback;
          });
          // Don't clear the answer - keep it for results
        } else {
          // All questions answered, submit quiz
          handleSubmit();
        }
      }, 3000);
    } else {
      // Wrong answer but still has attempts - clear the selected answer so they can try again
      // Actually, keep the answer visible but allow them to change it
      // Restart timer for this question since they're trying again
      setQuestionStartTimes(prev => ({
        ...prev,
        [questionId]: new Date()
      }));
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const calculateScore = () => {
    let correct = 0;
    let total = questions.length;

    // Calculate score directly from answers and questions
    // The correct_answer has already been converted to option text during question loading
    questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (!userAnswer) {
        console.log(`Question ${q.id}: No answer provided`);
        return; // Skip if no answer provided
      }
      
      const correctAnswer = q.correct_answer || q.correctAnswer;
      const questionType = q.question_type || q.type;
      
      let isCorrect = false;
      
      if (questionType === "multiple_choice") {
        // After question loading, correct_answer is already converted to option text
        // So we can directly compare the user's selected option text with the correct answer text
        // Both should be the actual option text (e.g., "An iPhone green screen.")
        const userAnswerTrimmed = userAnswer.trim();
        const correctAnswerTrimmed = correctAnswer ? correctAnswer.trim() : "";
        
        isCorrect = userAnswerTrimmed === correctAnswerTrimmed;
        
        console.log(`Multiple Choice Question ${q.id}:`, {
          userAnswer: userAnswerTrimmed,
          correctAnswer: correctAnswerTrimmed,
          isCorrect,
          options: q.options
        });
      } else if (questionType === "true_false") {
        // For true/false, compare the boolean value
        isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        console.log(`True/False Question ${q.id}:`, {
          userAnswer: userAnswer.trim().toLowerCase(),
          correctAnswer: correctAnswer.trim().toLowerCase(),
          isCorrect
        });
      } else if (questionType === "short_answer") {
        // For short answer, compare the text (case-insensitive)
        isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        console.log(`Short Answer Question ${q.id}:`, {
          userAnswer: userAnswer.trim().toLowerCase(),
          correctAnswer: correctAnswer.trim().toLowerCase(),
          isCorrect
        });
      }
      
      if (isCorrect) {
        correct++;
      }
    });

    console.log("Final Score calculation:", { correct, total, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 });
    return { correct, total, percentage: total > 0 ? Math.round((correct / total) * 100) : 0 };
  };

  const handleSubmit = async () => {
    const result = calculateScore();

    // Calculate time spent on current question if still viewing it
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion && questionStartTimes[currentQuestion.id]) {
      const questionStartTime = questionStartTimes[currentQuestion.id];
      const timeSpent = Math.round((new Date().getTime() - questionStartTime.getTime()) / 1000);
      setQuestionTimeSpent(prev => ({
        ...prev,
        [currentQuestion.id]: (prev[currentQuestion.id] || 0) + timeSpent
      }));
    }

    // Calculate time spent
    const endTime = new Date();
    const timeSpentSeconds = quizStartTime
      ? Math.round((endTime.getTime() - quizStartTime.getTime()) / 1000)
      : 0;

    // Prepare detailed question attempts data
    // For each question, save: response, attempts count, and which attempt was correct
    const questionDetails = questions.map((q) => {
      const userAnswer = answers[q.id] || null;
      const attempts = questionAttempts[q.id] || 0;
      const feedback = questionFeedback[q.id];
      const correctAnswer = q.correct_answer || q.correctAnswer;
      const questionType = q.question_type || q.type;
      const timeSpent = questionTimeSpent[q.id] || 0; // Time spent on this question in seconds
      
      // Calculate is_correct directly by comparing answers (same logic as calculateScore)
      // Don't rely on feedback as it might be missing or outdated
      let isCorrect = false;
      if (userAnswer && correctAnswer) {
        if (questionType === "multiple_choice") {
          isCorrect = userAnswer.trim() === correctAnswer.trim();
        } else if (questionType === "true_false") {
          isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        } else if (questionType === "short_answer") {
          isCorrect = userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
        }
      }
      
      // Determine which attempt got the correct answer (1st, 2nd, 3rd, or never)
      let correctAttempt = null;
      if (isCorrect) {
        // If the final answer is correct, check which attempt it was
        if (feedback && feedback.isCorrect) {
          correctAttempt = feedback.attempts || attempts; // The attempt number when they got it right
        } else {
          // If no feedback but answer is correct, assume it was the last attempt
          correctAttempt = attempts > 0 ? attempts : 1;
        }
      } else if (attempts >= 3) {
        correctAttempt = null; // Never got it right (used all 3 attempts)
      }
      
      console.log(`Question ${q.id} details:`, {
        userAnswer,
        correctAnswer,
        isCorrect,
        attempts,
        correctAttempt,
        timeSpent
      });
      
      return {
        question_id: q.id,
        question_text: q.question_text || q.text,
        question_type: questionType,
        user_answer: userAnswer,
        correct_answer: correctAnswer,
        attempts: attempts,
        correct_attempt: correctAttempt, // 1, 2, 3, or null if never correct
        is_correct: isCorrect, // Calculate directly, don't rely on feedback
        time_spent_seconds: timeSpent // Time spent on this question
      };
    });

    // Save results - ensure score is properly calculated and saved
    try {
      console.log("Saving quiz results:", {
        quiz_id: quizId,
        participant_name: participantName || "Anonymous",
        total_score: result.correct,
        total_questions: result.total,
        percentage: result.percentage,
        answers: answers,
        question_details: questionDetails
      });
      
      await resultOperations.create({
        quiz_id: quizId,
        participant_name: participantName || "Anonymous",
        total_score: result.correct,
        total_questions: result.total,
        answers: answers,
        question_details: questionDetails, // Detailed attempts data
        completed_at: new Date().toISOString(),
        time_spent_seconds: timeSpentSeconds,
      });
      
      console.log("✅ Results saved successfully");
    } catch (err) {
      console.error("❌ Failed to save results:", err);
      // Don't block the user from seeing results even if save fails
    }

    setCurrentStep(STEP_THANK_YOU);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <p className="text-gray-600 dark:text-gray-400 text-lg">No questions available</p>
      </div>
    );
  }

  // Welcome Screen
  if (currentStep === STEP_WELCOME) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-6">
              <CheckCircle2 className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Welcome to the Quiz!
            </h1>
            <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-2xl p-6">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-3">
                {quiz.title || quiz.name || "Untitled Quiz"}
              </h2>
              {quiz.description && (
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                  {quiz.description}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md text-center">
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-2">
                  {questions.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  Questions
                </div>
              </div>
              {quiz.duration_minutes && (
                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                    {quiz.duration_minutes}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    Minutes
                  </div>
                </div>
              )}
              {quiz.difficulty && (
                <div className="bg-white dark:bg-gray-700 rounded-xl p-6 shadow-md text-center">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                    {quiz.difficulty.charAt(0)}
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {quiz.difficulty}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button
            onClick={() => setCurrentStep(STEP_NAME_ENTRY)}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-lg"
          >
            Get Started
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    );
  }

  // Name Entry Screen
  if (currentStep === STEP_NAME_ENTRY) {
    // Check if name already stored
    const storedName = localStorage.getItem(`quiz_${quizId}_participant`);
    if (storedName) {
      setParticipantName(storedName);
      setQuizStartTime(new Date());
      setCurrentStep(STEP_QUIZ);
      return null;
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-full mb-6">
              <User className="h-10 w-10 text-indigo-600 dark:text-indigo-400" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Enter Your Name
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              Please provide your name to begin the quiz
            </p>
          </div>

          <form onSubmit={handleNameSubmit} className="space-y-6">
            <div>
              <input
                type="text"
                value={participantName}
                onChange={(e) => setParticipantName(e.target.value)}
                placeholder="Your name"
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!participantName.trim()}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105 flex items-center justify-center gap-2 text-lg"
            >
              Continue to Quiz
              <ArrowRight className="h-5 w-5" />
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Thank You Screen
  if (currentStep === STEP_THANK_YOU) {
    const result = calculateScore();
    
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
        <div className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full mb-8">
            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Thank You!
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {participantName ? `${participantName}, ` : ""}Your quiz has been submitted successfully.
          </p>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 mb-8">
            <p className="text-2xl text-gray-700 dark:text-gray-300 mb-4">Your Score</p>
            <div className="text-6xl font-bold text-green-600 dark:text-green-400 mb-2">
              {result.correct} / {result.total}
            </div>
            <div className="text-3xl text-gray-600 dark:text-gray-400">
              {result.percentage}%
            </div>
          </div>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Your responses have been recorded.
          </p>
        </div>
      </div>
    );
  }

  // Quiz Screen
  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const attempts = questionAttempts[currentQuestion.id] || 0;
  const feedback = questionFeedback[currentQuestion.id];
  const canSubmit = attempts < 3 && (!feedback || !feedback.isCorrect);
  const canChangeAnswer = canSubmit; // If they can submit, they can change their answer

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {quiz.title || quiz.name || "Untitled Quiz"}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Participant: {participantName || "Anonymous"}
              </p>
            </div>
            {timeRemaining !== null && quiz.duration_minutes && (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-lg">
                <Clock className="h-5 w-5" />
                <span className="font-mono font-bold text-lg">{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-2">
            <div
              className="bg-gradient-to-r from-indigo-600 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 mb-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              {currentQuestion.question_text}
            </h2>
            {attempts > 0 && (
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                Attempts: {attempts} / 3
              </div>
            )}
          </div>

          {/* Image Display */}
          {currentQuestion.image_url && (
            <div className="mb-6">
              <img
                src={currentQuestion.image_url}
                alt="Question image"
                className="w-full max-w-2xl mx-auto rounded-lg shadow-md"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          )}

          {/* Video Display */}
          {(currentQuestion.video_url || currentQuestion.streamableEmbedUrl) && (
            <div className="mb-6">
              <VideoPlayer
                streamableEmbedUrl={currentQuestion.video_url || currentQuestion.streamableEmbedUrl}
                className="w-full"
              />
            </div>
          )}

          {/* Feedback Message */}
          {feedback && (
            <div className={`mb-6 p-4 rounded-xl ${
              feedback.isCorrect 
                ? "bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800" 
                : "bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800"
            }`}>
              <div className="flex items-start gap-3">
                {feedback.isCorrect ? (
                  <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-semibold ${
                    feedback.isCorrect 
                      ? "text-green-800 dark:text-green-300" 
                      : "text-red-800 dark:text-red-300"
                  }`}>
                    {feedback.message}
                  </p>
                  {feedback.isCorrect && (
                    <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                      Your answer: {feedback.userAnswer}
                    </p>
                  )}
                  {!feedback.isCorrect && attempts >= 3 && (
                    <p className="text-sm text-red-700 dark:text-red-400 mt-1">
                      Correct answer: {feedback.correctAnswer}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Answer Options */}
          {(currentQuestion.question_type === "multiple_choice" || currentQuestion.type === "multiple_choice") && (
            <div className="space-y-3">
              {Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 ? (
                currentQuestion.options.map((option, idx) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  const isCorrect = feedback?.isCorrect && feedback?.userAnswer === option;
                  const isWrong = feedback && !feedback.isCorrect && feedback?.userAnswer === option;
                  const showCorrect = feedback && !feedback.isCorrect && attempts >= 3 && option === feedback.correctAnswer;

                  return (
                    <button
                      key={idx}
                      onClick={() => canChangeAnswer && handleAnswerChange(currentQuestion.id, option)}
                      disabled={!canChangeAnswer}
                      className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 ${
                        showCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : isCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : isWrong
                          ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                          : isSelected
                          ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                      } ${!canChangeAnswer ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          showCorrect || isCorrect
                            ? "border-green-500 bg-green-500"
                            : isWrong
                            ? "border-red-500 bg-red-500"
                            : isSelected
                            ? "border-indigo-600 bg-indigo-600"
                            : "border-gray-300 dark:border-gray-600"
                        }`}>
                          {showCorrect || isCorrect ? (
                            <Check className="h-4 w-4 text-white" />
                          ) : isWrong ? (
                            <X className="h-4 w-4 text-white" />
                          ) : isSelected ? (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          ) : null}
                        </div>
                        <span className={`text-lg ${
                          showCorrect || isCorrect
                            ? "text-green-800 dark:text-green-300 font-semibold"
                            : isWrong
                            ? "text-red-800 dark:text-red-300"
                            : "text-gray-900 dark:text-white"
                        }`}>
                          {option}
                        </span>
                        {showCorrect && (
                          <span className="ml-auto text-sm text-green-600 dark:text-green-400 font-medium">
                            Correct Answer
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No options available for this question.</p>
              )}
            </div>
          )}

          {(currentQuestion.question_type === "true_false" || currentQuestion.type === "true_false") && (
            <div className="space-y-3">
              {["True", "False"].map((option) => {
                const isSelected = answers[currentQuestion.id] === option;
                const isCorrect = feedback?.isCorrect && feedback?.userAnswer === option;
                const isWrong = feedback && !feedback.isCorrect && feedback?.userAnswer === option;
                const showCorrect = feedback && !feedback.isCorrect && attempts >= 3 && option === feedback.correctAnswer;

                return (
                  <button
                    key={option}
                    onClick={() => canChangeAnswer && handleAnswerChange(currentQuestion.id, option)}
                    disabled={!canChangeAnswer}
                    className={`w-full text-left p-4 border-2 rounded-xl transition-all duration-200 ${
                      showCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : isCorrect
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                        : isWrong
                        ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                        : isSelected
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20"
                        : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600"
                    } ${!canChangeAnswer ? "opacity-75 cursor-not-allowed" : "cursor-pointer"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        showCorrect || isCorrect
                          ? "border-green-500 bg-green-500"
                          : isWrong
                          ? "border-red-500 bg-red-500"
                          : isSelected
                          ? "border-indigo-600 bg-indigo-600"
                          : "border-gray-300 dark:border-gray-600"
                      }`}>
                        {showCorrect || isCorrect ? (
                          <Check className="h-4 w-4 text-white" />
                        ) : isWrong ? (
                          <X className="h-4 w-4 text-white" />
                        ) : isSelected ? (
                          <div className="w-2 h-2 bg-white rounded-full" />
                        ) : null}
                      </div>
                      <span className={`text-lg ${
                        showCorrect || isCorrect
                          ? "text-green-800 dark:text-green-300 font-semibold"
                          : isWrong
                          ? "text-red-800 dark:text-red-300"
                          : "text-gray-900 dark:text-white"
                      }`}>
                        {option}
                      </span>
                      {showCorrect && (
                        <span className="ml-auto text-sm text-green-600 dark:text-green-400 font-medium">
                          Correct Answer
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {(currentQuestion.question_type === "short_answer" || currentQuestion.type === "short_answer") && (
            <div className="space-y-4">
              <textarea
                value={answers[currentQuestion.id] || ""}
                onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
                placeholder="Type your answer here..."
                disabled={!canChangeAnswer}
                className={`w-full p-4 border-2 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-400 text-lg ${
                  feedback?.isCorrect
                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                    : feedback && !feedback.isCorrect && attempts >= 3
                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                    : "border-gray-200 dark:border-gray-600"
                } ${!canChangeAnswer ? "opacity-75 cursor-not-allowed" : ""}`}
                rows={4}
              />
              {canSubmit && !feedback?.isCorrect && (
                <button
                  onClick={() => handleAnswerSubmit(currentQuestion.id, answers[currentQuestion.id] || "")}
                  disabled={!answers[currentQuestion.id]?.trim()}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
                >
                  Submit Answer
                </button>
              )}
            </div>
          )}

          {/* Submit button for multiple choice and true/false */}
          {canSubmit && 
           (currentQuestion.question_type === "multiple_choice" || currentQuestion.type === "multiple_choice" || 
            currentQuestion.question_type === "true_false" || currentQuestion.type === "true_false") && 
           answers[currentQuestion.id] && (
            <button
              onClick={() => handleAnswerSubmit(currentQuestion.id, answers[currentQuestion.id])}
              className="mt-6 w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg transform transition-all duration-200 hover:scale-105"
            >
              Submit Answer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
