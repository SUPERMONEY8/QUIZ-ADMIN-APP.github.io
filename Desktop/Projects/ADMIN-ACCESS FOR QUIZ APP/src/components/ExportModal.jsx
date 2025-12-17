import { useState } from "react";
import { X } from "lucide-react";

/**
 * Modal for configuring PDF export with filters
 */
export default function ExportModal({ isOpen, onClose, onExport, exportType = "results", quizzes = [] }) {
  const [filters, setFilters] = useState({
    scope: "all", // all | quiz | participant | questions
    quizId: "",
    participantName: "",
    includeCharts: true,
    includeQuestions: true,
    includeSummary: true,
    dateRange: "all", // all | custom
    startDate: "",
    endDate: "",
  });

  if (!isOpen) return null;

  const handleExport = () => {
    onExport(filters);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="medical-card p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Export to PDF
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          {/* Export Scope */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Export Scope
            </label>
            <select
              value={filters.scope}
              onChange={(e) => setFilters({ ...filters, scope: e.target.value })}
              className="medical-input w-full"
            >
              <option value="all">All Data</option>
              <option value="quiz">By Quiz</option>
              <option value="participant">By Participant</option>
              {exportType === "analytics" && <option value="questions">Per Questions</option>}
            </select>
          </div>

          {/* Quiz Filter */}
          {filters.scope === "quiz" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Quiz
              </label>
              {quizzes.length > 0 ? (
                <select
                  value={filters.quizId}
                  onChange={(e) => setFilters({ ...filters, quizId: e.target.value })}
                  className="medical-input w-full"
                >
                  <option value="">All Quizzes</option>
                  {quizzes.map((q) => (
                    <option key={q.id} value={q.id}>{q.name || q.title || q.id}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={filters.quizId}
                  onChange={(e) => setFilters({ ...filters, quizId: e.target.value })}
                  placeholder="Enter quiz ID or name (or leave empty for current quiz)"
                  className="medical-input w-full"
                />
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                💡 Leave empty if exporting from a specific quiz page
              </p>
            </div>
          )}

          {/* Participant Filter */}
          {filters.scope === "participant" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Participant Name
              </label>
              <input
                type="text"
                value={filters.participantName}
                onChange={(e) => setFilters({ ...filters, participantName: e.target.value })}
                placeholder="Enter participant name"
                className="medical-input w-full"
              />
            </div>
          )}

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Date Range
            </label>
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters({ ...filters, dateRange: e.target.value })}
              className="medical-input w-full mb-2"
            >
              <option value="all">All Dates</option>
              <option value="custom">Custom Range</option>
            </select>
            {filters.dateRange === "custom" && (
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  className="medical-input"
                />
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  className="medical-input"
                />
              </div>
            )}
          </div>

          {/* Include Options */}
          {exportType === "analytics" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Include in Export
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.includeCharts}
                    onChange={(e) => setFilters({ ...filters, includeCharts: e.target.checked })}
                    className="rounded border-gray-300 text-medical-600 focus:ring-medical-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Charts & Graphs</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.includeSummary}
                    onChange={(e) => setFilters({ ...filters, includeSummary: e.target.checked })}
                    className="rounded border-gray-300 text-medical-600 focus:ring-medical-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Summary Statistics</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.includeQuestions}
                    onChange={(e) => setFilters({ ...filters, includeQuestions: e.target.checked })}
                    className="rounded border-gray-300 text-medical-600 focus:ring-medical-500"
                  />
                  <span className="text-sm text-gray-700 dark:text-gray-300">Question Analysis</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="medical-button-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            className="medical-button"
          >
            Export PDF
          </button>
        </div>
      </div>
    </div>
  );
}

