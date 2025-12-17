import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Download, TrendingUp, Users, Clock, Award, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "../supabaseConfig";
import useAuth from "../hooks/useAuth";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ExportModal from "../components/ExportModal.jsx";
import { exportAnalyticsToPDF } from "../utils/exportPDFAdvanced.js";
import { exportResultsToExcel } from "../utils/exportExcel.js";
import html2canvas from "html2canvas";

const COLORS = ["#0d9488", "#14b8a6", "#5eead4", "#2dd4bf", "#99f6e4"];
const CHART_COLORS = {
  primary: "#0d9488",
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#3b82f6",
};

export default function QuizAnalyticsPage() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quiz, setQuiz] = useState(null);
  const [attempts, setAttempts] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  
  // Refs for chart containers
  const scoreOverTimeRef = useRef(null);
  const scoreDistributionRef = useRef(null);
  const completionPieRef = useRef(null);
  const metricsRef = useRef(null);

  useEffect(() => {
    if ((!user?.id && !user?.uid) || !quizId) return;
    
    let subscription = null;
    
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const adminId = user?.id || user?.uid;
        
        // Load quiz (one-time)
        const { data: quizData, error: quizError } = await supabase
          .from("quizzes")
          .select("*")
          .eq("id", quizId)
          .eq("admin_id", adminId)
          .single();

        if (quizError || !quizData) {
          throw new Error("Quiz not found");
        }
        setQuiz({ id: quizId, ...quizData, name: quizData.title || quizData.name });

        // Load results for this quiz (analytics)
        const loadAnalytics = async () => {
          const { data: resultsData, error: resultsError } = await supabase
            .from("results")
            .select("*")
            .eq("quiz_id", quizId)
            .order("completed_at", { ascending: false });

          if (resultsError) {
            throw resultsError;
          }

          // Transform results to analytics format
          const analyticsData = (resultsData || []).map((r) => ({
            id: r.id,
            participantName: r.participant_name || "Unknown",
            score: r.total_score || 0,
            totalPossible: r.max_score || 0,
            timeSpent: r.time_spent_seconds || 0,
            timestamp: r.completed_at ? new Date(r.completed_at) : null,
            pending: false, // Can be calculated from question_attempts if needed
          }));

          setAnalytics(analyticsData);
          setLoading(false);
        };

        await loadAnalytics();

        // Set up real-time subscription for results
        subscription = supabase
          .channel(`quiz-results-${quizId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'results',
              filter: `quiz_id=eq.${quizId}`,
            },
            async () => {
              // Reload analytics on change
              await loadAnalytics();
            }
          )
          .subscribe();

        // Note: Attempts are now tracked via results table, so we don't need a separate attempts listener
        setAttempts([]); // Clear attempts as they're now part of results
      } catch (e) {
        console.error("Error loading analytics:", e);
        setError(e?.message || "Failed to load analytics");
        setLoading(false);
      }
    };
    
    load();
    
    // Cleanup subscription on unmount
    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [user, quizId]);

  // Calculate metrics
  const metrics = useMemo(() => {
    const totalAttempts = analytics.length;
    const completedAttempts = analytics.filter((a) => !a.pending && a.timestamp).length;
    const totalParticipants = new Set(analytics.map((a) => a.participantName)).size;
    
    const scores = analytics.map((a) => {
      const score = Number(a.score || 0);
      const total = Number(a.totalPossible || 0);
      return total > 0 ? (score / total) * 100 : 0;
    });
    const averageScore = scores.length > 0
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
      : 0;

    const completionRate = totalAttempts > 0
      ? Math.round((completedAttempts / totalAttempts) * 100)
      : 0;

    // Calculate average time from analytics
    const totalTime = analytics.reduce((sum, a) => sum + (Number(a.timeSpent) || 0), 0);
    const completedCount = completedAttempts;
    const avgTime = completedCount > 0
      ? Math.round(totalTime / completedCount)
      : 0;

    return {
      totalAttempts,
      completedAttempts,
      totalParticipants,
      averageScore,
      completionRate,
      avgTime,
    };
  }, [analytics]);

  // Score distribution
  const scoreDistribution = useMemo(() => {
    const buckets = [
      { range: "0-20%", min: 0, max: 20, count: 0 },
      { range: "20-40%", min: 20, max: 40, count: 0 },
      { range: "40-60%", min: 40, max: 60, count: 0 },
      { range: "60-80%", min: 60, max: 80, count: 0 },
      { range: "80-100%", min: 80, max: 100, count: 0 },
    ];

    analytics.forEach((a) => {
      const score = Number(a.score || 0);
      const total = Number(a.totalPossible || 0);
      const percent = total > 0 ? (score / total) * 100 : 0;
      for (const bucket of buckets) {
        if (percent >= bucket.min && percent < (bucket.max === 100 ? 101 : bucket.max)) {
          bucket.count++;
          break;
        }
      }
    });

    return buckets;
  }, [analytics]);

  // Score over time
  const scoreOverTime = useMemo(() => {
    const map = new Map();
    analytics.forEach((a) => {
      const date = a.timestamp instanceof Date ? a.timestamp : (a.timestamp ? new Date(a.timestamp) : null);
      if (!date || isNaN(date.getTime())) return;
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
      const score = Number(a.score || 0);
      const total = Number(a.totalPossible || 0);
      const percent = total > 0 ? (score / total) * 100 : 0;
      const entry = map.get(key) || { date: key, sum: 0, count: 0 };
      entry.sum += percent;
      entry.count++;
      map.set(key, entry);
    });
    return Array.from(map.values())
      .map((e) => ({ date: e.date, avg: e.count > 0 ? Math.round(e.sum / e.count) : 0 }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [analytics]);

  // Completion status pie
  const completionPie = useMemo(() => {
    const completed = analytics.filter((a) => !a.pending && a.timestamp).length;
    const pending = analytics.filter((a) => a.pending).length;
    return [
      { name: "Completed", value: completed, color: CHART_COLORS.success },
      { name: "Pending", value: pending, color: CHART_COLORS.warning },
    ];
  }, [analytics]);

  const formatTime = (seconds) => {
    const s = Number(seconds) || 0;
    const mm = String(Math.floor(s / 60)).padStart(2, "0");
    const ss = String(s % 60).padStart(2, "0");
    return `${mm}:${ss}`;
  };

  const handleExportPDF = useCallback(async (filters) => {
    // Capture charts as images
    const chartImages = {};
    
    try {
      if (filters.includeCharts !== false) {
        // Capture Score Over Time chart
        if (scoreOverTimeRef.current && scoreOverTime.length > 0) {
          const canvas = await html2canvas(scoreOverTimeRef.current, {
            backgroundColor: '#ffffff',
            scale: 3,
            logging: false,
            useCORS: true,
            allowTaint: false,
          });
          chartImages.scoreOverTime = canvas.toDataURL('image/png');
        }
        
        // Capture Score Distribution chart
        if (scoreDistributionRef.current && scoreDistribution.length > 0) {
          const canvas = await html2canvas(scoreDistributionRef.current, {
            backgroundColor: '#ffffff',
            scale: 3,
            logging: false,
            useCORS: true,
            allowTaint: false,
          });
          chartImages.scoreDistribution = canvas.toDataURL('image/png');
        }
        
        // Capture Completion Pie chart
        if (completionPieRef.current && completionPie.length > 0) {
          const canvas = await html2canvas(completionPieRef.current, {
            backgroundColor: '#ffffff',
            scale: 3,
            logging: false,
            useCORS: true,
            allowTaint: false,
          });
          chartImages.completionPie = canvas.toDataURL('image/png');
        }
      }
      
      // Capture metrics cards
      if (filters.includeSummary !== false && metricsRef.current) {
        const canvas = await html2canvas(metricsRef.current, {
          backgroundColor: '#ffffff',
          scale: 3,
          logging: false,
          useCORS: true,
          allowTaint: false,
        });
        chartImages.metrics = canvas.toDataURL('image/png');
      }
    } catch (error) {
      console.error("Error capturing charts:", error);
    }
    
    exportAnalyticsToPDF({
      ...filters,
      quizzes: quiz ? [{ id: quizId, name: quiz.name || quiz.title || "Untitled" }] : [],
      results: analytics.map(a => ({
        quizId,
        quizName: quiz?.name || quiz?.title || "Untitled",
        participantName: a.participantName || "Unknown",
        score: a.score || 0,
        total: a.totalPossible || 0,
        percent: Math.round(((a.score || 0) / (a.totalPossible || 1)) * 100),
        pending: a.pending || false,
        timeSpent: a.timeSpent || 0,
        timestamp: a.timestamp,
      })),
      difficultyRows: [],
      scoreOverTime: scoreOverTime.map(s => ({ date: s.date, avg: s.avg })),
      scoreDistribution: scoreDistribution.map(s => ({ range: s.range, count: s.count })),
      completionPie: completionPie.map(c => ({ name: c.name, value: c.value })),
      avgTimePerQuiz: [],
      chartImages,
    });
  }, [quiz, quizId, analytics, scoreOverTime, scoreDistribution, completionPie]);

  const handleExportExcel = useCallback(async () => {
    // Transform analytics data to match the format expected by exportResultsToExcel
    const resultsForExport = analytics.map(a => ({
      quizId,
      quizName: quiz?.name || quiz?.title || "Untitled",
      participantName: a.participantName || "Unknown",
      score: a.score || 0,
      total: a.totalPossible || 0,
      percent: Math.round(((a.score || 0) / (a.totalPossible || 1)) * 100),
      correct: 0, // Not available in analytics data
      incorrect: 0, // Not available in analytics data
      pending: a.pending ? 1 : 0,
      timeSpent: a.timeSpent || 0,
      timestamp: a.timestamp,
      completedAt: a.timestamp,
      questionDetails: [], // Analytics page doesn't have question details
    }));

    await exportResultsToExcel(resultsForExport, {
      scope: "quiz",
      quizId: quizId,
      quizName: quiz?.name || quiz?.title || "Untitled",
      dateRange: "all",
    });
  }, [quiz, quizId, analytics]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <div className="animate-spin h-6 w-6 border-2 border-medical-600 border-t-transparent rounded-full"></div>
          <span className="text-medical-600 dark:text-medical-400">Loading analytics...</span>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || "Quiz not found"}</p>
          <button
            onClick={() => navigate("/admin")}
            className="medical-button"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/admin")}
              className="medical-button-secondary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{quiz.name || "Untitled Quiz"}</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Detailed Analytics & Performance</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setExportModalOpen(true)}
              className="medical-button inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export PDF
            </button>
            <button
              onClick={handleExportExcel}
              className="medical-button-secondary inline-flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export Excel
            </button>
          </div>
        </div>

        <ExportModal
          isOpen={exportModalOpen}
          onClose={() => setExportModalOpen(false)}
          onExport={handleExportPDF}
          exportType="analytics"
        />

        {/* Key Metrics */}
        <div ref={metricsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <MetricCard
            icon={<Users className="h-5 w-5" />}
            label="Total Participants"
            value={metrics.totalParticipants}
            color="blue"
          />
          <MetricCard
            icon={<TrendingUp className="h-5 w-5" />}
            label="Average Score"
            value={`${metrics.averageScore}%`}
            color="green"
          />
          <MetricCard
            icon={<CheckCircle className="h-5 w-5" />}
            label="Completion Rate"
            value={`${metrics.completionRate}%`}
            color="teal"
          />
          <MetricCard
            icon={<Clock className="h-5 w-5" />}
            label="Avg Time"
            value={formatTime(metrics.avgTime)}
            color="purple"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Score Distribution */}
          <div ref={scoreDistributionRef} className="medical-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="h-5 w-5 text-medical-600 dark:text-medical-400" />
              Score Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="range" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="count" fill={CHART_COLORS.primary} radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Shows how many participants scored in each percentage range.</p>
            </div>
          </div>

          {/* Score Over Time */}
          <div ref={scoreOverTimeRef} className="medical-card p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-medical-600 dark:text-medical-400" />
              Average Score Over Time
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={scoreOverTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis domain={[0, 100]} stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke={CHART_COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: CHART_COLORS.primary, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
              <p>Trend of average scores over time. Helps identify improvement patterns.</p>
            </div>
          </div>

          {/* Completion Status */}
          <div ref={completionPieRef} className="medical-card p-6 lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-medical-600 dark:text-medical-400" />
              Attempt Status Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={completionPie}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {completionPie.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 grid grid-cols-3 gap-4">
              {completionPie.map((entry) => (
                <div key={entry.name} className="text-center">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{entry.value}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">{entry.name}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Attempts Table */}
        <div className="medical-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Attempts</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-2 py-1 rounded-full bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Live</span>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Participant
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Time
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {analytics.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
                      No attempts yet. The table will update automatically when participants submit quizzes.
                    </td>
                  </tr>
                ) : (
                  analytics.slice(0, 10).map((a, index) => {
                    const percent = a.totalPossible > 0
                      ? Math.round(((a.score || 0) / a.totalPossible) * 100)
                      : 0;
                    return (
                      <tr 
                        key={a.id} 
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        style={{
                          animation: index === 0 ? 'fadeIn 0.5s ease-in' : 'none'
                        }}
                      >
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {a.participantName || "Unknown"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {a.score || 0} / {a.totalPossible || 0}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          percent >= 80
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : percent >= 60
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                        }`}>
                          {percent}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {a.pending ? (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 text-xs">
                            <AlertCircle className="h-3 w-3" />
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 text-xs">
                            <CheckCircle className="h-3 w-3" />
                            Completed
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {formatTime(a.timeSpent || 0)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        {a.timestamp instanceof Date
                          ? a.timestamp.toLocaleDateString()
                          : a.timestamp
                          ? new Date(a.timestamp).toLocaleDateString()
                          : "—"}
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, color = "blue" }) {
  const colorClasses = {
    blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
    green: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
    teal: "bg-medical-100 dark:bg-medical-900/30 text-medical-600 dark:text-medical-400",
    purple: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
  };

  return (
    <div className="medical-card p-5 hover:scale-105 transition-transform duration-200">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
    </div>
  );
}

