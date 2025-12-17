import Papa from 'papaparse';

/**
 * Export quiz results to CSV and trigger download as "quiz-results.csv".
 * Accepts an array of result objects. Tries common field names, falls back to empty strings.
 *
 * @param {Array<Object>} results
 */
export function exportToCSV(results = []) {
  if (!Array.isArray(results)) {
    throw new TypeError('exportToCSV expects an array of results');
  }

  const formatDate = (val) => {
    if (!val) return '';
    const d = typeof val === 'object' && val instanceof Date ? val : new Date(val);
    if (Number.isNaN(d.getTime())) return '';
    // Locale date (user's locale). Change options if you prefer ISO.
    return d.toLocaleDateString();
  };

  const formatTimeTaken = (val) => {
    if (val == null || val === '') return '';
    // assume seconds; if a very large number (>= 10000) it's likely milliseconds -> convert
    let seconds = Number(val);
    if (Number.isNaN(seconds)) return String(val);
    if (seconds >= 10000) seconds = Math.floor(seconds / 1000);
    seconds = Math.max(0, Math.floor(seconds));
    const hh = Math.floor(seconds / 3600);
    const mm = Math.floor((seconds % 3600) / 60);
    const ss = seconds % 60;
    return hh > 0
      ? `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
      : `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  };

  const rows = results.map((r) => ({
    'Participant Name': r.participantName ?? (r.participant && (r.participant.name ?? r.participant.fullName)) ?? '',
    'Quiz Name': r.quizName ?? (r.quiz && (r.quiz.title ?? r.quiz.name)) ?? '',
    'Score': r.score != null ? String(r.score) : '',
    'Percentage': r.percentage != null
      ? (typeof r.percentage === 'number' ? `${r.percentage.toFixed(2)}%` : String(r.percentage))
      : '',
    'Correct': r.correct != null ? String(r.correct) : '',
    'Incorrect': r.incorrect != null ? String(r.incorrect) : '',
    'Pending': r.pending != null ? String(r.pending) : '',
    'Date': formatDate(r.date ?? r.createdAt ?? r.timestamp),
    'Time Taken': formatTimeTaken(r.timeTaken ?? r.duration),
  }));

  // Use PapaParse to generate CSV and ensure proper quoting/escaping for special characters
  const csv = Papa.unparse(rows, {
    quotes: true, // force quoting to be safe with special chars / newlines
    delimiter: ',',
    newline: '\r\n',
  });

  // Prepend UTF-8 BOM so Excel opens UTF-8 CSV correctly with special characters
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quiz-results.csv';
  // support for Firefox which requires the element in the DOM
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}