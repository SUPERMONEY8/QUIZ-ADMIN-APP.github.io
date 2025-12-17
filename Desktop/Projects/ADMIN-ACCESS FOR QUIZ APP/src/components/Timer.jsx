import { useEffect, useMemo, useRef, useState } from "react";

// Props:
// - durationMinutes: number (required)
// - onComplete?: () => void
// - autoStart?: boolean (default: true)
// - showControls?: boolean (default: true)
// - className?: string
export default function Timer({ durationMinutes, onComplete, autoStart = true, showControls = true, className = "" }) {
  const total = Math.max(0, Math.floor((Number(durationMinutes) || 0) * 60));
  const [remaining, setRemaining] = useState(total);
  const [isPaused, setIsPaused] = useState(!autoStart);
  const didCompleteRef = useRef(false);

  useEffect(() => {
    // Reset if duration changes
    setRemaining(total);
    setIsPaused(!autoStart);
    didCompleteRef.current = false;
  }, [total, autoStart]);

  useEffect(() => {
    if (isPaused || remaining <= 0) return;
    const id = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1;
        return next < 0 ? 0 : next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [isPaused, remaining]);

  useEffect(() => {
    if (remaining === 0 && !didCompleteRef.current) {
      didCompleteRef.current = true;
      if (onComplete) onComplete();
    }
  }, [remaining, onComplete]);

  const minutes = useMemo(() => Math.floor(remaining / 60), [remaining]);
  const seconds = useMemo(() => remaining % 60, [remaining]);

  const timeText = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  const isLow = remaining <= 5 * 60;

  const toggle = () => setIsPaused((p) => !p);
  const reset = () => {
    setRemaining(total);
    setIsPaused(!autoStart);
    didCompleteRef.current = false;
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`text-2xl font-semibold tabular-nums ${isLow ? "text-red-600" : "text-gray-900"}`}>{timeText}</div>
      {showControls ? (
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Reset
          </button>
        </div>
      ) : null}
    </div>
  );
}


