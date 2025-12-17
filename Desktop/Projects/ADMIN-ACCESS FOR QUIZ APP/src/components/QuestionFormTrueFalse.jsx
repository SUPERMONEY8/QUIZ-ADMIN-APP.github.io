import { useEffect, useMemo, useRef, useState } from "react";
import { questionOperations } from "../utils/databaseConfig";
import { storage } from "../firebaseConfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import useAuth from "../hooks/useAuth";
import { isValidStreamableEmbed, convertStreamableToEmbed } from "../utils/videoHelpers";

// Props: quizId (string), onSaved?: (questionId) => void
export default function QuestionFormTrueFalse({ quizId, onSaved }) {
  const { user } = useAuth();

  const [text, setText] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState(true);
  const [points, setPoints] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [streamableEmbedUrl, setStreamableEmbedUrl] = useState("");
  const [streamableEmbedUrlError, setStreamableEmbedUrlError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!imageFile) {
      setImagePreview("");
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setImagePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const validate = () => {
    const errs = [];
    if (!quizId) errs.push("Missing quiz context.");
    if (!user?.id && !user?.uid) errs.push("You must be logged in.");
    if (!text.trim()) errs.push("Question text is required.");
    const p = Number(points);
    if (!Number.isFinite(p) || p < 1 || p > 10) errs.push("Points must be between 1 and 10.");
    return errs;
  };

  const uploadImageIfAny = async () => {
    if (!imageFile) return "";
    setUploading(true);
    try {
      const fileName = `${Date.now()}_${imageFile.name}`;
      const filePath = `quizzes/${quizId}/questions/${fileName}`;
      const storageRef = ref(storage, filePath);
      
      await uploadBytes(storageRef, imageFile);
      const downloadURL = await getDownloadURL(storageRef);
      
      return downloadURL;
    } catch (err) {
      console.error("Error uploading image:", err);
      throw new Error("Failed to upload image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleImageChoose = () => fileInputRef.current?.click();

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
      console.log("Saving True/False question...", { quizId, userId: user?.id || user?.uid });
      
      let imageUrl = "";
      try {
        imageUrl = await uploadImageIfAny();
      } catch (uploadErr) {
        console.error("Image upload error:", uploadErr);
        setError("Failed to upload image. Please try again.");
        return;
      }
      
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
      
      const questionData = {
        quiz_id: quizId,
        question_text: text.trim(),
        question_type: "true_false",
        correct_answer: correctAnswer ? "true" : "false",
        points: Number(points),
        image_url: imageUrl || null,
        video_url: finalVideoUrl || null,
        question_order: nextOrder,
        status: "published",
      };
      
      const questionId = await questionOperations.create(questionData);
      
      if (!questionId) {
        throw new Error("Failed to get question ID after saving");
      }
      
      console.log("✅ True/False question saved with ID:", questionId);
      setSuccess(true);
      
      // Reset form
      setText("");
      setCorrectAnswer(true);
      setPoints(1);
      setImageFile(null);
      setImagePreview("");
      setStreamableEmbedUrl("");
      setStreamableEmbedUrlError("");
      
      if (onSaved) {
        setTimeout(() => {
          onSaved(questionId);
        }, 500);
      }
    } catch (e2) {
      console.error("❌ Save question error:", e2);
      let errorMsg = e2?.message || "Failed to save question.";
      
      if (errorMsg.includes("permission") || errorMsg.includes("Permission")) {
        errorMsg = "Permission denied. Please check your Firebase security rules.";
      } else if (errorMsg.includes("Failed to fetch") || errorMsg.includes("network")) {
        errorMsg = "Network error. Please check your internet connection and try again.";
      } else if (errorMsg.includes("quiz_id") || errorMsg.includes("Invalid quiz")) {
        errorMsg = "Invalid quiz ID. Please refresh and try again.";
      }
      
      setError(errorMsg);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-gray-900">Add True/False Question</h2>
      <p className="mt-1 text-sm text-gray-600">Select the correct answer below</p>

      {error ? (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>
      ) : null}
      
      {success ? (
        <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
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
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-300"
              placeholder="Type your question here"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Correct Answer</label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setCorrectAnswer(true)}
                className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-sm border ${
                  correctAnswer === true
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                ✓ True {correctAnswer === true && "(Correct)"}
              </button>
              <button
                type="button"
                onClick={() => setCorrectAnswer(false)}
                className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium shadow-sm border ${
                  correctAnswer === false
                    ? "bg-green-600 text-white border-green-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                ✗ False {correctAnswer === false && "(Correct)"}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">💡 Click the button to mark it as the correct answer</p>
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
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400 dark:placeholder-gray-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Question Image (optional)</label>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                />
                <button
                  type="button"
                  onClick={handleImageChoose}
                  disabled={uploading || saving}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
                >
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded object-cover border" />
                ) : null}
              </div>
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
            disabled={saving || uploading}
            className="inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}


