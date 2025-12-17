import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import { questionOperations } from "../utils/databaseConfig";
import useAuth from "../hooks/useAuth";
import { isValidStreamableEmbed, convertStreamableToEmbed } from "../utils/videoHelpers";

export default function EditQuestionFormTrueFalse({ quizId, question, onSaved }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [text, setText] = useState(question?.text || "");
  const [correctAnswer, setCorrectAnswer] = useState(question?.correctAnswer ?? true);
  const [points, setPoints] = useState(question?.points || 1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(question?.imageUrl || "");
  const [streamableEmbedUrl, setStreamableEmbedUrl] = useState(question?.streamableEmbedUrl || "");
  const [streamableEmbedUrlError, setStreamableEmbedUrlError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef(null);

  // Update form fields when question prop changes
  useEffect(() => {
    if (question) {
      setText(question.text || "");
      setCorrectAnswer(question.correctAnswer ?? true);
      setPoints(question.points || 1);
      setStreamableEmbedUrl(question.streamableEmbedUrl || question.videoUrl || "");
      if (question.imageUrl && !imageFile) {
        setImagePreview(question.imageUrl);
      }
    }
  }, [question]);

  useEffect(() => {
    if (question?.imageUrl && !imageFile) {
      setImagePreview(question.imageUrl);
    }
  }, [question, imageFile]);

  useEffect(() => {
    if (!imageFile) return;
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
    if (!imageFile) return question?.imageUrl || question?.image_url || "";
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
    
    if ((!user?.id && !user?.uid) || !quizId || !question?.id) {
      setError("Missing user, quiz, or question context.");
      return;
    }
    
    try {
      setSaving(true);
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
            setSaving(false);
            return;
          }
        } catch (urlError) {
          console.error("Error processing Streamable URL:", urlError);
          setError("Error processing Streamable URL. Please check the format.");
          setSaving(false);
          return;
        }
      }
      
      const updateData = {
        question_text: text.trim(),
        correct_answer: correctAnswer ? "true" : "false",
        points: Number(points),
        image_url: imageUrl || null,
        video_url: finalVideoUrl || null,
      };
      
      console.log("Updating question with data:", updateData);
      
      await questionOperations.update(question.id, updateData);
      
      console.log("✅ Question updated successfully");
      setSuccess(true);
      
      if (onSaved) {
        setTimeout(() => {
          onSaved();
        }, 500);
      }
    } catch (e2) {
      console.error("❌ Update question error:", e2);
      let errorMsg = "Failed to update question.";
      
      // Handle different error types
      if (e2?.message) {
        errorMsg = e2.message;
      } else if (typeof e2 === "string") {
        errorMsg = e2;
      }
      
      // Network errors
      if (errorMsg.includes("Failed to fetch") || errorMsg.includes("NetworkError") || errorMsg.includes("fetch")) {
        errorMsg = "Network error. Please check your internet connection and try again.";
      }
      // Permission errors
      else if (errorMsg.includes("permission") || errorMsg.includes("permission-denied")) {
        errorMsg = "Permission denied. Please check your Firebase security rules.";
      }
      // Foreign key errors
      else if (errorMsg.includes("foreign key") || errorMsg.includes("quiz_id")) {
        errorMsg = "Invalid quiz ID. Please refresh and try again.";
      }
      // Firebase specific errors
      else if (e2?.code) {
        errorMsg = `Database error (${e2.code}): ${errorMsg}`;
      }
      
      setError(errorMsg);
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 sm:p-8">
      <h2 className="text-xl font-semibold text-black dark:text-black">Edit True/False Question</h2>
      <p className="mt-1 text-sm text-black dark:text-black">Select the correct answer below</p>

      {error ? (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>
      ) : null}
      
      {success ? (
        <div className="mt-4 rounded-md bg-green-50 p-3 text-sm text-green-700 border border-green-200">
          Question updated successfully! Redirecting...
        </div>
      ) : null}

      <form className="mt-6" onSubmit={handleSave}>
        <div className="grid grid-cols-1 gap-5">
          <div>
            <label htmlFor="question" className="block text-sm font-medium text-black dark:text-black mb-1">
              Question Text
            </label>
            <textarea
              id="question"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Type your question here"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-black dark:text-black mb-2">Select Correct Answer</label>
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
            <p className="mt-2 text-xs text-black dark:text-black">💡 Click the button to mark it as the correct answer</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="points" className="block text-sm font-medium text-black dark:text-black mb-1">
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
                  {uploading ? "Uploading..." : imagePreview ? "Change Image" : "Upload Image"}
                </button>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded object-cover border" />
                ) : null}
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="streamableEmbedUrl" className="block text-sm font-medium text-gray-700 mb-1">
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
              className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Paste Streamable embed link here (e.g., https://streamable.com/e/xxxxxx)"
            />
            {streamableEmbedUrlError && (
              <p className="mt-1 text-xs text-red-600">{streamableEmbedUrlError}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              💡 Tip: You can paste either the full iframe embed code or just the URL (e.g., https://streamable.com/e/xxxxxx). The URL will be extracted automatically.
            </p>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={saving || uploading}
            className="inline-flex justify-center items-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
          >
            {saving ? "Saving..." : "Update Question"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/admin/quizzes/${quizId}/questions`)}
            className="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

