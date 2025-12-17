import { useState, useRef, useEffect, useCallback } from "react";
import { X, Image as ImageIcon, Video, Loader2 } from "lucide-react";
import { uploadFile, validateFile, deleteFileFromUrl } from "../utils/supabaseUpload";

/**
 * MediaUpload Component
 * Handles image and video uploads to Supabase Storage with progress tracking
 * 
 * @param {Object} props
 * @param {string} props.quizId - Quiz ID for organizing files
 * @param {string} props.currentUrl - Current file URL (for replacing existing files)
 * @param {Function} props.onUploadComplete - Callback when upload completes (receives URL)
 * @param {Function} props.onUploadError - Callback when upload fails (receives error message)
 * @param {string} props.accept - File types to accept (default: "image/*")
 * @param {string} props.label - Label for the upload button
 * @param {boolean} props.showPreview - Whether to show preview (default: true)
 * @param {string} props.type - "image" or "video" (default: "image")
 */
export default function MediaUpload({
  quizId,
  currentUrl = null,
  onUploadComplete,
  onUploadError,
  accept = "image/*",
  label = "Upload Media",
  showPreview = true,
  type = "image",
}) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(currentUrl || "");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  // Update preview when currentUrl changes
  useEffect(() => {
    if (currentUrl && !file) {
      setPreview(currentUrl);
    }
  }, [currentUrl, file]);

  const handleUpload = useCallback(async () => {
    if (!file || !quizId) return;

    setUploading(true);
    setProgress(0);
    setError("");

    try {
      // Generate file path
      const timestamp = Date.now();
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const fileName = `${timestamp}_${sanitizedName}`;
      const filePath = `quizzes/${quizId}/questions/${fileName}`;

      // Upload with progress tracking
      const publicUrl = await uploadFile(
        file,
        filePath,
        (progressValue) => {
          setProgress(progressValue);
        },
        currentUrl // Delete old file if replacing
      );

      setPreview(publicUrl);
      setProgress(100);

      if (onUploadComplete) {
        onUploadComplete(publicUrl);
      }
    } catch (err) {
      const errorMessage = err.message || "Failed to upload file. Please try again.";
      setError(errorMessage);
      setPreview(currentUrl || "");
      if (onUploadError) {
        onUploadError(errorMessage);
      }
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [file, quizId, currentUrl, onUploadComplete, onUploadError]);

  // Create preview when file is selected
  useEffect(() => {
    if (!file) {
      if (!currentUrl) {
        setPreview("");
      }
      return;
    }

    // Validate file before showing preview
    const validation = validateFile(file);
    if (!validation.valid) {
      setError(validation.error);
      setFile(null);
      if (onUploadError) {
        onUploadError(validation.error);
      }
      return;
    }

    setError("");
    const url = URL.createObjectURL(file);
    setPreview(url);

    // Auto-upload when file is selected
    handleUpload();

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, handleUpload, onUploadError, currentUrl]);

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const validation = validateFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error);
      if (onUploadError) {
        onUploadError(validation.error);
      }
      return;
    }

    setFile(selectedFile);
    setError("");
  };


  const handleRemove = async () => {
    // Delete from storage if there's a current URL
    if (currentUrl) {
      try {
        await deleteFileFromUrl(currentUrl);
      } catch (err) {
        console.error("Error deleting file:", err);
      }
    }

    setFile(null);
    setPreview("");
    setError("");
    setProgress(0);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (onUploadComplete) {
      onUploadComplete(null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <input
          type="file"
          accept={accept}
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          disabled={uploading}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              {type === "image" ? (
                <ImageIcon className="h-4 w-4" />
              ) : (
                <Video className="h-4 w-4" />
              )}
              <span>{label}</span>
            </>
          )}
        </button>

        {preview && !uploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="inline-flex items-center gap-1 rounded-md bg-red-50 border border-red-200 px-2 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100 transition-colors"
            title="Remove file"
          >
            <X className="h-3 w-3" />
            Remove
          </button>
        )}
      </div>

      {/* Progress Bar */}
      {uploading && (
        <div className="space-y-1">
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-600">{progress}% uploaded</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-md bg-red-50 p-2 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      {/* File Info */}
      {file && !uploading && (
        <div className="text-xs text-gray-600">
          Selected: {file.name} ({formatFileSize(file.size)})
        </div>
      )}

      {/* Preview */}
      {showPreview && preview && (
        <div className="relative inline-block">
          {type === "image" ? (
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-auto rounded-md object-cover border border-gray-300 shadow-sm"
            />
          ) : (
            <video
              src={preview}
              controls
              className="h-32 w-auto rounded-md border border-gray-300 shadow-sm"
            >
              Your browser does not support the video tag.
            </video>
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-md flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

