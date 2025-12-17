import { supabase } from "../supabaseConfig";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB in bytes
const STORAGE_BUCKET = "quiz-media";

/**
 * Upload a file to Supabase Storage with progress tracking
 * @param {File} file - The file to upload
 * @param {string} filePath - The path where the file should be stored (e.g., "quizzes/{quizId}/questions/{fileName}")
 * @param {Function} onProgress - Optional callback for upload progress (0-100)
 * @param {string} oldFileUrl - Optional URL of old file to delete when replacing
 * @returns {Promise<string>} Public URL of the uploaded file
 */
export async function uploadFile(file, filePath, onProgress = null, oldFileUrl = null) {
  // Validate file size
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File size exceeds the maximum limit of 10MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`);
  }

  // Validate file type
  const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  const validVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
  const isValidType = validImageTypes.includes(file.type) || validVideoTypes.includes(file.type);
  
  if (!isValidType) {
    throw new Error(`Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP) or video (MP4, WebM, OGG, QuickTime).`);
  }

  try {
    // Delete old file if provided
    if (oldFileUrl) {
      try {
        await deleteFileFromUrl(oldFileUrl);
      } catch (deleteError) {
        console.warn("Failed to delete old file:", deleteError);
        // Continue with upload even if deletion fails
      }
    }

    // Upload file to Supabase Storage
    // Note: Supabase doesn't provide native progress tracking, so we'll simulate it
    if (onProgress) {
      onProgress(10); // Start
    }

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (onProgress) {
      onProgress(90);
    }

    if (uploadError) {
      // Handle specific errors
      if (uploadError.message?.includes("already exists")) {
        throw new Error("A file with this name already exists. Please try again.");
      }
      if (uploadError.message?.includes("size")) {
        throw new Error("File is too large. Maximum size is 10MB.");
      }
      throw uploadError;
    }

    if (onProgress) {
      onProgress(100);
    }

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    if (!urlData?.publicUrl) {
      throw new Error("Failed to generate public URL for uploaded file.");
    }

    return urlData.publicUrl;
  } catch (err) {
    console.error("Upload error:", err);
    if (err.message) {
      throw err;
    }
    throw new Error("Failed to upload file. Please try again.");
  }
}

/**
 * Delete a file from Supabase Storage using its URL
 * @param {string} fileUrl - The public URL of the file to delete
 * @returns {Promise<void>}
 */
export async function deleteFileFromUrl(fileUrl) {
  if (!fileUrl) return;

  try {
    // Extract file path from URL
    // Supabase public URLs look like: https://{project}.supabase.co/storage/v1/object/public/{bucket}/{path}
    const urlParts = fileUrl.split("/storage/v1/object/public/");
    if (urlParts.length < 2) {
      console.warn("Invalid Supabase Storage URL format:", fileUrl);
      return;
    }

    const pathWithBucket = urlParts[1];
    const parts = pathWithBucket.split("/");
    const bucket = parts[0];
    const filePath = parts.slice(1).join("/");

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      // Don't throw if file doesn't exist (might have been deleted already)
      if (!error.message?.includes("not found")) {
        throw error;
      }
    }
  } catch (err) {
    console.error("Error deleting file:", err);
    throw err;
  }
}

/**
 * Extract file path from Supabase Storage URL
 * @param {string} fileUrl - The public URL of the file
 * @returns {Object|null} Object with bucket and path, or null if invalid
 */
export function extractFilePathFromUrl(fileUrl) {
  if (!fileUrl) return null;

  try {
    const urlParts = fileUrl.split("/storage/v1/object/public/");
    if (urlParts.length < 2) {
      return null;
    }

    const pathWithBucket = urlParts[1];
    const parts = pathWithBucket.split("/");
    const bucket = parts[0];
    const filePath = parts.slice(1).join("/");

    return { bucket, path: filePath };
  } catch (err) {
    console.error("Error extracting file path from URL:", err);
    return null;
  }
}

/**
 * Validate file before upload
 * @param {File} file - The file to validate
 * @returns {Object} { valid: boolean, error: string|null }
 */
export function validateFile(file) {
  if (!file) {
    return { valid: false, error: "No file selected." };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size exceeds the maximum limit of 10MB. Current size: ${(file.size / 1024 / 1024).toFixed(2)}MB`,
    };
  }

  const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
  const validVideoTypes = ["video/mp4", "video/webm", "video/ogg", "video/quicktime"];
  const isValidType = validImageTypes.includes(file.type) || validVideoTypes.includes(file.type);

  if (!isValidType) {
    return {
      valid: false,
      error: "Invalid file type. Please upload an image (JPEG, PNG, GIF, WebP) or video (MP4, WebM, OGG, QuickTime).",
    };
  }

  return { valid: true, error: null };
}

