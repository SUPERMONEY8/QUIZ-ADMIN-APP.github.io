/**
 * Extracts Streamable URL from iframe embed code if user pastes full HTML
 */
export function extractStreamableUrl(input) {
  if (!input || typeof input !== "string") return "";
  
  const trimmed = input.trim();
  
  // If it contains iframe tag, extract the src URL
  if (trimmed.includes("<iframe") && trimmed.includes("src=")) {
    const srcMatch = trimmed.match(/src=["']([^"']+)["']/);
    if (srcMatch && srcMatch[1]) {
      return srcMatch[1];
    }
  }
  
  // If it's already a URL, return as is
  return trimmed;
}

/**
 * Checks if a URL is a Streamable embed link
 */
export function isStreamableLink(url) {
  if (!url || typeof url !== "string") return false;
  return url.includes("streamable.com") || url.includes("streamable.com/e/");
}

/**
 * Validates if a Streamable embed URL is valid
 */
export function isValidStreamableEmbed(url) {
  if (!url || typeof url !== "string") return false;
  const trimmed = url.trim();
  if (!trimmed) return false;
  
  // Extract URL from iframe code if needed
  const extractedUrl = extractStreamableUrl(trimmed);
  
  // Streamable embed URLs typically look like: https://streamable.com/e/xxxxxx or https://streamable.com/xxxxxx
  if (extractedUrl.includes("streamable.com")) {
    // Extract video ID from Streamable URL (may include query parameters)
    const streamableMatch = extractedUrl.match(/streamable\.com\/(?:e\/)?([a-zA-Z0-9]+)/);
    return !!streamableMatch;
  }
  
  return false;
}

/**
 * Converts Streamable URL to embed format if needed
 * Preserves query parameters if present
 */
export function convertStreamableToEmbed(url) {
  if (!url || typeof url !== "string") return "";
  
  const trimmed = url.trim();
  
  // Extract URL from iframe code if user pasted full HTML
  let extractedUrl = extractStreamableUrl(trimmed);
  
  // Remove any trailing slashes
  extractedUrl = extractedUrl.replace(/\/+$/, "");
  
  // If already a proper embed URL with /e/, return as is (preserve query params)
  if (extractedUrl.includes("/e/")) {
    // Ensure it starts with https://
    if (!extractedUrl.startsWith("http")) {
      extractedUrl = "https://" + extractedUrl.replace(/^\/+/, "");
    }
    return extractedUrl;
  }
  
  // Extract video ID and query parameters from Streamable URL
  // Handle both https://streamable.com/VIDEO_ID and streamable.com/VIDEO_ID formats
  const streamableMatch = extractedUrl.match(/(?:https?:\/\/)?(?:www\.)?streamable\.com\/(?:e\/)?([a-zA-Z0-9]+)(\?.*)?/);
  if (streamableMatch) {
    const videoId = streamableMatch[1];
    const queryParams = streamableMatch[2] || ""; // Preserve query parameters
    return `https://streamable.com/e/${videoId}${queryParams}`;
  }
  
  // If it's a valid-looking URL but doesn't match, try to fix it
  if (extractedUrl.includes("streamable.com")) {
    // Try to extract any video ID-like string
    const fallbackMatch = extractedUrl.match(/([a-zA-Z0-9]{6,})/);
    if (fallbackMatch) {
      return `https://streamable.com/e/${fallbackMatch[1]}`;
    }
  }
  
  return extractedUrl;
}
