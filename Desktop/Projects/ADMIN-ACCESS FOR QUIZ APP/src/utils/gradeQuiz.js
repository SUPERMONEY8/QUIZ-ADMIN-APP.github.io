// gradeQuiz
// Inputs:
// - answers: Array of participant answer records. Expected fields per record:
//   { questionId, type, selectedIndex?, selectedTruth?, shortAnswer?, attemptNumber? }
//   There may be multiple entries per question (multiple attempts).
// - questions: Array of quiz questions. Expected fields per question:
//   { id, type, correctIndex?, correctAnswer? }
//
// Scoring policy:
// - Multiple choice (type === 'multiple_choice'): award 1 point if selectedIndex === correctIndex
// - True/false (type === 'true_false'): award 1 point if selectedTruth === correctAnswer
// - Short answer (type === 'short_answer'): always pending manual review, award 0 initially
//
// Returns:
// {
//   totalScore,            // number
//   maxScore,              // number (count of auto-gradable questions: MC/TF)
//   correct,               // number of questions correct (MC/TF)
//   incorrect,             // number of questions incorrect (MC/TF unanswered or answered incorrectly)
//   pending,               // number of short answer questions
//   byQuestion: Array<{
//     questionId,
//     type,
//     isCorrect,           // boolean | null for short answer
//     pending,             // boolean
//     attemptNumberCorrect,// number | null
//     awardedPoints        // 1 or 0
//   }>
// }

export default function gradeQuiz(answers, questions) {
  const questionById = new Map();
  for (const q of questions || []) questionById.set(q.id, q);

  // Group answers by questionId
  const answersByQ = new Map();
  for (const a of answers || []) {
    if (!a || !a.questionId) continue;
    const list = answersByQ.get(a.questionId) || [];
    list.push(a);
    answersByQ.set(a.questionId, list);
  }

  let totalScore = 0;
  let correct = 0;
  let incorrect = 0;
  let pending = 0;
  let maxScore = 0;
  const byQuestion = [];

  for (const q of questions || []) {
    const qAnswers = (answersByQ.get(q.id) || []).slice();
    // Sort by attemptNumber ascending if present, else stable
    qAnswers.sort((a, b) => (num(a.attemptNumber) - num(b.attemptNumber)) || 0);

    if (q.type === 'short_answer') {
      const questionPoints = Number(q.points) || 1;
      maxScore += questionPoints;
      pending += 1;
      byQuestion.push({
        questionId: q.id,
        type: q.type,
        isCorrect: null,
        pending: true,
        attemptNumberCorrect: null,
        awardedPoints: 0,
        pointsPossible: questionPoints,
      });
      continue;
    }

    // Auto-gradable question
    const questionPoints = Number(q.points) || 1;
    maxScore += questionPoints;
    let isCorrect = false;
    let attemptNumberCorrect = null;

    for (const a of qAnswers) {
      if (q.type === 'multiple_choice') {
        if (typeof q.correctIndex === 'number' && typeof a.selectedIndex === 'number' && a.selectedIndex === q.correctIndex) {
          isCorrect = true;
          attemptNumberCorrect = num(a.attemptNumber) || attemptNumberCorrect || 1;
          break;
        }
      } else if (q.type === 'true_false') {
        if (typeof q.correctAnswer === 'boolean' && typeof a.selectedTruth === 'boolean' && a.selectedTruth === q.correctAnswer) {
          isCorrect = true;
          attemptNumberCorrect = num(a.attemptNumber) || attemptNumberCorrect || 1;
          break;
        }
      }
    }

    const awardedPoints = isCorrect ? questionPoints : 0;
    totalScore += awardedPoints;
    if (isCorrect) correct += 1; else incorrect += 1;

    byQuestion.push({
      questionId: q.id,
      type: q.type,
      isCorrect,
      pending: false,
      attemptNumberCorrect,
      awardedPoints,
      pointsPossible: questionPoints,
    });
  }

  return { totalScore, maxScore, correct, incorrect, pending, byQuestion };
}

function num(n) {
  const v = Number(n);
  return Number.isFinite(v) ? v : 0;
}


