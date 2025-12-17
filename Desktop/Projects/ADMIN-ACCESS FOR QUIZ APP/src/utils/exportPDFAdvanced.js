import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Advanced PDF export with filtering options
 * Supports exporting by quiz, participant, questions, with customizable data inclusion
 */
export async function exportAnalyticsToPDF(data, filters = {}) {
  const {
    scope = "all",
    quizId = "",
    participantName = "",
    includeCharts = true,
    includeSummary = true,
    includeQuestions = true,
    dateRange = "all",
    startDate = "",
    endDate = "",
    quizzes = [],
    results = [],
    difficultyRows = [],
    scoreOverTime = [],
    scoreDistribution = [],
    completionPie = [],
    avgTimePerQuiz = [],
    chartImages = {},
  } = data;

  const doc = new jsPDF({ 
    unit: 'pt', 
    format: 'a4',
    compress: false // Disable compression for better quality
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  let yPos = margin;

  // Filter data based on scope
  let filteredResults = [...results];
  if (scope === "quiz" && quizId) {
    filteredResults = filteredResults.filter(r => r.quizId === quizId);
  }
  if (scope === "participant" && participantName) {
    filteredResults = filteredResults.filter(r => 
      r.participantName?.toLowerCase().includes(participantName.toLowerCase())
    );
  }
  if (dateRange === "custom") {
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate + "T23:59:59") : null;
    filteredResults = filteredResults.filter(r => {
      const ts = r.timestamp?.toDate ? r.timestamp.toDate() : null;
      if (!ts) return false;
      if (start && ts < start) return false;
      if (end && ts > end) return false;
      return true;
    });
  }

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Analytics Report', margin, yPos);
  yPos += 25;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);
  yPos += 15;

  if (scope === "quiz" && quizId) {
    const quiz = quizzes.find(q => q.id === quizId);
    doc.text(`Quiz: ${quiz?.name || quizId}`, margin, yPos);
    yPos += 15;
  }
  if (scope === "participant" && participantName) {
    doc.text(`Participant: ${participantName}`, margin, yPos);
    yPos += 15;
  }

  // Summary Statistics with Metrics Image
  if (includeSummary) {
    yPos += 10;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary Statistics', margin, yPos);
    yPos += 20;

    // Add metrics image if available
    if (chartImages.metrics) {
      try {
        // Get image dimensions to maintain aspect ratio
        const img = new Image();
        img.src = chartImages.metrics;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        const maxWidth = pageWidth - margin * 2;
        const aspectRatio = img.height / img.width;
        const imgWidth = maxWidth;
        const imgHeight = imgWidth * aspectRatio;
        
        doc.addImage(chartImages.metrics, 'PNG', margin, yPos, imgWidth, imgHeight, undefined, 'NONE');
        yPos += imgHeight + 20;
      } catch (err) {
        console.error("Error adding metrics image:", err);
        // Fallback to text if image fails
        const totalQuizzes = scope === "quiz" && quizId ? 1 : quizzes.length;
        const totalParticipants = filteredResults.length;
        const avgScore = filteredResults.length > 0
          ? Math.round(filteredResults.reduce((sum, r) => sum + (r.percent || 0), 0) / filteredResults.length)
          : 0;
        const completed = filteredResults.filter(r => !r.pending).length;
        const completionRate = filteredResults.length > 0
          ? Math.round((completed / filteredResults.length) * 100)
          : 0;

        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.text(`Total Quizzes: ${totalQuizzes}`, margin, yPos);
        yPos += 15;
        doc.text(`Total Participants: ${totalParticipants}`, margin, yPos);
        yPos += 15;
        doc.text(`Average Score: ${avgScore}%`, margin, yPos);
        yPos += 15;
        doc.text(`Completion Rate: ${completionRate}%`, margin, yPos);
        yPos += 20;
      }
    } else {
      // Fallback to text if no image
      const totalQuizzes = scope === "quiz" && quizId ? 1 : quizzes.length;
      const totalParticipants = filteredResults.length;
      const avgScore = filteredResults.length > 0
        ? Math.round(filteredResults.reduce((sum, r) => sum + (r.percent || 0), 0) / filteredResults.length)
        : 0;
      const completed = filteredResults.filter(r => !r.pending).length;
      const completionRate = filteredResults.length > 0
        ? Math.round((completed / filteredResults.length) * 100)
        : 0;

      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(`Total Quizzes: ${totalQuizzes}`, margin, yPos);
      yPos += 15;
      doc.text(`Total Participants: ${totalParticipants}`, margin, yPos);
      yPos += 15;
      doc.text(`Average Score: ${avgScore}%`, margin, yPos);
      yPos += 15;
      doc.text(`Completion Rate: ${completionRate}%`, margin, yPos);
      yPos += 20;
    }
  }

  // Charts - Add chart images if available
  if (includeCharts) {
    yPos += 10;
    
    // Check if we need a new page
    if (yPos > pageHeight - margin - 100) {
      doc.addPage();
      yPos = margin;
    }

    // Score Over Time Chart
    if (chartImages.scoreOverTime && scoreOverTime.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Average Score Over Time', margin, yPos);
      yPos += 20;
      
      try {
        // Get image dimensions to maintain aspect ratio
        const img = new Image();
        img.src = chartImages.scoreOverTime;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        const maxWidth = pageWidth - margin * 2;
        const aspectRatio = img.height / img.width;
        const imgWidth = maxWidth;
        const imgHeight = imgWidth * aspectRatio;
        
        // Check if we need a new page before adding image
        if (yPos + imgHeight > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
        
        doc.addImage(chartImages.scoreOverTime, 'PNG', margin, yPos, imgWidth, imgHeight, undefined, 'NONE');
        yPos += imgHeight + 20;
        
        // Check if we need a new page after adding image
        if (yPos > pageHeight - margin) {
          doc.addPage();
          yPos = margin;
        }
      } catch (err) {
        console.error("Error adding score over time chart:", err);
      }
    }

    // Score Distribution Chart
    if (chartImages.scoreDistribution && scoreDistribution.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Score Distribution', margin, yPos);
      yPos += 20;
      
      try {
        // Get image dimensions to maintain aspect ratio
        const img = new Image();
        img.src = chartImages.scoreDistribution;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        const maxWidth = pageWidth - margin * 2;
        const aspectRatio = img.height / img.width;
        const imgWidth = maxWidth;
        const imgHeight = imgWidth * aspectRatio;
        
        // Check if we need a new page before adding image
        if (yPos + imgHeight > 750) {
          doc.addPage();
          yPos = margin;
        }
        
        doc.addImage(chartImages.scoreDistribution, 'PNG', margin, yPos, imgWidth, imgHeight, undefined, 'NONE');
        yPos += imgHeight + 20;
        
        // Check if we need a new page after adding image
        if (yPos > 750) {
          doc.addPage();
          yPos = margin;
        }
      } catch (err) {
        console.error("Error adding score distribution chart:", err);
      }
    }

    // Completion Pie Chart
    if (chartImages.completionPie && completionPie.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Completion Status Distribution', margin, yPos);
      yPos += 20;
      
      try {
        // Get image dimensions to maintain aspect ratio
        const img = new Image();
        img.src = chartImages.completionPie;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        const maxWidth = pageWidth - margin * 2;
        const aspectRatio = img.height / img.width;
        const imgWidth = maxWidth;
        const imgHeight = imgWidth * aspectRatio;
        
        // Check if we need a new page before adding image
        if (yPos + imgHeight > 750) {
          doc.addPage();
          yPos = margin;
        }
        
        doc.addImage(chartImages.completionPie, 'PNG', margin, yPos, imgWidth, imgHeight, undefined, 'NONE');
        yPos += imgHeight + 20;
        
        // Check if we need a new page after adding image
        if (yPos > 750) {
          doc.addPage();
          yPos = margin;
        }
      } catch (err) {
        console.error("Error adding completion pie chart:", err);
      }
    }

    // Fallback to table if no images available
    if (!chartImages.scoreDistribution && filteredResults.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Score Distribution', margin, yPos);
      yPos += 20;

      const distData = scoreDistribution.map(b => ({
        range: b.range,
        count: b.count,
      }));

      doc.autoTable({
        startY: yPos,
        head: [['Score Range', 'Count']],
        body: distData.map(d => [d.range, String(d.count)]),
        theme: 'striped',
        headStyles: { fillColor: [13, 148, 136] },
      });
      yPos = doc.lastAutoTable.finalY + 20;
    }
  }

  // Question Analysis
  if (includeQuestions && difficultyRows.length > 0) {
    let filteredQuestions = difficultyRows;
    if (scope === "quiz" && quizId) {
      filteredQuestions = filteredQuestions.filter(q => q.quizId === quizId);
    }

    if (filteredQuestions.length > 0) {
      yPos += 10;
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Question Difficulty Analysis', margin, yPos);
      yPos += 20;

      doc.autoTable({
        startY: yPos,
        head: [['Quiz', 'Question', 'Correct %', 'Difficulty']],
        body: filteredQuestions.map(q => {
          const quizName = quizzes.find(qu => qu.id === q.quizId)?.name || q.quizId;
          const difficulty = q.correctPct < 30 ? 'Hard' : q.correctPct < 60 ? 'Medium' : 'Easy';
          return [
            quizName.substring(0, 30),
            (q.questionText || 'Untitled').substring(0, 40),
            `${q.correctPct}%`,
            difficulty,
          ];
        }),
        theme: 'striped',
        headStyles: { fillColor: [13, 148, 136] },
        columnStyles: {
          0: { cellWidth: 80 },
          1: { cellWidth: 200 },
          2: { cellWidth: 60 },
          3: { cellWidth: 60 },
        },
      });
      yPos = doc.lastAutoTable.finalY + 20;
    }
  }

  // Results Table
  if (filteredResults.length > 0) {
    yPos += 10;
    if (yPos > pageHeight - margin - 100) {
      doc.addPage();
      yPos = margin;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detailed Results', margin, yPos);
    yPos += 20;

    const formatDate = (ts) => {
      if (!ts) return '—';
      const d = ts?.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString();
    };

    const formatTime = (s) => {
      const sec = Number(s) || 0;
      const mm = String(Math.floor(sec / 60)).padStart(2, '0');
      const ss = String(sec % 60).padStart(2, '0');
      return `${mm}:${ss}`;
    };

    doc.autoTable({
      startY: yPos,
      head: [['Participant', 'Quiz', 'Score', '%', 'Correct', 'Incorrect', 'Pending', 'Time', 'Date']],
      body: filteredResults.map(r => [
        (r.participantName || 'Unknown').substring(0, 20),
        (r.quizName || 'Untitled').substring(0, 20),
        `${r.score || 0}/${r.total || 0}`,
        `${r.percent || 0}%`,
        String(r.correct || 0),
        String(r.incorrect || 0),
        String(r.pending || 0),
        formatTime(r.timeSpent || 0),
        formatDate(r.timestamp),
      ]),
      theme: 'striped',
      headStyles: { fillColor: [13, 148, 136] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 60 },
        2: { cellWidth: 40 },
        3: { cellWidth: 30 },
        4: { cellWidth: 30 },
        5: { cellWidth: 30 },
        6: { cellWidth: 30 },
        7: { cellWidth: 40 },
        8: { cellWidth: 50 },
      },
    });
  }

  // Save PDF
  const filename = `analytics-${scope === "quiz" ? quizId : scope === "participant" ? participantName : "all"}-${Date.now()}.pdf`;
  doc.save(filename);
}

/**
 * Export results to PDF with filters
 */
export function exportResultsToPDF(results, filters = {}) {
  const {
    scope = "all",
    quizId = "",
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
      const ts = r.timestamp?.toDate ? r.timestamp.toDate() : null;
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

  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;
  let yPos = margin;

  // Header
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Quiz Results Report', margin, yPos);
  yPos += 25;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated: ${new Date().toLocaleString()}`, margin, yPos);
  yPos += 15;

  if (scope === "quiz" && quizId) {
    doc.text(`Quiz ID: ${quizId}`, margin, yPos);
    yPos += 15;
  }
  if (scope === "participant" && participantName) {
    doc.text(`Participant: ${participantName}`, margin, yPos);
    yPos += 15;
  }
  if (dateRange === "custom") {
    doc.text(`Date Range: ${startDate} to ${endDate}`, margin, yPos);
    yPos += 15;
  }

  yPos += 10;

  // Results Table
  const formatDate = (ts) => {
    if (!ts) return '—';
    const d = ts?.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleString();
  };

  const formatTime = (s) => {
    const sec = Number(s) || 0;
    const mm = String(Math.floor(sec / 60)).padStart(2, '0');
    const ss = String(sec % 60).padStart(2, '0');
    return `${mm}:${ss}`;
  };

  doc.autoTable({
    startY: yPos,
    head: [['Participant', 'Quiz', 'Score', '%', 'Correct', 'Incorrect', 'Pending', 'Time', 'Date']],
    body: filtered.map(r => [
      (r.participantName || 'Unknown').substring(0, 20),
      (r.quizName || 'Untitled').substring(0, 20),
      `${r.score || 0}/${r.total || 0}`,
      `${r.percent || 0}%`,
      String(r.correct || 0),
      String(r.incorrect || 0),
      String(r.pending || 0),
      formatTime(r.timeSpent || 0),
      formatDate(r.timestamp),
    ]),
    theme: 'striped',
    headStyles: { fillColor: [13, 148, 136] },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 60 },
      2: { cellWidth: 40 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 30 },
      6: { cellWidth: 30 },
      7: { cellWidth: 40 },
      8: { cellWidth: 50 },
    },
  });

  // Save PDF
  const filename = `results-${scope === "quiz" ? quizId : scope === "participant" ? participantName : "all"}-${Date.now()}.pdf`;
  doc.save(filename);
}

