import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { questionOperations } from "../utils/databaseConfig";
import useAuth from "../hooks/useAuth";
import { isValidStreamableEmbed, convertStreamableToEmbed } from "../utils/videoHelpers";
import MediaUpload from "./MediaUpload";

// Props: quizId (string), onSaved?: (questionId) => void
export default function QuestionForm({ quizId, onSaved }) {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  // ALL HOOKS MUST BE CALLED FIRST - before any conditional returns
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [points, setPoints] = useState(1);
  const [imageUrl, setImageUrl] = useState("");
  const [streamableEmbedUrl, setStreamableEmbedUrl] = useState("");
  const [streamableEmbedUrlError, setStreamableEmbedUrlError] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // ALL useMemo hooks must also be called before conditional returns
  const canAddOption = useMemo(() => options.length < 4, [options]);
  const canRemoveOption = useMemo(() => options.length > 2, [options]);
  
  // NOW we can do conditional returns
  // Show loading if auth is still checking
  if (authLoading) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-medical-600 border-t-transparent rounded-full"></div>
          <span className="ml-2 text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }
  
  // Check if user is available
  if (!user?.id && !user?.uid) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          You must be logged in to add questions. Please refresh the page.
        </div>
      </div>
    );
  }
  
  // Check if quizId is available
  if (!quizId) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">
          Missing quiz context. Please go back and try again.
        </div>
      </div>
    );
  }


  const validate = () => {
    const errs = [];
    if (!quizId) errs.push("Missing quiz context.");
    if (!user?.id && !user?.uid) errs.push("You must be logged in.");
    if (!text.trim()) errs.push("Question text is required.");
    const trimmed = options.map((o) => o.trim());
    if (trimmed.some((o) => o.length === 0)) errs.push("All options must be filled.");
    if (trimmed.length < 2) errs.push("Need at least 2 options.");
    const p = Number(points);
    if (!Number.isFinite(p) || p < 1 || p > 10) errs.push("Points must be between 1 and 10.");
    if (correctIndex < 0 || correctIndex >= trimmed.length) errs.push("Select the correct answer.");
    return errs;
  };


  const handleAddOption = () => {
    if (!canAddOption) return;
    setOptions((prev) => [...prev, ""]);
  };

  const handleRemoveOption = (index) => {
    if (!canRemoveOption) return;
    setOptions((prev) => {
      const next = prev.filter((_, i) => i !== index);
      // Adjust correct index if needed
      if (correctIndex >= next.length) {
        setCorrectIndex(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  const handleOptionChange = (index, value) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
  };

  const handleImageUploadComplete = (url) => {
    setImageUrl(url || "");
  };

  const handleImageUploadError = (errorMessage) => {
    setError(errorMessage);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const issues = validate();
    if (issues.length) {
      setError(issues.join(" "));
      return;
    }
    
    if ((!user?.id && !user?.uid) || !quizId) {
      setError("Missing user or quiz context.");
      return;
    }
    
    try {
      setSaving(true);
      console.log("Saving question...", { quizId, userId: user?.id || user?.uid });
      
      // Process Streamable embed URL - preserve the exact format the user entered
      let finalVideoUrl = "";
      if (streamableEmbedUrl.trim()) {
        try {
          const trimmedUrl = streamableEmbedUrl.trim();
          if (isValidStreamableEmbed(trimmedUrl)) {
            // Extract URL from iframe if needed, but preserve exact format
            let extractedUrl = trimmedUrl;
            
            // If it's an iframe, extract the src URL
            if (trimmedUrl.includes("<iframe") && trimmedUrl.includes("src=")) {
              const srcMatch = trimmedUrl.match(/src=["']([^"']+)["']/);
              if (srcMatch && srcMatch[1]) {
                extractedUrl = srcMatch[1];
              }
            }
            
            // Normalize to embed format but preserve ALL query parameters exactly
            // If already has /e/ and starts with http, use as-is
            if (extractedUrl.includes("/e/") && extractedUrl.startsWith("http")) {
              finalVideoUrl = extractedUrl;
            } else {
              // Convert to embed format, preserving query params
              finalVideoUrl = convertStreamableToEmbed(extractedUrl);
            }
            
            console.log("Original URL:", trimmedUrl);
            console.log("Extracted URL:", extractedUrl);
            console.log("Final saved URL:", finalVideoUrl);
          } else {
            setError("Invalid Streamable embed URL. Please provide a valid Streamable link (e.g., https://streamable.com/e/xxxxxx).");
            return;
          }
        } catch (urlError) {
          console.error("Error processing Streamable URL:", urlError);
          setError("Error processing Streamable URL. Please check the format.");
          return;
        }
      }
      
      // Get the next question_order value
      let nextOrder = 0;
      try {
        const existingQuestions = await questionOperations.getByQuiz(quizId);
        if (existingQuestions && existingQuestions.length > 0) {
          const maxOrder = Math.max(...existingQuestions.map(q => q.question_order || q.orderIndex || 0));
          nextOrder = maxOrder + 1;
        }
      } catch (orderError) {
        console.error("Error fetching question order:", orderError);
        // Continue with order 0 if we can't fetch
      }
      
      // Convert options array to JSONB format: {"A": "option 1", "B": "option 2", ...}
      const optionsMap = {};
      const trimmedOptions = options.map((o) => o.trim());
      trimmedOptions.forEach((opt, idx) => {
        const letter = String.fromCharCode(65 + idx); // A, B, C, D
        optionsMap[letter] = opt;
      });
      
      // Get correct answer letter
      const correctAnswerLetter = String.fromCharCode(65 + correctIndex); // A, B, C, or D
      
      const questionData = {
        quiz_id: quizId,
        question_text: text.trim(),
        question_type: "multiple_choice",
        options: optionsMap,
        correct_answer: correctAnswerLetter,
        points: Number(points),
        image_url: imageUrl || null,
        video_url: finalVideoUrl || null,
        question_order: nextOrder,
        status: "published",
      };
      
      console.log("Question data:", questionData);
      
      const questionId = await questionOperations.create(questionData);
      
      if (!questionId) {
        throw new Error("Failed to get question ID after saving");
      }
      
      console.log("✅ Question saved successfully with ID:", questionId);
      setSuccess(true);
      
      // Reset form
      setText("");
      setOptions(["", ""]);
      setCorrectIndex(0);
      setPoints(1);
      setImageUrl("");
      setStreamableEmbedUrl("");
      setStreamableEmbedUrlError("");
      
      // Call onSaved callback after a brief delay
      if (onSaved) {
        setTimeout(() => {
          onSaved(questionId);
        }, 500);
      }
    } catch (e2) {
      console.error("❌ Save question error:", e2);
      let errorMsg = e2?.message || "Failed to save question.";
      
      // Check for permission errors
      if (errorMsg.includes("permission") || errorMsg.includes("Permission")) {
        errorMsg = "Permission denied. Please check your Firebase security rules.";
      } else if (errorMsg.includes("Failed to fetch") || errorMsg.includes("network")) {
        errorMsg = "Network error. Please check your internet connection and try again.";
      } else if (errorMsg.includes("foreign key") || errorMsg.includes("quiz_id") || errorMsg.includes("Invalid quiz")) {
        errorMsg = "Invalid quiz ID. Please refresh and try again.";
      }
      
      setError(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add Question</h2>
      <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Multiple Choice - Select the correct answer below</p>

      {error ? (
        <div className="mt-4 rounded-md bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">{error}</div>
      ) : null}
      
      {success ? (
        <div className="mt-4 rounded-md bg-green-50 dark:bg-green-900/20 p-3 text-sm text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
          Question saved successfully! The form will close shortly...
        </div>
      ) : null}

      <form className="mt-6" onSubmit={handleSave}>
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Question Text
            </label>
            <textarea
              id="question"
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-300"
              placeholder="Type your question here"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Answer Options</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleAddOption}
                  disabled={!canAddOption}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  + Add option
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="correct"
                    checked={correctIndex === idx}
                    onChange={() => setCorrectIndex(idx)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500"
                    title={`Select this as the correct answer`}
                  />
                  <input
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    className={`flex-1 rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-300 ${
                      correctIndex === idx 
                        ? "border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-600 text-gray-900 dark:text-gray-100" 
                        : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    }`}
                    placeholder={`Option ${idx + 1}`}
                  />
                  {correctIndex === idx && (
                    <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-1 rounded">Correct</span>
                  )}
                  {canRemoveOption && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="inline-flex items-center rounded-md bg-red-50 border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="mt-2 text-xs text-gray-500">💡 Tip: Click the radio button next to the correct answer option</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-gray-700 mb-1">
                Points (1-10)
              </label>
              <input
                id="points"
                type="number"
                min={1}
                max={10}
                value={points}
                onChange={(e) => setPoints(e.target.value)}
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Question Image (optional)</label>
              <MediaUpload
                quizId={quizId}
                currentUrl={imageUrl}
                onUploadComplete={handleImageUploadComplete}
                onUploadError={handleImageUploadError}
                accept="image/*"
                label="Upload Image"
                type="image"
                showPreview={true}
              />
            </div>
          </div>

          <div>
            <label htmlFor="streamableEmbedUrl" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Streamable Embed Link (optional)
            </label>
            <input
              id="streamableEmbedUrl"
              type="text"
              value={streamableEmbedUrl}
              onChange={(e) => {
                setStreamableEmbedUrl(e.target.value);
                setStreamableEmbedUrlError("");
              }}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-300"
              placeholder="Paste Streamable embed link here (e.g., https://streamable.com/e/xxxxxx)"
            />
            {streamableEmbedUrlError && (
              <p className="mt-1 text-xs text-red-600 dark:text-red-400">{streamableEmbedUrlError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              💡 Tip: You can paste either the full iframe embed code or just the URL (e.g., https://streamable.com/e/xxxxxx). The URL will be extracted automatically.
            </p>
          </div>
        </div>

        <div className="mt-6">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Question"}
          </button>
        </div>
      </form>
    </div>
  );
}


