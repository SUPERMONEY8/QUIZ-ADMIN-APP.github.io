import { useEffect, useMemo, useState } from "react";
import { quizOperations, resultOperations } from "../utils/databaseConfig";
import useAuth from "../hooks/useAuth";
// Removed real-time listener imports - dashboard is now stable without auto-refresh
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Line,
  LineChart,
} from "recharts";
import { Clock, Users, Award, TrendingUp, BarChart3, ChevronDown, ChevronRight, Download } from "lucide-react";
import ExportModal from "./ExportModal.jsx";
import { exportResultsToExcel } from "../utils/exportExcel.js";
import { exportAnalyticsToPDF } from "../utils/exportPDFAdvanced.js";
import { t } from "../store/translations";

export default function AnalyticsOverview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedQuizId, setSelectedQuizId] = useState("all");
  const [expandedParticipants, setExpandedParticipants] = useState(new Set()); // Track which participants are expanded
  const [exportModalOpen, setExportModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      if (!user?.id && !user?.uid) return;
      setLoading(true);
      setError("");
      try {
        const adminId = user?.id || user?.uid || 'admin-access-direct';

        // Load quizzes using Firebase
        const quizzesList = await quizOperations.getByAdmin(adminId);
        
        const formattedQuizzes = quizzesList.map((q) => ({
          id: q.id,
          name: q.title || q.name || "Untitled",
        }));
        setQuizzes(formattedQuizzes);

        if (formattedQuizzes.length > 0 && selectedQuizId === "all") {
          setSelectedQuizId(formattedQuizzes[0].id);
        }

        // Load all results for all quizzes
        if (formattedQuizzes.length === 0) {
          setResults([]);
          setLoading(false);
          return;
        }

        // Function to transform and set results
        const transformAndSetResults = (allResults, formattedQuizzes) => {

          // Transform results - ensure scores are calculated correctly
          const transformedResults = allResults.map((r) => {
            const quiz = formattedQuizzes.find((q) => q.id === r.quiz_id);
            const score = Number(r.total_score) || 0;
            const total = Number(r.total_questions) || 0;
            
            // Handle Firebase timestamp format
            let completedAt = null;
            if (r.completed_at) {
              if (r.completed_at.seconds) {
                completedAt = new Date(r.completed_at.seconds * 1000);
              } else if (r.completed_at instanceof Date) {
                completedAt = r.completed_at;
              } else if (typeof r.completed_at === 'string') {
                completedAt = new Date(r.completed_at);
              }
            }
            
            const timeSpent = Number(r.time_spent_seconds) || 0;
            
            // Calculate percentage - ensure we use actual saved scores
            let percent = 0;
            if (total > 0 && score >= 0) {
              percent = Math.round((score / total) * 100);
            }
            
            // Log for debugging
            if (score === 0 && total > 0) {
              console.warn("Zero score detected:", {
                resultId: r.id,
                participant: r.participant_name,
                quizId: r.quiz_id,
                score,
                total,
                answers: r.answers
              });
            }

            return {
              id: r.id,
              quizId: r.quiz_id,
              quizName: quiz?.name || "Untitled",
              participantName: r.participant_name || "Anonymous",
              score,
              total,
              percent: percent,
              timeSpent,
              completedAt,
              questionDetails: r.question_details || [], // Detailed question attempts data
            };
          });

          // Sort by completed_at descending
          transformedResults.sort((a, b) => {
            if (!a.completedAt && !b.completedAt) return 0;
            if (!a.completedAt) return 1;
            if (!b.completedAt) return -1;
            return b.completedAt.getTime() - a.completedAt.getTime();
          });

          setResults(transformedResults);
        };

        // Initial load - fetch results for each quiz
        const allResults = [];
        for (const quiz of formattedQuizzes) {
          try {
            const quizResults = await resultOperations.getByQuiz(quiz.id);
            allResults.push(...quizResults);
          } catch (err) {
            console.error(`Error loading results for quiz ${quiz.id}:`, err);
            // Continue with other quizzes even if one fails
          }
        }
        
        transformAndSetResults(allResults, formattedQuizzes);
        setLoading(false);

        // Real-time listener removed for stability - dashboard will only update on manual refresh or page reload
        // If you need real-time updates, you can add a refresh button instead
      } catch (e) {
        console.error("Error loading analytics:", e);
        setError(e?.message || "Failed to load analytics");
        setLoading(false);
      }
    };
    load();
    
    // No cleanup needed since we removed the real-time listener
  }, [user, selectedQuizId]);

  // Filter results by selected quiz
  const filteredResults = useMemo(() => {
    if (selectedQuizId === "all") return results;
    return results.filter((r) => r.quizId === selectedQuizId);
  }, [results, selectedQuizId]);

  // Total Quizzes
  const totalQuizzes = quizzes.length;

  // Total Participants (unique across all quizzes)
  const totalParticipants = useMemo(() => {
    const unique = new Set(results.map((r) => r.participantName).filter(Boolean));
    return unique.size;
  }, [results]);

  // Average time to complete by quiz
  const avgTimeByQuiz = useMemo(() => {
    if (selectedQuizId === "all") {
      const map = new Map();
      results.forEach((r) => {
        if (!r.quizId || !r.completedAt || r.timeSpent === 0) return;
        const existing = map.get(r.quizId) || { sum: 0, count: 0, name: r.quizName };
        existing.sum += r.timeSpent;
        existing.count += 1;
        map.set(r.quizId, existing);
      });
      return Array.from(map.entries()).map(([quizId, data]) => ({
        quizId,
        quizName: data.name,
        avgSeconds: data.count > 0 ? Math.round(data.sum / data.count) : 0,
      }));
    } else {
      const quizResults = filteredResults.filter((r) => r.completedAt && r.timeSpent > 0);
      if (quizResults.length === 0) return [];
      const total = quizResults.reduce((sum, r) => sum + r.timeSpent, 0);
      const avg = Math.round(total / quizResults.length);
      return [{ quizId: selectedQuizId, quizName: quizzes.find((q) => q.id === selectedQuizId)?.name || "Quiz", avgSeconds: avg }];
    }
  }, [selectedQuizId, filteredResults, results, quizzes]);

  // Average time by participant for selected quiz
  const avgTimeByParticipant = useMemo(() => {
    if (selectedQuizId === "all") return [];
    const map = new Map();
    filteredResults.forEach((r) => {
      if (!r.completedAt || r.timeSpent === 0) return;
      const existing = map.get(r.participantName) || { sum: 0, count: 0 };
      existing.sum += r.timeSpent;
      existing.count += 1;
      map.set(r.participantName, existing);
    });
    return Array.from(map.entries())
      .map(([participantName, data]) => ({
        participantName,
        avgSeconds: data.count > 0 ? Math.round(data.sum / data.count) : 0,
      }))
      .sort((a, b) => b.avgSeconds - a.avgSeconds);
  }, [selectedQuizId, filteredResults]);

  // Number of participants per quiz
  const participantsPerQuiz = useMemo(() => {
    if (selectedQuizId === "all") {
      const map = new Map();
      results.forEach((r) => {
        if (!r.quizId) return;
        const existing = map.get(r.quizId) || { set: new Set(), name: r.quizName };
        if (r.participantName) existing.set.add(r.participantName);
        map.set(r.quizId, existing);
      });
      return Array.from(map.entries()).map(([quizId, data]) => ({
        quizId,
        quizName: data.name,
        count: data.set.size,
      }));
    } else {
      const unique = new Set(filteredResults.map((r) => r.participantName).filter(Boolean));
      return [{ quizId: selectedQuizId, quizName: quizzes.find((q) => q.id === selectedQuizId)?.name || "Quiz", count: unique.size }];
    }
  }, [selectedQuizId, filteredResults, results, quizzes]);

  // Average score by quiz
  const avgScoreByQuiz = useMemo(() => {
    if (selectedQuizId === "all") {
      const map = new Map();
      results.forEach((r) => {
        if (!r.quizId) return;
        const existing = map.get(r.quizId) || { sum: 0, count: 0, name: r.quizName };
        existing.sum += r.percent;
        existing.count += 1;
        map.set(r.quizId, existing);
      });
      return Array.from(map.entries()).map(([quizId, data]) => ({
        quizId,
        quizName: data.name,
        avgScore: data.count > 0 ? Math.round(data.sum / data.count) : 0,
      }));
    } else {
      if (filteredResults.length === 0) return [];
      const total = filteredResults.reduce((sum, r) => sum + r.percent, 0);
      const avg = Math.round(total / filteredResults.length);
      return [{ quizId: selectedQuizId, quizName: quizzes.find((q) => q.id === selectedQuizId)?.name || "Quiz", avgScore: avg }];
    }
  }, [selectedQuizId, filteredResults, results, quizzes]);

  // Score distribution chart data (for selected quiz)
  const scoreDistributionData = useMemo(() => {
    if (selectedQuizId === "all") return [];
    return filteredResults
      .map((r) => ({
        participant: r.participantName || "Anonymous",
        score: r.score,
        total: r.total,
        percent: r.percent,
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [selectedQuizId, filteredResults]);

  const formatTime = (seconds) => {
    const s = Number(seconds) || 0;
    const mm = Math.floor(s / 60);
    const ss = s % 60;
    if (mm > 0) {
      return `${mm}m ${ss}s`;
    }
    return `${ss}s`;
  };

  const handleExportPDF = (filters) => {
    exportAnalyticsToPDF({
      ...filters,
      quizzes: quizzes,
      results: filteredResults.map(r => ({
        quizId: r.quizId,
        quizName: r.quizName,
        participantName: r.participantName,
        score: r.score,
        total: r.total,
        percent: r.percent,
        pending: false,
        timeSpent: r.timeSpent,
        timestamp: r.completedAt,
      })),
      difficultyRows: [],
      scoreOverTime: [],
      scoreDistribution: [],
      completionPie: [],
      avgTimePerQuiz: avgTimeByQuiz.map(item => ({
        quizId: item.quizId,
        quizName: item.quizName,
        avgSeconds: item.avgSeconds,
      })),
      chartImages: {},
    });
  };

  const handleExportExcel = async () => {
    // Get the quiz name for the filename
    const selectedQuiz = selectedQuizId === "all" 
      ? null 
      : quizzes.find(q => q.id === selectedQuizId);
    const quizNameForExport = selectedQuiz ? selectedQuiz.name : (filteredResults[0]?.quizName || t("analytics.allQuizzes"));
    
    await exportResultsToExcel(filteredResults.map(r => ({
      quizId: r.quizId,
      quizName: r.quizName,
      participantName: r.participantName,
      score: r.score,
      total: r.total,
      percent: r.percent,
      correct: 0,
      incorrect: 0,
      pending: 0,
      timeSpent: r.timeSpent,
      timestamp: r.completedAt,
      completedAt: r.completedAt,
      questionDetails: r.questionDetails || [], // Include question details for detailed export
    })), {
      scope: selectedQuizId === "all" ? "all" : "quiz",
      quizId: selectedQuizId === "all" ? "" : selectedQuizId,
      quizName: quizNameForExport, // Pass quiz name for filename
      dateRange: "all",
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">{t("analytics.loadingAnalytics")}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-3">
      {/* Quiz Selector and Export Buttons */}
      <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-md shadow-sm p-3 md:p-2 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("analytics.selectQuiz")}
            </label>
            <div className="relative">
              <select
                value={selectedQuizId}
                onChange={(e) => setSelectedQuizId(e.target.value)}
                className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 appearance-none cursor-pointer"
              >
                <option value="all">{t("analytics.allQuizzes")}</option>
                {quizzes.map((q) => (
                  <option key={q.id} value={q.id}>
                    {q.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-end gap-2">
            <button
              onClick={() => setExportModalOpen(true)}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t("analytics.exportPDF")}
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t("analytics.exportExcel")}
            </button>
          </div>
        </div>
      </div>

      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        onExport={handleExportPDF}
        exportType="analytics"
        quizzes={quizzes}
      />

      {/* Total Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-2">
        <StatCard
          icon={<BarChart3 className="h-5 w-5 md:h-4 md:w-4" />}
          label={t("analytics.totalQuizzes")}
          value={totalQuizzes}
          color="indigo"
        />
        <StatCard
          icon={<Users className="h-5 w-5 md:h-4 md:w-4" />}
          label={t("analytics.totalParticipants")}
          value={totalParticipants}
          color="green"
        />
      </div>

      {/* Average Time to Complete by Quiz */}
      <AnalyticsCard
        title={t("analytics.averageTimeToCompleteByQuiz")}
        icon={<Clock className="h-5 w-5" />}
      >
        {avgTimeByQuiz.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t("analytics.noTimeData")}</p>
        ) : (
          <div className="space-y-1.5 md:space-y-1">
            {avgTimeByQuiz.map((item) => (
              <div
                key={item.quizId}
                className="flex items-center justify-between p-2 md:p-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm"
              >
                <span className="text-gray-900 dark:text-white font-medium">{item.quizName}</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  {formatTime(item.avgSeconds)}
                </span>
              </div>
            ))}
          </div>
        )}
      </AnalyticsCard>

      {/* Average Time by Participant */}
      {selectedQuizId !== "all" && (
        <AnalyticsCard
          title={t("analytics.averageTimeToCompleteByParticipant")}
          icon={<Clock className="h-5 w-5" />}
        >
          {avgTimeByParticipant.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-sm">{t("analytics.noParticipantTimeData")}</p>
          ) : (
            <div className="space-y-1.5 md:space-y-1">
              {avgTimeByParticipant.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 md:p-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm"
                >
                  <span className="text-gray-900 dark:text-white font-medium">{item.participantName}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                    {formatTime(item.avgSeconds)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </AnalyticsCard>
      )}

      {/* Number of Participants per Quiz */}
      <AnalyticsCard
        title={t("analytics.numberOfParticipantsPerQuiz")}
        icon={<Users className="h-5 w-5" />}
      >
        {participantsPerQuiz.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t("analytics.noParticipantsData")}</p>
        ) : (
          <div className="space-y-1.5 md:space-y-1">
            {participantsPerQuiz.map((item) => (
              <div
                key={item.quizId}
                className="flex items-center justify-between p-2 md:p-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm"
              >
                <span className="text-gray-900 dark:text-white font-medium">{item.quizName}</span>
                <span className="text-green-600 dark:text-green-400 font-semibold text-base md:text-sm">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </AnalyticsCard>

      {/* Average Score by Quiz */}
      <AnalyticsCard
        title={t("analytics.averageScoreByQuiz")}
        icon={<Award className="h-5 w-5" />}
      >
        {avgScoreByQuiz.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-sm">{t("analytics.noScoreData")}</p>
        ) : (
          <div className="space-y-1.5 md:space-y-1">
            {avgScoreByQuiz.map((item) => (
              <div
                key={item.quizId}
                className="flex items-center justify-between p-2 md:p-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-md text-sm"
              >
                <span className="text-gray-900 dark:text-white font-medium">{item.quizName}</span>
                <span className="text-purple-600 dark:text-purple-400 font-semibold text-base md:text-sm">
                  {item.avgScore}%
                </span>
              </div>
            ))}
          </div>
        )}
      </AnalyticsCard>

      {/* Score Distribution Chart */}
      {selectedQuizId !== "all" && scoreDistributionData.length > 0 && (
        <AnalyticsCard
          title={t("analytics.scoreDistribution")}
          icon={<TrendingUp className="h-5 w-5" />}
        >
          <div className="h-64 md:h-56 mt-3 md:mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scoreDistributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" domain={[0, 100]} stroke="#6b7280" />
                <YAxis
                  type="category"
                  dataKey="participant"
                  width={120}
                  stroke="#6b7280"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                  formatter={(value, name) => {
                    if (name === "percent") return [`${value}%`, t("analytics.score")];
                    return [value, name];
                  }}
                />
                <Bar
                  dataKey="percent"
                  fill="#6366f1"
                  radius={[0, 8, 8, 0]}
                  label={{ position: "right", formatter: (v) => `${v}%` }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-3 md:mt-2 text-xs md:text-xs text-gray-600 dark:text-gray-400">
            {t("analytics.verticalBarsDescription")}
          </p>
        </AnalyticsCard>
      )}

      {/* Detailed Participant Responses */}
      {selectedQuizId !== "all" && filteredResults.length > 0 && (
        <AnalyticsCard
          title={t("analytics.detailedParticipantResponses")}
          icon={<Users className="h-5 w-5" />}
        >
          <div className="space-y-3 md:space-y-2">
            {filteredResults.map((result) => {
              const questionDetails = result.questionDetails || [];
              const isExpanded = expandedParticipants.has(result.id);
              
              // Calculate total time spent across all questions
              const totalTimeSpent = questionDetails.reduce((sum, qDetail) => {
                return sum + (Number(qDetail.time_spent_seconds) || 0);
              }, 0);
              
              const toggleExpand = () => {
                const newExpanded = new Set(expandedParticipants);
                if (isExpanded) {
                  newExpanded.delete(result.id);
                } else {
                  newExpanded.add(result.id);
                }
                setExpandedParticipants(newExpanded);
              };
              
              return (
                <div
                  key={result.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700/30 overflow-hidden"
                >
                  {/* Participant Header - Clickable Dropdown */}
                  <button
                    onClick={toggleExpand}
                    className="w-full p-3 md:p-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-2 md:gap-1.5 flex-1 text-left">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 md:h-3.5 md:w-3.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 md:h-3.5 md:w-3.5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <h4 className="text-base md:text-sm font-semibold text-gray-900 dark:text-white">
                          {result.participantName}
                        </h4>
                        <p className="text-xs md:text-xs text-gray-600 dark:text-gray-400 mt-0.5">
                          {t("analytics.score")}: {result.score} / {result.total} ({result.percent}%)
                          {result.completedAt && (
                            <span className="ml-3">
                              • {t("analytics.completed")}: {result.completedAt.toLocaleDateString()} {result.completedAt.toLocaleTimeString()}
                            </span>
                          )}
                          {totalTimeSpent > 0 && (
                            <span className="ml-3">
                              • {t("analytics.totalTime")}: {formatTime(totalTimeSpent)}
                            </span>
                          )}
                          {questionDetails.length > 0 && (
                            <span className="ml-3">
                              • {questionDetails.length} {questionDetails.length !== 1 ? t("analytics.questions") : t("analytics.question")}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Expandable Question Details */}
                  {isExpanded && (
                    <div className="px-3 md:px-2 pb-3 md:pb-2 border-t border-gray-200 dark:border-gray-600">
                      {questionDetails.length > 0 ? (
                        <div className="space-y-2 md:space-y-1.5 mt-2 md:mt-1.5">
                          {questionDetails.map((qDetail, idx) => {
                            const attemptText = qDetail.correct_attempt
                              ? `${qDetail.correct_attempt === 1 ? '1ère' : qDetail.correct_attempt === 2 ? '2ème' : '3ème'} ${t("analytics.attempt")}`
                              : qDetail.attempts >= 3
                              ? `${t("analytics.never")} (${t("analytics.usedAllAttempts")})`
                              : t("analytics.notAnswered");

                            return (
                              <div
                                key={qDetail.question_id || idx}
                                className={`p-3 md:p-2 rounded-md border-2 ${
                                  qDetail.is_correct
                                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                                    : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                                }`}
                              >
                                <div className="flex items-start justify-between mb-1.5 md:mb-1">
                                  <h5 className="font-semibold text-sm md:text-xs text-gray-900 dark:text-white">
                                    Q{idx + 1}: {qDetail.question_text || 'N/A'}
                                  </h5>
                                  <span
                                    className={`px-1.5 py-0.5 md:px-1 md:py-0.5 rounded text-xs md:text-xs font-medium ${
                                      qDetail.is_correct
                                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300'
                                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300'
                                    }`}
                                  >
                                    {qDetail.is_correct ? t("analytics.correct") : t("analytics.incorrect")}
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-1.5 mt-2 md:mt-1.5 text-xs md:text-xs">
                                  <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{t("analytics.userAnswer")}:</span>
                                    <p className="text-gray-900 dark:text-white mt-1">
                                      {qDetail.user_answer || t("analytics.notAnswered")}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{t("analytics.correctAnswer")}:</span>
                                    <p className="text-gray-900 dark:text-white mt-1">
                                      {qDetail.correct_answer || 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{t("analytics.totalAttempts")}:</span>
                                    <p className="text-gray-900 dark:text-white mt-1">
                                      {qDetail.attempts || 0} / 3
                                    </p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{t("analytics.correctOn")}:</span>
                                    <p className={`mt-1 font-semibold ${
                                      qDetail.correct_attempt === 1
                                        ? 'text-green-600 dark:text-green-400'
                                        : qDetail.correct_attempt === 2
                                        ? 'text-yellow-600 dark:text-yellow-400'
                                        : qDetail.correct_attempt === 3
                                        ? 'text-orange-600 dark:text-orange-400'
                                        : 'text-red-600 dark:text-red-400'
                                    }`}>
                                      {attemptText}
                                    </p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-700 dark:text-gray-300">{t("analytics.timeSpent")}:</span>
                                    <p className="text-gray-900 dark:text-white mt-1 font-semibold">
                                      {qDetail.time_spent_seconds 
                                        ? formatTime(qDetail.time_spent_seconds)
                                        : 'N/A'}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-xs md:text-xs mt-2 md:mt-1.5">
                          {t("analytics.noDetailedData")}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </AnalyticsCard>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color = "indigo" }) {
  const colorClasses = {
    indigo: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-md shadow-sm p-4 md:p-3 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-2 md:mb-1.5">
        <div className={`p-2 md:p-1.5 rounded-md ${colorClasses[color]}`}>{icon}</div>
      </div>
      <div className="text-xs md:text-xs text-gray-600 dark:text-gray-400 mb-0.5">{label}</div>
      <div className="text-2xl md:text-xl font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  );
}

function AnalyticsCard({ title, icon, children }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg md:rounded-md shadow-sm p-4 md:p-3 border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 md:gap-1.5 mb-3 md:mb-2">
        <div className="text-indigo-600 dark:text-indigo-400">{icon}</div>
        <h3 className="text-base md:text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      {children}
    </div>
  );
}
