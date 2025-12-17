import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, FileText, Edit, Globe, Copy, Eye, Trash2, Pencil, Check, X, Archive, ArchiveRestore, Link2, ExternalLink } from "lucide-react";
import { quizOperations } from "../utils/databaseConfig";
import useAuth from "../hooks/useAuth";
import DeleteConfirmModal from "./DeleteConfirmModal.jsx";
import { duplicateQuiz } from "../utils/quizActions.js";
import { t } from "../store/translations";
import { getCurrentUserId } from "../utils/userManager.js";

export default function QuizList() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showArchived, setShowArchived] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, quiz: null });
  const [linkModal, setLinkModal] = useState({ isOpen: false, quiz: null, copied: false });

  const isMountedRef = useRef(true);
  const isInitialLoadRef = useRef(true);
  
  useEffect(() => {
    isMountedRef.current = true;
    isInitialLoadRef.current = true;
    
    const fetchQuizzes = async (isInitial = false) => {
      try {
        if (!isMountedRef.current) return;
        
        // Only show loading on initial load, not on refreshes
        if (isInitial) {
          setLoading(true);
        }
        setError("");
        
        // Fetch quizzes - getByAdmin will handle admin ID internally
        const items = await quizOperations.getByAdmin();
        
        if (!isMountedRef.current) return;
        
        // Update quizzes without flashing - use functional update to preserve existing items
        setQuizzes((prevQuizzes) => {
          // If data is the same, return previous to avoid re-render
          if (prevQuizzes.length === items.length && 
              prevQuizzes.every((q, i) => q.id === items[i]?.id)) {
            return prevQuizzes;
          }
          return items || [];
        });
        
        if (isInitial) {
          setLoading(false);
        }
        isInitialLoadRef.current = false;
      } catch (err) {
        if (!isMountedRef.current) return;
        console.error("QuizList error:", err);
        const errorMsg = err.message || "Failed to load quizzes";
        
        // Handle HTML response errors (API not found)
        if (errorMsg.includes("not valid JSON") || errorMsg.includes("<!doctype") || errorMsg.includes("API endpoint not found")) {
          console.warn("API endpoint not available, showing empty list");
          setError(""); // Don't show error for missing API
          setQuizzes([]);
          if (isInitial) {
            setLoading(false);
          }
          return;
        }
        
        // Only show error if it's not a network error (which might be temporary)
        if (!errorMsg.includes("Failed to fetch") && !errorMsg.includes("network") && !errorMsg.includes("NetworkError")) {
          setError(errorMsg);
        } else {
          setError(""); // Clear error for network issues
        }
        if (isInitial) {
          setLoading(false);
        }
        // Don't clear quizzes on refresh errors, keep existing data
        if (isInitial && !errorMsg.includes("Failed to fetch") && !errorMsg.includes("network")) {
          setQuizzes([]);
        }
      }
    };
    
    // Initial load
    fetchQuizzes(true);
    
    // Refresh every 10 seconds (increased from 5 to reduce flashing)
    const interval = setInterval(() => {
      if (isMountedRef.current && !isInitialLoadRef.current) {
        fetchQuizzes(false);
      }
    }, 10000);
    
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [user]);

  const handleTogglePublish = useCallback(async (quiz) => {
    if (!user?.id && !user?.uid) return;
    const next = quiz.status === "published" ? "draft" : "published";
    const updateData = { status: next };
    
    if (next === "published") {
      updateData.published_at = new Date().toISOString();
    }
    
    // Optimistic UI update - update immediately for instant feedback
    const previousStatus = quiz.status;
    const previousPublishedAt = quiz.publishedAt;
    
    setQuizzes((prev) =>
      prev.map((q) =>
        q.id === quiz.id
          ? {
              ...q,
              status: next,
              publishedAt: next === "published" 
                ? { seconds: Math.floor(new Date().getTime() / 1000) }
                : null,
            }
          : q
      )
    );
    
    // Then sync with database in background
    try {
      await quizOperations.update(quiz.id, updateData);
    } catch (error) {
      // Revert on error
      console.error("Failed to toggle publish:", error);
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === quiz.id
            ? {
                ...q,
                status: previousStatus,
                publishedAt: previousPublishedAt,
              }
            : q
        )
      );
      alert(t("error.updateFailed") + ". " + t("error.tryAgain"));
    }
  }, [user]);

  const handleArchive = useCallback(async (quiz) => {
    if (!user?.id && !user?.uid) return;
    try {
      await quizOperations.update(quiz.id, { archived: true });
      // Update local state
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === quiz.id ? { ...q, archived: true } : q
        )
      );
    } catch (err) {
      console.error("Failed to archive quiz:", err);
      alert(t("error.updateFailed") + ". " + t("error.tryAgain"));
    }
  }, [user]);

  const handleRestore = useCallback(async (quiz) => {
    if (!user?.id && !user?.uid) return;
    try {
      await quizOperations.update(quiz.id, { archived: false });
      // Update local state
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === quiz.id ? { ...q, archived: false } : q
        )
      );
    } catch (err) {
      console.error("Failed to restore quiz:", err);
      alert(t("error.updateFailed") + ". " + t("error.tryAgain"));
    }
  }, [user]);

  const handleDeleteClick = useCallback((quiz, e) => {
    e?.stopPropagation();
    setDeleteModal({ isOpen: true, quiz });
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if ((!user?.id && !user?.uid) || !deleteModal.quiz) return;
    try {
      await quizOperations.delete(deleteModal.quiz.id);
      setDeleteModal({ isOpen: false, quiz: null });
      // Refresh quizzes list
      const adminId = user?.id || user?.uid || 'admin-access-direct';
      const items = await quizOperations.getByAdmin(adminId);
      setQuizzes(items);
    } catch (err) {
      console.error("Failed to delete quiz:", err);
      alert(t("error.deleteFailed") + ". " + t("error.tryAgain"));
    }
  }, [user, deleteModal.quiz]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModal({ isOpen: false, quiz: null });
  }, []);

  const generateShareLink = useCallback((quiz) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    // Direct link to start quiz
    return `${origin}/quiz/${quiz.id}/start`;
  }, []);

  const handleShowLink = useCallback((quiz, e) => {
    e?.stopPropagation();
    setLinkModal({ isOpen: true, quiz, copied: false });
  }, []);

  const handleCopyLink = useCallback(async () => {
    if (!linkModal.quiz) return;
    const link = generateShareLink(linkModal.quiz);
    try {
      await navigator.clipboard.writeText(link);
      setLinkModal((prev) => ({ ...prev, copied: true }));
      setTimeout(() => {
        setLinkModal((prev) => ({ ...prev, copied: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }, [linkModal.quiz, generateShareLink]);

  const handleCloseLinkModal = useCallback(() => {
    setLinkModal({ isOpen: false, quiz: null, copied: false });
  }, []);

  const handleCopyCode = useCallback(async () => {
    if (!linkModal.quiz?.shareCode) return;
    try {
      await navigator.clipboard.writeText(linkModal.quiz.shareCode);
      setLinkModal((prev) => ({ ...prev, copied: true }));
      setTimeout(() => {
        setLinkModal((prev) => ({ ...prev, copied: false }));
      }, 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  }, [linkModal.quiz]);

  const handleGenerateCode = useCallback(async () => {
    if (!linkModal.quiz || (!user?.id && !user?.uid)) return;
    
    // Generate a code
    const code = Math.random().toString(36).slice(2, 8).toUpperCase();
    
    try {
      await quizOperations.update(linkModal.quiz.id, { share_code: code });
      
      // Update local state
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === linkModal.quiz.id ? { ...q, shareCode: code, share_code: code } : q
        )
      );
      
      // Update modal
      setLinkModal((prev) => ({
        ...prev,
        quiz: { ...prev.quiz, shareCode: code, share_code: code }
      }));
    } catch (err) {
      console.error("Failed to generate code:", err);
      alert(t("error.updateFailed") + ". " + t("error.tryAgain"));
    }
  }, [linkModal.quiz, user]);

  const handleDuplicate = useCallback(async (quiz) => {
    if (!user?.id && !user?.uid) return;
    try {
      const adminId = user?.id || user?.uid;
      const newQuizId = await duplicateQuiz(quiz.id, adminId);
      console.log("Quiz duplicated successfully:", newQuizId);
      // Refresh quizzes list to show the new duplicate
      const items = await quizOperations.getByAdmin(adminId);
      setQuizzes(items);
    } catch (err) {
      console.error("Failed to duplicate quiz:", err);
      alert(t("error.updateFailed") + ". " + t("error.tryAgain"));
    }
  }, [user]);

  const handleCreate = useCallback(() => {
    // Navigate immediately without any delay
    navigate("/admin/new-quiz", { replace: false });
  }, [navigate]);

  const handleEdit = useCallback((quiz) => {
    navigate(`/admin/quizzes/${quiz.id}/questions`);
  }, [navigate]);

  const [editingDescription, setEditingDescription] = useState(null);
  const [descriptionValue, setDescriptionValue] = useState("");
  const [editingName, setEditingName] = useState(null);
  const [nameValue, setNameValue] = useState("");

  const handleStartEditName = useCallback((quiz, e) => {
    e.stopPropagation();
    setEditingName(quiz.id);
    setNameValue(quiz.name || "");
  }, []);

  const handleCancelEditName = useCallback((e) => {
    e?.stopPropagation();
    setEditingName(null);
    setNameValue("");
  }, []);

  const handleSaveName = useCallback(async (quiz, e) => {
    e?.stopPropagation();
    if (!user?.id && !user?.uid) return;
    
    if (!nameValue.trim()) {
      alert(t("error.updateFailed"));
      return;
    }
    
    try {
      await quizOperations.update(quiz.id, { title: nameValue.trim() });
      // Update local state
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === quiz.id ? { ...q, name: nameValue.trim(), title: nameValue.trim() } : q
        )
      );
      setEditingName(null);
      setNameValue("");
    } catch (err) {
      console.error("Failed to update name:", err);
      alert(t("error.updateFailed") + ". " + t("error.tryAgain"));
    }
  }, [user, nameValue]);

  const handleStartEditDescription = useCallback((quiz, e) => {
    e.stopPropagation();
    setEditingDescription(quiz.id);
    setDescriptionValue(quiz.description || "");
  }, []);

  const handleCancelEditDescription = useCallback((e) => {
    e?.stopPropagation();
    setEditingDescription(null);
    setDescriptionValue("");
  }, []);

  const handleSaveDescription = useCallback(async (quiz, e) => {
    e?.stopPropagation();
    if (!user?.id && !user?.uid) return;
    
    try {
      await quizOperations.update(quiz.id, { description: descriptionValue.trim() });
      // Update local state
      setQuizzes((prev) =>
        prev.map((q) =>
          q.id === quiz.id ? { ...q, description: descriptionValue.trim() } : q
        )
      );
      setEditingDescription(null);
      setDescriptionValue("");
    } catch (err) {
      console.error("Failed to update description:", err);
      alert(t("error.updateFailed") + ". " + t("error.tryAgain"));
    }
  }, [user, descriptionValue]);

  // Filter quizzes based on archived status
  const filteredQuizzes = useMemo(() => {
    if (showArchived) {
      return quizzes.filter((q) => q.archived === true);
    }
    return quizzes.filter((q) => !q.archived);
  }, [quizzes, showArchived]);

  const archivedCount = useMemo(() => {
    return quizzes.filter((q) => q.archived === true).length;
  }, [quizzes]);

  const shareLink = useMemo(() => {
    if (!linkModal.quiz) return "";
    return generateShareLink(linkModal.quiz);
  }, [linkModal.quiz, generateShareLink]);

  // Show loading if user is not available yet
  if (!user) {
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <div className="animate-spin h-6 w-6 border-2 border-medical-600 border-t-transparent rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">{t("common.loading")}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title={t("modal.deleteQuiz")}
        message={`${t("modal.deleteConfirm")} "${deleteModal.quiz?.name || t("quiz.untitled")}"? ${t("modal.deleteWarning")}`}
      />
      
      {/* Share Link Modal */}
      {linkModal.isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in"
          onClick={handleCloseLinkModal}
        >
          <div
            className="medical-card p-6 max-w-lg w-full mx-4 animate-slide-up relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCloseLinkModal}
              className="absolute top-4 right-4 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-start gap-4 pr-8">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center">
                  <Link2 className="h-6 w-6 text-medical-600 dark:text-medical-400" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  {t("quiz.quizLink")}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  {t("quiz.shareLink")}: <span className="font-semibold">{linkModal.quiz?.name || t("quiz.untitled")}</span>
                </p>
                
                <div className="bg-teal-50 dark:bg-teal-900/20 rounded-lg p-4 mb-4 border border-teal-200 dark:border-teal-800">
                  <code className="text-sm font-mono text-teal-700 dark:text-teal-300 break-all">
                    {shareLink}
                  </code>
                </div>
                
                <div className="flex gap-3 mb-4">
                  <button
                    onClick={handleCopyLink}
                    className="flex-1 medical-button inline-flex items-center justify-center gap-2"
                  >
                    {linkModal.copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        {t("quiz.linkCopied")}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        {t("quiz.copyLink")}
                      </>
                    )}
                  </button>
                </div>
                
                {linkModal.quiz?.shareCode && (
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">{t("quiz.quizCode")}:</div>
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 font-mono">
                      {linkModal.quiz.shareCode}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <FileText className="h-6 w-6 text-medical-600 dark:text-medical-400" />
          {t("quiz.myQuizzes")}
        </h2>
        <div className="flex items-center gap-3">
          {archivedCount > 0 && (
            <button
              type="button"
              onClick={() => setShowArchived(!showArchived)}
              className={`medical-button-secondary inline-flex items-center gap-2 ${
                showArchived ? "bg-medical-100 dark:bg-medical-900/50 text-medical-700 dark:text-medical-400" : ""
              }`}
            >
              <Archive className="h-4 w-4" />
              {showArchived ? t("quiz.restore") : `${t("quiz.archived")} (${archivedCount})`}
            </button>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleCreate();
            }}
            className="medical-button inline-flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            {t("quiz.createNew")}
          </button>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg bg-red-50 dark:bg-red-900/20 p-3 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800 animate-fade-in">
          {typeof error === "string" ? error : error}
        </div>
      ) : null}

      {loading ? (
        <div className="mt-6 text-gray-600 dark:text-gray-400 flex items-center gap-2">
          <div className="animate-spin h-4 w-4 border-2 border-medical-600 border-t-transparent rounded-full"></div>
          {t("common.loading")}
        </div>
          ) : filteredQuizzes.length === 0 ? (
            <div className="mt-6 medical-card p-8 text-center">
              <FileText className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                {showArchived 
                  ? t("quiz.noArchived")
                  : t("quiz.noQuizzes")}
              </p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredQuizzes.map((quiz, idx) => (
            <div
              key={quiz.id}
              className={`medical-card p-5 group animate-slide-up transition-transform duration-200 hover:scale-105 ${
                quiz.archived ? "cursor-default opacity-75" : "cursor-pointer"
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
              onClick={() => !quiz.archived && handleEdit(quiz)}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1">
                  {editingName === quiz.id ? (
                    <div className="flex items-center gap-2 mb-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={nameValue}
                        onChange={(e) => setNameValue(e.target.value)}
                        className="flex-1 medical-input text-sm font-semibold py-1.5 px-2"
                        placeholder={t("quiz.enterName")}
                        autoFocus
                        maxLength={100}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveName(quiz, e);
                          } else if (e.key === "Escape") {
                            handleCancelEditName(e);
                          }
                        }}
                      />
                      <button
                        onClick={(e) => handleSaveName(quiz, e)}
                        className="p-1.5 rounded-md text-white transition-colors"
                        style={{ backgroundColor: "#0d9488" }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = "#0f766e"}
                        onMouseLeave={(e) => e.target.style.backgroundColor = "#0d9488"}
                        title="Save"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={handleCancelEditName}
                        className="p-1.5 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                        title="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="font-semibold text-gray-900 dark:text-white group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors flex items-center gap-2 group/name cursor-text"
                      onClick={(e) => handleStartEditName(quiz, e)}
                    >
                      <span className="flex-1">{quiz.name || t("quiz.untitled")}</span>
                      <button
                        onClick={(e) => handleStartEditName(quiz, e)}
                        className="opacity-0 group-hover/name:opacity-100 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                        title={t("quiz.editName")}
                      >
                        <Pencil className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  )}
                  {editingDescription === quiz.id ? (
                    <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="text"
                        value={descriptionValue}
                        onChange={(e) => setDescriptionValue(e.target.value)}
                        className="flex-1 medical-input text-sm py-1.5 px-2"
                        placeholder={t("quiz.enterDescription")}
                        autoFocus
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSaveDescription(quiz, e);
                          } else if (e.key === "Escape") {
                            handleCancelEditDescription(e);
                          }
                        }}
                      />
                          <button
                            onClick={(e) => handleSaveDescription(quiz, e)}
                            className="p-1.5 rounded-md text-white transition-colors"
                            style={{ backgroundColor: "#0d9488" }}
                            onMouseEnter={(e) => e.target.style.backgroundColor = "#0f766e"}
                            onMouseLeave={(e) => e.target.style.backgroundColor = "#0d9488"}
                            title="Save"
                          >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={handleCancelEditDescription}
                        className="p-1.5 rounded-md bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                        title="Cancel"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div 
                      className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2 flex items-center gap-2 group/desc"
                      onClick={(e) => handleStartEditDescription(quiz, e)}
                    >
                      <span className="flex-1 cursor-text hover:text-medical-600 dark:hover:text-medical-400 transition-colors">
                        {quiz.description || t("quiz.noDescription")}
                      </span>
                      <button
                        onClick={(e) => handleStartEditDescription(quiz, e)}
                        className="opacity-0 group-hover/desc:opacity-100 p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                        title={t("quiz.editDescription")}
                      >
                        <Pencil className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                      </button>
                    </div>
                  )}
                </div>
                <span className={`shrink-0 inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium transition-colors ${
                  quiz.archived
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400"
                    : quiz.status === "published" 
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400" 
                    : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}>
                  {quiz.archived ? t("quiz.archived") : quiz.status === "published" ? t("quiz.published") : t("quiz.draft")}
                </span>
              </div>
              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 mb-4">
                {quiz.createdAt?.seconds ? new Date(quiz.createdAt.seconds * 1000).toLocaleString() : "—"}
              </div>

              <div className="mt-4 flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
                {quiz.archived ? (
                  <button
                    onClick={() => handleRestore(quiz)}
                    className="medical-button-secondary inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs"
                  >
                    <ArchiveRestore className="h-3 w-3" />
                    {t("quiz.restore")}
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(quiz)}
                      className="medical-button-secondary inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs"
                    >
                      <Edit className="h-3 w-3" />
                      {t("common.edit")}
                    </button>
                    <button
                      onClick={() => handleTogglePublish(quiz)}
                      className="medical-button-secondary inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs"
                    >
                      <Globe className="h-3 w-3" />
                      {quiz.status === "published" ? t("quiz.unpublish") : t("quiz.publish")}
                    </button>
                    <button
                      onClick={() => handleDuplicate(quiz)}
                      className="medical-button-secondary inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs"
                    >
                      <Copy className="h-3 w-3" />
                      {t("quiz.duplicate")}
                    </button>
                    <button
                      onClick={() => navigate(`/admin/results/${quiz.id}`)}
                      className="medical-button-secondary inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs"
                    >
                      <Eye className="h-3 w-3" />
                      {t("quiz.results")}
                    </button>
                    <button
                      onClick={(e) => handleShowLink(quiz, e)}
                      className="medical-button-secondary inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs"
                      title={t("quiz.getLink")}
                    >
                      <Link2 className="h-3 w-3" />
                      {t("quiz.getLink")}
                    </button>
                  </>
                )}
                {!quiz.archived && (
                  <button
                    onClick={() => handleArchive(quiz)}
                    className="medical-button-secondary inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs"
                  >
                    <Archive className="h-3 w-3" />
                    {t("quiz.archive")}
                  </button>
                )}
                <button
                  onClick={(e) => handleDeleteClick(quiz, e)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 px-2.5 py-1.5 text-xs font-medium text-red-700 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-200 hover:scale-105"
                >
                  <Trash2 className="h-3 w-3" />
                  {t("common.delete")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


