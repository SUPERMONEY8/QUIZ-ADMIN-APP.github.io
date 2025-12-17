import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseConfig";
import useAuth from "../hooks/useAuth";
import ExportModal from "./ExportModal.jsx";
import { exportResultsToPDF } from "../utils/exportPDFAdvanced.js";
import { exportResultsToExcel } from "../utils/exportExcel.js";

export default function ResultsManagement() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]); // {id, name}
  const [results, setResults] = useState([]); // flattened list
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Filters
  const [selectedQuiz, setSelectedQuiz] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // all | completed | pending
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Sorting
  const [sortKey, setSortKey] = useState("date");
  const [sortDir, setSortDir] = useState("desc"); // asc|desc

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;
  
  // Export modal
  const [exportModalOpen, setExportModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?.id && !user?.uid) return;
      setLoading(true);
      setError("");
      try {
        const adminId = user?.id || user?.uid;
        
        // Load quizzes for this admin
        const { data: quizzesData, error: quizzesError } = await supabase
          .from("quizzes")
          .select("id, title")
          .eq("admin_id", adminId)
          .order("created_at", { ascending: false });

        if (quizzesError) {
          throw quizzesError;
        }

        const quizzesList = (quizzesData || []).map((q) => ({
          id: q.id,
          name: q.title || "Untitled",
        }));
        setQuizzes(quizzesList);

        // Load all results for admin's quizzes with joins
        const quizIds = quizzesList.map((q) => q.id);
        if (quizIds.length === 0) {
          setResults([]);
          setLoading(false);
          return;
        }

        // Fetch results with quiz information
        const { data: resultsData, error: resultsError } = await supabase
          .from("results")
          .select(`
            *,
            quizzes!inner(id, title, admin_id)
          `)
          .in("quiz_id", quizIds)
          .order("completed_at", { ascending: false });

        if (resultsError) {
          throw resultsError;
        }

        // Fetch question_attempts for all results to calculate detailed stats
        const resultIds = (resultsData || []).map((r) => r.id);
        
        let questionAttemptsData = [];
        if (resultIds.length > 0) {
          const { data: attemptsData, error: attemptsError } = await supabase
            .from("question_attempts")
            .select("*")
            .in("result_id", resultIds);

          if (!attemptsError) {
            questionAttemptsData = attemptsData || [];
          }
        }

        // Transform results with detailed answer data
        const transformedResults = (resultsData || []).map((result) => {
          const quiz = result.quizzes;
          const quizName = quiz?.title || "Untitled";
          
          // Get question attempts for this result
          const resultAttempts = questionAttemptsData.filter((a) => a.result_id === result.id);
          
          // Calculate stats from question_attempts
          const totalAttempts = resultAttempts.length;
          const correctAttempts = resultAttempts.filter((a) => a.is_correct === true).length;
          const shortAnswerQuestions = resultAttempts.filter((a) => {
            // Check if this is a short answer by looking at the question
            // For now, we'll use a heuristic: if user_answer is long text, it's likely short answer
            return a.user_answer && a.user_answer.length > 50;
          }).length;
          
          const score = Number(result.total_score) || 0;
          const total = Number(result.max_score) || 0;
          const percent = total > 0 ? Math.round((score / total) * 100) : 0;
          
          // Calculate correct/incorrect/pending
          // Correct = questions answered correctly
          // Incorrect = questions answered incorrectly (not short answer)
          // Pending = short answer questions (need manual review)
          const correct = correctAttempts;
          const pending = shortAnswerQuestions; // Simplified - in reality, check question type
          const incorrect = totalAttempts - correctAttempts - pending;

          // Get question details from raw result or transform from question_attempts
          let questionDetails = [];
          if (result.question_details && Array.isArray(result.question_details)) {
            questionDetails = result.question_details;
          } else if (resultAttempts.length > 0) {
            // Transform question_attempts to questionDetails format
            questionDetails = resultAttempts.map(attempt => ({
              question_id: attempt.question_id,
              question_text: attempt.question_text || 'N/A',
              question_type: attempt.question_type || 'N/A',
              user_answer: attempt.user_answer || '',
              correct_answer: attempt.correct_answer || 'N/A',
              attempts: attempt.attempt_number || 1,
              correct_attempt: attempt.is_correct ? (attempt.attempt_number || 1) : null,
              is_correct: attempt.is_correct || false,
              time_spent_seconds: attempt.time_spent_seconds || 0,
            }));
          }

          return {
            id: result.id,
            quizId: result.quiz_id,
            quizName: quizName,
            participantName: result.participant_name || "",
            score,
            total,
            percent,
            correct,
            incorrect,
            pending,
            timeSpent: result.time_spent_seconds || 0,
            timestamp: result.completed_at ? new Date(result.completed_at) : null,
            completedAt: result.completed_at,
            questionDetails: questionDetails, // Include question details for export
            raw: result,
          };
        });

        setResults(transformedResults);
      } catch (e) {
        console.error("Error loading results:", e);
        setError(e?.message || "Failed to load results");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  // Participant name filter
  const [participantFilter, setParticipantFilter] = useState("");

  const filtered = useMemo(() => {
    const start = startDate ? new Date(startDate + "T00:00:00") : null;
    const end = endDate ? new Date(endDate + "T23:59:59") : null;
    return results.filter((r) => {
      if (selectedQuiz !== "all" && r.quizId !== selectedQuiz) return false;
      if (statusFilter !== "all") {
        const hasPending = r.pending > 0;
        if (statusFilter === "pending" && !hasPending) return false;
        if (statusFilter === "completed" && hasPending) return false;
      }
      if (participantFilter.trim()) {
        const searchTerm = participantFilter.toLowerCase().trim();
        if (!r.participantName.toLowerCase().includes(searchTerm)) return false;
      }
      if (start || end) {
        const ts = r.timestamp || (r.completedAt ? new Date(r.completedAt) : null);
        if (!ts) return false;
        if (start && ts < start) return false;
        if (end && ts > end) return false;
      }
      return true;
    });
  }, [results, selectedQuiz, statusFilter, startDate, endDate, participantFilter]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    copy.sort((a, b) => compareRows(a, b, sortKey, sortDir));
    return copy;
  }, [filtered, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const pageData = useMemo(() => {
    const p = Math.min(Math.max(1, page), totalPages);
    const start = (p - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, page, totalPages]);

  const setSort = (key) => {
    if (sortKey === key) setSortDir(sortDir === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("asc"); }
  };

  const formatDate = (ts) => {
    if (!ts) return "—";
    const d = ts instanceof Date ? ts : new Date(ts);
    if (isNaN(d.getTime())) return "—";
    return d.toLocaleString();
  };

  const formatTime = (s) => {
    const sec = Number(s) || 0;
    const mm = String(Math.floor(sec / 60)).padStart(2, "0");
    const ss = String(sec % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleExportPDF = (filters) => {
    // Apply filters to get the data to export
    let dataToExport = sorted;
    if (filters.scope === "quiz" && filters.quizId) {
      dataToExport = dataToExport.filter(r => r.quizId === filters.quizId);
    }
    if (filters.scope === "participant" && filters.participantName) {
      dataToExport = dataToExport.filter(r => 
        r.participantName?.toLowerCase().includes(filters.participantName.toLowerCase())
      );
    }
    if (filters.dateRange === "custom") {
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate + "T23:59:59") : null;
      dataToExport = dataToExport.filter(r => {
        const ts = r.timestamp?.toDate ? r.timestamp.toDate() : null;
        if (!ts) return false;
        if (start && ts < start) return false;
        if (end && ts > end) return false;
        return true;
      });
    }
    
    exportResultsToPDF(dataToExport, filters);
  };

  const handleExportExcel = async (filters) => {
    // Apply filters to get the data to export
    let dataToExport = sorted;
    if (filters.scope === "quiz" && filters.quizId) {
      dataToExport = dataToExport.filter(r => r.quizId === filters.quizId);
    }
    if (filters.scope === "participant" && filters.participantName) {
      dataToExport = dataToExport.filter(r => 
        r.participantName?.toLowerCase().includes(filters.participantName.toLowerCase())
      );
    }
    if (filters.dateRange === "custom") {
      const start = filters.startDate ? new Date(filters.startDate) : null;
      const end = filters.endDate ? new Date(filters.endDate + "T23:59:59") : null;
      dataToExport = dataToExport.filter(r => {
        const ts = r.timestamp?.toDate ? r.timestamp.toDate() : null;
        if (!ts) return false;
        if (start && ts < start) return false;
        if (end && ts > end) return false;
        return true;
      });
    }
    
    // Ensure questionDetails are included in export data
    const dataWithDetails = dataToExport.map(r => ({
      ...r,
      questionDetails: r.questionDetails || [],
    }));
    
    // Get quiz name for filename if exporting a single quiz
    if (filters.scope === "quiz" && filters.quizId) {
      const quiz = quizzes.find(q => q.id === filters.quizId);
      if (quiz) {
        filters.quizName = quiz.name;
      }
    }
    
    await exportResultsToExcel(dataWithDetails, filters);
  };

  const viewDetails = (r) => {
    if (r.attemptId) {
      navigate(`/results/${r.quizId}?attempt=${r.attemptId}`);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white shadow-md rounded-lg p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Results Management</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setExportModalOpen(true)} 
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Export PDF
          </button>
          <button 
            onClick={() => {
              // Use same filters as current view
              const filters = {
                scope: selectedQuiz !== "all" ? "quiz" : "all",
                quizId: selectedQuiz !== "all" ? selectedQuiz : "",
                participantName: participantFilter || "",
                dateRange: (startDate || endDate) ? "custom" : "all",
                startDate: startDate || "",
                endDate: endDate || "",
              };
              handleExportExcel(filters);
            }} 
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Export Excel
          </button>
        </div>
      </div>

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExportPDF}
        exportType="results"
        quizzes={quizzes}
      />

      {error ? (
        <div className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700 border border-red-200">{error}</div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-5 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Quiz</label>
          <select value={selectedQuiz} onChange={(e) => { setSelectedQuiz(e.target.value); setPage(1); }} className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="all">All</option>
            {quizzes.map((q) => (
              <option key={q.id} value={q.id}>{q.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Participant</label>
          <input 
            type="text" 
            value={participantFilter} 
            onChange={(e) => { setParticipantFilter(e.target.value); setPage(1); }} 
            placeholder="Search by name..."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
            <option value="all">All</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending Review</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {[
                { key: "participantName", label: "Participant Name" },
                { key: "quizName", label: "Quiz Name" },
                { key: "score", label: "Score" },
                { key: "percent", label: "Percentage" },
                { key: "correct", label: "Correct" },
                { key: "incorrect", label: "Incorrect" },
                { key: "pending", label: "Pending" },
                { key: "date", label: "Date Completed" },
                { key: "time", label: "Time Taken" },
                { key: "actions", label: "" },
              ].map((col) => (
                <th key={col.key} scope="col" className="px-3 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                  {col.label}
                  {col.key !== "actions" && (
                    <button onClick={() => setSort(col.key)} className="ml-2 text-gray-400 hover:text-gray-600">⇅</button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr><td colSpan={10} className="px-3 py-4 text-sm text-gray-600">Loading...</td></tr>
            ) : pageData.length === 0 ? (
              <tr><td colSpan={10} className="px-3 py-4 text-sm text-gray-600">No results found.</td></tr>
            ) : (
              pageData.map((r) => (
                <tr key={`${r.quizId}_${r.id}`} className="hover:bg-gray-50">
                  <td className="px-3 py-3 text-sm text-gray-900">{r.participantName}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{r.quizName}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{r.score}/{r.total}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{r.percent}%</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{r.correct}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{r.incorrect}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{r.pending}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{formatDate(r.timestamp)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{formatTime(r.timeSpent)}</td>
                  <td className="px-3 py-3 text-sm">
                    <button onClick={() => viewDetails(r)} className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50">View Details</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">Page {page} of {totalPages}</div>
        <div className="flex gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60">Previous</button>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-60">Next</button>
        </div>
      </div>
    </div>
  );
}

function compareRows(a, b, key, dir) {
  const mult = dir === "asc" ? 1 : -1;
  if (key === "date") {
    const av = a.timestamp instanceof Date ? a.timestamp.getTime() : (a.completedAt ? new Date(a.completedAt).getTime() : 0);
    const bv = b.timestamp instanceof Date ? b.timestamp.getTime() : (b.completedAt ? new Date(b.completedAt).getTime() : 0);
    return (av - bv) * mult;
  }
  if (key === "time") {
    return ((Number(a.timeSpent) || 0) - (Number(b.timeSpent) || 0)) * mult;
  }
  if (key === "name") {
    return String(a.participantName || "").localeCompare(String(b.participantName || "")) * mult;
  }
  const av = a[key];
  const bv = b[key];
  if (typeof av === "number" && typeof bv === "number") return (av - bv) * mult;
  return String(av || "").localeCompare(String(bv || "")) * mult;
}

function escapeCSV(value) {
  const v = value == null ? "" : String(value);
  if (v.includes(";") || v.includes(",") || v.includes("\n") || v.includes('"')) {
    return '"' + v.replace(/"/g, '""') + '"';
  }
  return v;
}

function escapeHTML(s) {
  return String(s || "").replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}


