import { useEffect, useState, useRef } from "react";
import { convertStreamableToEmbed } from "../utils/videoHelpers";

/**
 * VideoPlayer component that displays Streamable videos via iframe embed
 */
export default function VideoPlayer({ streamableEmbedUrl, className = "" }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [embedUrl, setEmbedUrl] = useState("");
  const [showDirectLink, setShowDirectLink] = useState(false);
  const iframeRef = useRef(null);
  const loadTimeoutRef = useRef(null);

  useEffect(() => {
    const streamableUrl = streamableEmbedUrl?.trim() || "";
    
    if (!streamableUrl) {
      setLoading(false);
      return;
    }

    const loadVideo = async () => {
      setLoading(true);
      setError("");
      setShowDirectLink(false);
      
      try {
        // Convert Streamable URL to proper embed format
        let embedUrlOption = convertStreamableToEmbed(streamableUrl);
        
        console.log("Original URL:", streamableUrl);
        console.log("Converted URL:", embedUrlOption);
        
        // Ensure we have the /e/ format for Streamable
        if (!embedUrlOption.includes("/e/")) {
          // Extract video ID from URL (preserve query parameters)
          const match = embedUrlOption.match(/streamable\.com\/(?:e\/)?([a-zA-Z0-9]+)(\?.*)?/);
          if (match) {
            const videoId = match[1];
            const queryParams = match[2] || ""; // Preserve query parameters
            embedUrlOption = `https://streamable.com/e/${videoId}${queryParams}`;
          } else {
            throw new Error("Invalid Streamable URL format");
          }
        }
        
        // For Streamable, the embed URL should be: https://streamable.com/e/VIDEO_ID
        // Preserve query parameters (autoplay, muted, nocontrols, etc.) as they're useful
        // Ensure it starts with https://
        if (!embedUrlOption.startsWith("http")) {
          embedUrlOption = "https://" + embedUrlOption.replace(/^\/+/, "");
        }
        
        // Validate the URL format (with or without query parameters)
        const urlWithoutParams = embedUrlOption.split('?')[0];
        if (!urlWithoutParams.match(/^https:\/\/streamable\.com\/e\/[a-zA-Z0-9]+$/)) {
          throw new Error("Invalid Streamable embed URL format");
        }
        
        console.log("Final embed URL:", embedUrlOption);
        setEmbedUrl(embedUrlOption);
      } catch (err) {
        console.error("Error processing Streamable URL:", err);
        setError("Failed to process video URL. Please check the Streamable embed URL.");
        // Try to use the original URL as fallback (preserve query parameters)
        const fallbackUrl = streamableUrl.includes("/e/") 
          ? streamableUrl 
          : streamableUrl;
        if (fallbackUrl.match(/streamable\.com/)) {
          setEmbedUrl(fallbackUrl);
        } else {
          setLoading(false);
        }
      }
    };

    loadVideo();
  }, [streamableEmbedUrl]);

  // Timeout handler - if video doesn't load in 8 seconds, show error and direct link
  useEffect(() => {
    if (!embedUrl || !loading) return;
    
    // Clear any existing timeout
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    
    loadTimeoutRef.current = setTimeout(() => {
      if (loading) {
        console.warn("Video loading timeout");
        setError("Video is taking too long to load. The video may be private or there may be a connection issue.");
        setShowDirectLink(true);
        setLoading(false);
      }
    }, 8000);

    return () => {
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
    };
  }, [embedUrl, loading]);

  // Handle iframe load
  const handleIframeLoad = () => {
    console.log("Iframe loaded successfully");
    if (loadTimeoutRef.current) {
      clearTimeout(loadTimeoutRef.current);
    }
    setLoading(false);
    setError("");
  };

  // Extract direct video URL for fallback
  const getDirectVideoUrl = () => {
    if (!embedUrl) return "";
    const match = embedUrl.match(/streamable\.com\/e\/([a-zA-Z0-9]+)/);
    if (match) {
      return `https://streamable.com/${match[1]}`;
    }
    return embedUrl.replace("/e/", "/");
  };

  const streamableUrl = streamableEmbedUrl?.trim() || "";
  
  if (!streamableUrl) {
    return null;
  }

  if (error && !embedUrl) {
    return (
      <div className={`bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 ${className}`}>
        <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        <p className="text-xs text-red-600 dark:text-red-500 mt-2">
          💡 Tip: Make sure you're using a valid Streamable embed URL (e.g., https://streamable.com/e/xxxxxx)
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="w-full max-w-4xl mx-auto">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg z-10">
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Loading video...</p>
            </div>
          </div>
        )}
        <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-lg bg-gray-100 dark:bg-gray-800">
          {embedUrl && (
            <iframe
              ref={iframeRef}
              key={embedUrl}
              src={embedUrl}
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ border: "none" }}
              title="Question video"
              frameBorder="0"
              scrolling="no"
              loading="lazy"
              onLoad={handleIframeLoad}
              onError={(e) => {
                console.error("Iframe load error:", e);
                setError("Failed to load video. The video may be private or unavailable.");
                setShowDirectLink(true);
                setLoading(false);
              }}
            />
          )}
        </div>
        <div className="mt-2 text-xs text-center text-gray-500 dark:text-gray-400">
          📹 Streamable video - Click play to start. Note: Looping may require manual replay.
        </div>
        {error && (
          <div className="mt-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3">
            <p className="text-xs text-yellow-700 dark:text-yellow-400">
              ⚠️ {error}
            </p>
            <p className="text-xs text-yellow-600 dark:text-yellow-500 mt-1">
              Make sure the video is set to "Public" in Streamable settings.
            </p>
            {showDirectLink && (
              <a
                href={getDirectVideoUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                🔗 Open video in new tab
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
