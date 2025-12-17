import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";
import { questionOperations } from "../utils/databaseConfig";
import useAuth from "../hooks/useAuth";
import { isValidStreamableEmbed, convertStreamableToEmbed } from "../utils/videoHelpers";

// Props: quizId (string), question (object with id and data), onSaved?: () => void
export default function EditQuestionForm({ quizId, question, onSaved }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [text, setText] = useState(question?.text || "");
  const [options, setOptions] = useState(question?.options || ["", ""]);
  const [correctIndex, setCorrectIndex] = useState(question?.correctIndex ?? 0);
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
      setOptions(question.options || ["", ""]);
      setCorrectIndex(question.correctIndex ?? 0);
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

  const canAddOption = useMemo(() => options.length < 4, [options]);
  const canRemoveOption = useMemo(() => options.length > 2, [options]);

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

  const handleAddOption = () => {
    if (!canAddOption) return;
    setOptions((prev) => [...prev, ""]);
  };

  const handleRemoveOption = (index) => {
    if (!canRemoveOption) return;
    setOptions((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (correctIndex >= next.length) {
        setCorrectIndex(Math.max(0, next.length - 1));
      }
      return next;
    });
  };

  const handleOptionChange = (index, value) => {
    setOptions((prev) => prev.map((o, i) => (i === index ? value : o)));
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
      console.log("Updating question...", { quizId, questionId: question.id, userId: user?.id || user?.uid });
      
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
      
      // Convert options array to JSONB format: {"A": "option 1", "B": "option 2", ...}
      const optionsMap = {};
      const trimmedOptions = options.map((o) => o.trim());
      trimmedOptions.forEach((opt, idx) => {
        const letter = String.fromCharCode(65 + idx); // A, B, C, D
        optionsMap[letter] = opt;
      });
      
      // Get correct answer letter
      const correctAnswerLetter = String.fromCharCode(65 + correctIndex); // A, B, C, or D
      
      const updateData = {
        question_text: text.trim(),
        options: optionsMap,
        correct_answer: correctAnswerLetter,
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
      <h2 className="text-xl font-semibold text-black dark:text-black">Edit Question</h2>
      <p className="mt-1 text-sm text-black dark:text-black">Multiple Choice - Select the correct answer below</p>

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
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="block w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-black px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Type your question here"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-black dark:text-black">Answer Options</label>
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
                    className={`flex-1 rounded-md border px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                      correctIndex === idx ? "border-green-500 bg-green-50" : "border-gray-300"
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
            <p className="mt-2 text-xs text-black dark:text-black">💡 Tip: Click the radio button next to the correct answer option</p>
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
              <label className="block text-sm font-medium text-black dark:text-black mb-1">Question Image (optional)</label>
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
            <label htmlFor="streamableEmbedUrl" className="block text-sm font-medium text-black dark:text-black mb-1">
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
            <p className="mt-1 text-xs text-black dark:text-black">
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

