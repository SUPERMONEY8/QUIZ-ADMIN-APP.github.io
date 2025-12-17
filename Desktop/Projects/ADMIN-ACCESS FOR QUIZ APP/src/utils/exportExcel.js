import ExcelJS from 'exceljs';

/**
 * Export quiz results to Excel (.xlsx) file with detailed question information and automatic color formatting
 * Supports filtering by quiz, participant, and date range
 * 
 * @param {Array} results - Array of result objects with questionDetails
 * @param {Object} filters - Filter options
 */
export async function exportResultsToExcel(results = [], filters = {}) {
  const {
    scope = "all",
    quizId = "",
    quizName: providedQuizName = "",
    participantName = "",
    dateRange = "all",
    startDate = "",
    endDate = "",
  } = filters;

  // Apply filters
  let filtered = [...results];
  if (scope === "quiz" && quizId) {
    filtered = filtered.filter(r => r.quizId === quizId);
  }
  if (scope === "participant" && participantName) {
    filtered = filtered.filter(r => 
      r.participantName?.toLowerCase().includes(participantName.toLowerCase())
    );
  }
  if (dateRange === "custom") {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate + "T23:59:59") : null;
    filtered = filtered.filter(r => {
      const ts = r.timestamp?.toDate ? r.timestamp.toDate() : (r.timestamp instanceof Date ? r.timestamp : (r.completedAt ? new Date(r.completedAt) : null));
      if (!ts) return false;
      if (start && ts < start) return false;
      if (end && ts > end) return false;
      return true;
    });
  }

  if (filtered.length === 0) {
    alert("No results match the selected filters.");
    return;
  }

  // Format date helper
  const formatDate = (ts) => {
    if (!ts) return '—';
    const d = ts?.toDate ? ts.toDate() : (ts instanceof Date ? ts : new Date(ts));
    if (isNaN(d.getTime())) return '—';
    return d.toLocaleString();
  };

  // Format date for filename
  const formatDateForFilename = (ts) => {
    if (!ts) {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    const d = ts?.toDate ? ts.toDate() : (ts instanceof Date ? ts : new Date(ts));
    if (isNaN(d.getTime())) {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  // Format time helper
  const formatTime = (s) => {
    const sec = Number(s) || 0;
    const mm = String(Math.floor(sec / 60)).padStart(2, '0');
    const ss = String(sec % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // Get quiz name for filename
  let quizName = 'All Quizzes';
  if (providedQuizName) {
    quizName = providedQuizName;
  } else if (scope === "quiz" && filtered.length > 0) {
    quizName = filtered[0].quizName || 'Quiz';
  }
  
  // Clean quiz name for filename (remove special chars, limit length)
  const cleanQuizName = quizName.replace(/[^a-z0-9\s]/gi, '_').replace(/\s+/g, '_').substring(0, 50);
  
  // Get date from first result or use current date
  const dateStr = filtered.length > 0 
    ? formatDateForFilename(filtered[0].timestamp || filtered[0].completedAt)
    : formatDateForFilename(null);

  // Create ExcelJS workbook for styling support
  const wb = new ExcelJS.Workbook();

  // ===== SUMMARY SHEET =====
  const summarySheet = wb.addWorksheet('Summary');
  
  // Summary headers
  summarySheet.columns = [
    { header: 'Participant Name', width: 25 },
    { header: 'Quiz Name', width: 30 },
    { header: 'Score', width: 15 },
    { header: 'Percentage', width: 12 },
    { header: 'Correct', width: 10 },
    { header: 'Incorrect', width: 12 },
    { header: 'Pending', width: 10 },
    { header: 'Time Taken', width: 12 },
    { header: 'Date Completed', width: 25 },
  ];

  // Style header row
  summarySheet.getRow(1).font = { bold: true };
  summarySheet.getRow(1).fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFE0E0E0' }
  };

  // Add summary data
  filtered.forEach(r => {
    // Calculate correct/incorrect from questionDetails if available
    let correct = 0;
    let incorrect = 0;
    let pending = 0;
    
    if (r.questionDetails && Array.isArray(r.questionDetails)) {
      r.questionDetails.forEach(q => {
        if (q.is_correct === true) {
          correct++;
        } else if (q.is_correct === false) {
          incorrect++;
        } else {
          pending++;
        }
      });
    } else {
      // Fallback to provided values
      correct = r.correct || 0;
      incorrect = r.incorrect || 0;
      pending = r.pending || 0;
    }

    summarySheet.addRow([
      r.participantName || 'Unknown',
      r.quizName || 'Untitled',
      `${r.score || 0}/${r.total || 0}`,
      `${r.percent || 0}%`,
      correct,
      incorrect,
      pending,
      formatTime(r.timeSpent || 0),
      formatDate(r.timestamp || r.completedAt),
    ]);
  });

  // ===== DETAILED QUESTIONS SHEET WITH EXACT LAYOUT =====
  const detailsSheet = wb.addWorksheet('Question Details');
  
  // Set default font
  detailsSheet.defaultRowHeight = 20;
  
  // Define columns starting from column C (index 3)
  // Columns A and B are empty (indices 1 and 2)
  detailsSheet.columns = [
    { width: 5 },   // Column A - empty
    { width: 5 },   // Column B - empty
    { width: 25 },  // Column C - Participant Name
    { width: 12 },  // Column D - Question #
    { width: 50 },  // Column E - Question Text
    { width: 15 },  // Column F - Question Type
    { width: 30 },  // Column G - User Answer
    { width: 30 },  // Column H - Correct Answer
    { width: 12 },  // Column I - Is Correct
    { width: 15 },  // Column J - Total Attempts
    { width: 30 },  // Column K - Correct on Attempt
    { width: 18 },  // Column L - Time Spent (formatted)
    { width: 8 },   // Column M - Score
  ];

  // Color palette for participants (alternating light green and light pink)
  const participantColors = [
    'FFE8F5E8', // Light green
    'FFFFE8E8', // Light pink/red
    'FFE8F5E8', // Light green (repeat)
    'FFFFE8E8', // Light pink/red (repeat)
    'FFE8F5E8', // Light green (repeat)
    'FFFFE8E8', // Light pink/red (repeat)
    'FFE8F5E8', // Light green (repeat)
    'FFFFE8E8', // Light pink/red (repeat)
  ];

  // Track participant colors
  const participantColorMap = new Map();
  let colorIndex = 0;
  let currentRow = 4; // Start from row 4 (row 1-2 empty, row 3 is header)

  // Header row (row 3)
  const headerRow = detailsSheet.getRow(3);
  const headerColumns = ['C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M'];
  const headerTexts = [
    'Participant Name',
    'Question #',
    'Question Text',
    'Question Type',
    'User Answer',
    'Correct Answer',
    'Is Correct',
    'Total Attempts',
    'Correct on Attempt',
    'Time Spent (formatted)',
    'Score'
  ];

  headerColumns.forEach((col, idx) => {
    const cell = detailsSheet.getCell(`${col}3`);
    cell.value = headerTexts[idx];
    cell.font = { name: 'Calibri', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF000000' } // Black background
    };
    cell.alignment = { horizontal: 'center', vertical: 'middle' };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF808080' } },
      left: { style: 'thin', color: { argb: 'FF808080' } },
      bottom: { style: 'thin', color: { argb: 'FF808080' } },
      right: { style: 'thin', color: { argb: 'FF808080' } }
    };
  });

  // Process question details grouped by participant
  const participantGroups = new Map();
  filtered.forEach(r => {
    const participantName = r.participantName || 'Unknown';
    if (!participantGroups.has(participantName)) {
      participantGroups.set(participantName, []);
    }
    participantGroups.get(participantName).push(r);
  });

  // Process each participant group
  participantGroups.forEach((participantResults, participantName) => {
    // Assign color to participant
    if (!participantColorMap.has(participantName)) {
      participantColorMap.set(participantName, participantColors[colorIndex % participantColors.length]);
      colorIndex++;
    }
    const rowColor = participantColorMap.get(participantName);
    
    // Track rows for this participant
    const startRow = currentRow;
    let questionCount = 0;
    let questionNumber = 1; // Start question numbering at 1 for each participant

    // Process all results for this participant
    participantResults.forEach(r => {
      if (r.questionDetails && Array.isArray(r.questionDetails) && r.questionDetails.length > 0) {
        r.questionDetails.forEach((q) => {
          questionCount++;
          currentRow++;
          
          // Format attempts as "X/3"
          const attemptsUsed = q.attempts || 0;
          const attemptsFormatted = `${attemptsUsed}/3`;
          
          // Format "Correct on Attempt"
          let correctOnAttempt = 'Not answered';
          if (q.correct_attempt) {
            if (q.correct_attempt === 1) {
              correctOnAttempt = '1st attempt';
            } else if (q.correct_attempt === 2) {
              correctOnAttempt = '2nd attempt';
            } else if (q.correct_attempt === 3) {
              correctOnAttempt = '3rd attempt';
            } else {
              correctOnAttempt = `${q.correct_attempt}th attempt`;
            }
          } else if (attemptsUsed >= 3) {
            correctOnAttempt = 'Never (used all 3 attempts)';
          }
          
          // Add row data starting from column C (skip participant name in Column C - will be merged later)
          const row = detailsSheet.getRow(currentRow);
          const rowData = [
            '', // Column C - empty (will be merged with participant name)
            questionNumber++, // Column D - Question # (increment for each question)
            q.question_text || q.questionText || 'N/A', // Column E
            q.question_type || q.questionType || 'N/A', // Column F
            q.user_answer || q.userAnswer || 'No answer', // Column G
            q.correct_answer || q.correctAnswer || 'N/A', // Column H
            q.is_correct ? 'Yes' : 'No', // Column I
            attemptsFormatted, // Column J
            correctOnAttempt, // Column K
            formatTime(q.time_spent_seconds || q.timeSpentSeconds || 0), // Column L
            q.is_correct ? 1 : 0, // Column M
          ];

          headerColumns.forEach((col, idx) => {
            const cell = row.getCell(col);
            cell.value = rowData[idx];
            cell.font = { name: 'Calibri', size: 12 };
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: rowColor }
            };
            cell.alignment = { 
              horizontal: 'center', // All cells centered (participant name will be left-aligned in merged cell)
              vertical: 'middle'
            };
            cell.border = {
              top: { style: 'thin', color: { argb: 'FF808080' } },
              left: { style: 'thin', color: { argb: 'FF808080' } },
              bottom: { style: 'thin', color: { argb: 'FF808080' } },
              right: { style: 'thin', color: { argb: 'FF808080' } }
            };
          });
        });
      }
    });

    const endRow = currentRow;
    
    // Merge participant name cell vertically (Column C)
    if (questionCount > 0) {
      detailsSheet.mergeCells(`C${startRow}:C${endRow}`);
      const mergedCell = detailsSheet.getCell(`C${startRow}`);
      mergedCell.value = participantName;
      mergedCell.font = { name: 'Calibri', size: 12 };
      mergedCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: rowColor }
      };
      mergedCell.alignment = { horizontal: 'left', vertical: 'middle' };
      mergedCell.border = {
        top: { style: 'thin', color: { argb: 'FF808080' } },
        left: { style: 'thin', color: { argb: 'FF808080' } },
        bottom: { style: 'thin', color: { argb: 'FF808080' } },
        right: { style: 'thin', color: { argb: 'FF808080' } }
      };
    }

    // Add empty row between participants for spacing
    currentRow++;
  });

  // Generate filename: QuizName_YYYY-MM-DD.xlsx
  const filename = `${cleanQuizName}_${dateStr}.xlsx`;

  // Write file using ExcelJS buffer
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
}

