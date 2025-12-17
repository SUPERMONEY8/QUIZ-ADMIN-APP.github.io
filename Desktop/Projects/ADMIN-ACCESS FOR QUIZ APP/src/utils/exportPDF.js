// Note: Requires 'jspdf' and (optionally) 'jspdf-autotable' installed:
// npm install jspdf jspdf-autotable
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Generate and download a printable PDF report for quiz result(s).
 *
 * Accepts either a single result object or an array of result objects.
 *
 * Expected result shape (flexible; tries common keys):
 * {
 *   participantName,
 *   quizName,
 *   score,
 *   percentage,
 *   correct,
 *   incorrect,
 *   pending,
 *   date,
 *   timeTaken,
 *   questions: [
 *     { index, question, text, q, givenAnswer, answer, correctAnswer, isCorrect, timeTaken }
 *   ]
 * }
 *
 * @param {Object|Object[]} resultData
 */
export function exportToPDF(resultData) {
  const results = Array.isArray(resultData) ? resultData : [resultData];
  if (!results.length) return;

  const formatDate = (val) => {
    if (!val) return '';
    const d = val instanceof Date ? val : new Date(val);
    if (Number.isNaN(d.getTime())) return String(val);
    return d.toLocaleDateString();
  };

  const formatTimestamp = (d = new Date()) => {
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
  };

  const formatTimeTaken = (val) => {
    if (val == null || val === '') return '';
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

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;

  results.forEach((r, idx) => {
    if (idx > 0) doc.addPage();

    // Header: Quiz name and date
    const quizName = r.quizName ?? r.quiz?.title ?? r.quiz?.name ?? 'Quiz';
    const dateStr = formatDate(r.date ?? r.createdAt ?? new Date());
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(quizName, margin, 60);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Date: ${dateStr}`, pageWidth - margin, 60, { align: 'right' });

    // Participant name
    const participant = r.participantName ?? r.participant?.name ?? r.participant?.fullName ?? 'Participant';
    doc.setFontSize(11);
    doc.text(`Participant: ${participant}`, margin, 90);

    // Large final score
    const scoreDisplay = (r.score != null ? String(r.score) : '') +
      (r.percentage != null ? ` (${typeof r.percentage === 'number' ? r.percentage.toFixed(2) + '%' : r.percentage})` : '');
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(scoreDisplay || 'Score: —', margin, 140);

    // Summary stats box
    const statsY = 160;
    const statBoxHeight = 50;
    const boxX = margin;
    const boxWidth = contentWidth;
    doc.setDrawColor(200);
    doc.rect(boxX, statsY, boxWidth, statBoxHeight); // outer box

    const statPadding = 10;
    const colWidth = (boxWidth - statPadding * 2) / 3;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const correct = r.correct ?? r.summary?.correct ?? '';
    const incorrect = r.incorrect ?? r.summary?.incorrect ?? '';
    const pending = r.pending ?? r.summary?.pending ?? '';
    doc.text(`Correct: ${String(correct)}`, boxX + statPadding, statsY + 18);
    doc.text(`Incorrect: ${String(incorrect)}`, boxX + statPadding + colWidth, statsY + 18);
    doc.text(`Pending: ${String(pending)}`, boxX + statPadding + colWidth * 2, statsY + 18);

    // Time taken / duration (if present)
    const timeTaken = r.timeTaken ?? r.duration ?? '';
    if (timeTaken !== '') {
      doc.text(`Time Taken: ${formatTimeTaken(timeTaken)}`, boxX + statPadding, statsY + 36);
    }

    // Question-by-question breakdown using autoTable if available
    const questions = Array.isArray(r.questions) ? r.questions : (r.items ?? []);
    if (questions && questions.length) {
      // Build table columns
      const head = [['#', 'Question', 'Your Answer', 'Correct Answer', 'Result', 'Time']];
      const body = questions.map((q, i) => {
        const idxLabel = q.index ?? (q.no ?? i + 1);
        const questionText = q.question ?? q.text ?? q.q ?? '';
        const given = q.givenAnswer ?? q.given ?? q.answer ?? q.selected ?? '';
        const correctAns = q.correctAnswer ?? q.answerKey ?? q.answer ?? '';
        const isCorrect = q.isCorrect ?? (typeof q.correct === 'boolean' ? q.correct : null);
        const resultLabel = isCorrect === true ? 'Correct' : isCorrect === false ? 'Incorrect' : (q.status ?? '');
        const qTime = q.timeTaken ?? q.duration ?? '';
        return [
          String(idxLabel),
          String(questionText),
          String(given),
          String(correctAns),
          String(resultLabel),
          String(formatTimeTaken(qTime)),
        ];
      });

      // Reserve space below stats box
      const startY = statsY + statBoxHeight + 20;
      // Try to use autoTable for nicer formatting
      if (typeof doc.autoTable === 'function') {
        doc.autoTable({
          head,
          body,
          startY,
          theme: 'grid',
          styles: { font: 'helvetica', fontSize: 9 },
          headStyles: { fillColor: [230, 230, 230] },
          columnStyles: {
            0: { cellWidth: 30 }, // # column
            1: { cellWidth: 220 }, // question
            2: { cellWidth: 120 },
            3: { cellWidth: 120 },
            4: { cellWidth: 70 },
            5: { cellWidth: 60 },
          },
          didDrawPage: (data) => {
            // Footer with timestamp on each page
            const footer = `Generated: ${formatTimestamp()}`;
            doc.setFontSize(9);
            doc.setTextColor(120);
            doc.text(footer, margin, doc.internal.pageSize.getHeight() - 30);
            // Optional page numbering
            const pageStr = `Page ${doc.internal.getNumberOfPages()}`;
            doc.text(pageStr, pageWidth - margin, doc.internal.pageSize.getHeight() - 30, { align: 'right' });
          },
        });
      } else {
        // Fallback: simple text list if autoTable not available
        let y = startY;
        doc.setFontSize(10);
        const lineHeight = 14;
        questions.forEach((row, i) => {
          const qIndex = row.index ?? (row.no ?? i + 1);
          const qText = (row.question ?? row.text ?? row.q ?? '').replace(/\s+/g, ' ').trim();
          const given = row.givenAnswer ?? row.given ?? row.answer ?? row.selected ?? '';
          const correctAns = row.correctAnswer ?? row.answerKey ?? row.answer ?? '';
          const isCorrect = row.isCorrect ?? (typeof row.correct === 'boolean' ? row.correct : null);
          const resultLabel = isCorrect === true ? 'Correct' : isCorrect === false ? 'Incorrect' : (row.status ?? '');
          const qTime = formatTimeTaken(row.timeTaken ?? row.duration ?? '');
          const line = `${qIndex}. ${qText}`;
          const wrapWidth = contentWidth;
          doc.text(line, margin, y);
          y += lineHeight;
          doc.setFontSize(9);
          doc.text(`Answer: ${given}    Correct: ${correctAns}    Result: ${resultLabel}    Time: ${qTime}`, margin + 10, y);
          y += lineHeight;
          if (y > doc.internal.pageSize.getHeight() - 80) {
            // footer before adding page
            const footer = `Generated: ${formatTimestamp()}`;
            doc.setFontSize(9);
            doc.setTextColor(120);
            doc.text(footer, margin, doc.internal.pageSize.getHeight() - 30);
            doc.addPage();
            y = margin;
            doc.setFontSize(10);
          }
        });

        // final footer for last page
        const footer = `Generated: ${formatTimestamp()}`;
        doc.setFontSize(9);
        doc.setTextColor(120);
        doc.text(footer, margin, doc.internal.pageSize.getHeight() - 30);
      }
    } else {
      // If no questions, still add footer
      const footer = `Generated: ${formatTimestamp()}`;
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text(footer, margin, doc.internal.pageSize.getHeight() - 30);
    }
  });

  // Trigger download
  doc.save('quiz-result.pdf');
}