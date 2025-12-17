import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "../supabaseConfig";

// Usage:
// const { saving, lastSavedAt, recovered, clearRecovery } = useAutoSave({
//   resultId,
//   state: { currentIndex, timeRemainingSeconds, answers },
//   enabled: true
// });
// - answers should be serializable (array of user's current answers)
// - recovered contains last autosaved progress if available
// Note: resultId replaces ownerId/quizId/attemptId from Firebase version

export default function useAutoSave({ resultId, state, enabled = true }) {
  const [saving, setSaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState(null);
  const [recovered, setRecovered] = useState(null);
  const intervalRef = useRef(null);
  const lastSavedPayloadRef = useRef(null);

  const storageKey = useMemo(() => {
    if (!resultId) return "";
    return `autosave_${resultId}`;
  }, [resultId]);

  const buildPayload = useCallback(() => {
    const safe = state || {};
    return {
      currentQuestionIndex: Number(safe.currentIndex ?? 0),
      timeRemainingSeconds: Number(safe.timeRemainingSeconds ?? 0),
      answers: Array.isArray(safe.answers) ? safe.answers : [],
      updatedAt: Date.now(),
    };
  }, [state]);

  const saveLocal = useCallback((payload) => {
    if (!storageKey) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {}
  }, [storageKey]);

  const saveRemote = useCallback(async (payload) => {
    if (!resultId) return;
    // Store autosave data in results table metadata (using a JSONB field if available, or as a note)
    // For now, we'll store it in a separate autosave table or use results table with a JSONB metadata field
    // Since we don't have an autosave table, we'll use sessionStorage primarily and update results table
    // with current progress info
    try {
      await supabase
        .from("results")
        .update({
          // Store autosave data - we can add a metadata JSONB column later if needed
          // For now, just update the result to keep it active
          updated_at: new Date().toISOString(),
        })
        .eq("id", resultId);
    } catch (err) {
      console.error("Error saving autosave to Supabase:", err);
      // Don't throw - local save is more important
    }
  }, [resultId]);

  const saveNow = useCallback(async () => {
    if (!enabled) return;
    const payload = buildPayload();
    // Skip if identical to last saved to reduce writes
    const last = lastSavedPayloadRef.current;
    const same = last && JSON.stringify(last) === JSON.stringify(payload);
    if (same) return;

    try {
      setSaving(true);
      saveLocal(payload);
      await saveRemote(payload);
      lastSavedPayloadRef.current = payload;
      setLastSavedAt(new Date(payload.updatedAt));
    } catch {
      // Even on failure, local save remains
    } finally {
      setSaving(false);
    }
  }, [enabled, buildPayload, saveLocal, saveRemote]);

  // Interval autosave every 30s
  useEffect(() => {
    if (!enabled) return;
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    intervalRef.current = setInterval(() => {
      saveNow();
    }, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [enabled, saveNow]);

  // Save on unmount/page hide
  useEffect(() => {
    if (!enabled) return;
    const handler = () => {
      try { saveNow(); } catch {}
    };
    window.addEventListener("beforeunload", handler);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") handler();
    });
    return () => {
      window.removeEventListener("beforeunload", handler);
    };
  }, [enabled, saveNow]);

  // Initial recovery from Supabase or localStorage (prefer latest)
  useEffect(() => {
    let cancelled = false;
    const recover = async () => {
      if (!storageKey || !resultId) return;
      let local = null;
      try {
        const raw = localStorage.getItem(storageKey);
        if (raw) local = JSON.parse(raw);
      } catch {}
      
      // For Supabase, we primarily rely on localStorage for autosave
      // In the future, we could add a metadata JSONB column to results table
      // For now, just use localStorage
      const latest = local;
      if (!cancelled && latest) setRecovered(latest);
    };
    recover();
    return () => { cancelled = true; };
  }, [storageKey, resultId]);

  const clearRecovery = useCallback(() => {
    setRecovered(null);
  }, []);

  return { saving, lastSavedAt, recovered, clearRecovery, saveNow };
}

function chooseLatest(a, b) {
  if (a && b) return (a.updatedAt || 0) >= (b.updatedAt || 0) ? a : b;
  return a || b || null;
}


