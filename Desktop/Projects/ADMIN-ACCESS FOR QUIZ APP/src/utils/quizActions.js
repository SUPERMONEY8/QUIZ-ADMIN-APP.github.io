import { quizOperations, questionOperations } from './databaseConfig';

/**
 * Duplicate a quiz and its questions.
 * - New quiz title: "[Original Title] - Copy"
 * - Marks as draft
 * - Ensures archived: false
 *
 * @param {string} quizId
 * @param {string} adminId - Admin ID to assign the new quiz to
 * @returns {Promise<string>} newQuizId
 */
export async function duplicateQuiz(quizId, adminId) {
  if (!quizId) throw new Error('quizId is required');
  if (!adminId) throw new Error('adminId is required');

  // Fetch original quiz
  const originalQuiz = await quizOperations.get(quizId);

  if (!originalQuiz) {
    throw new Error('Quiz not found');
  }

  // Build new quiz data
  const newQuizData = {
    title: `${originalQuiz.title ?? 'Quiz'} - Copy`,
    description: originalQuiz.description,
    duration_minutes: originalQuiz.duration_minutes,
    difficulty: originalQuiz.difficulty,
    randomize_questions: originalQuiz.randomize_questions,
    randomize_answers: originalQuiz.randomize_answers,
    show_answers_after: originalQuiz.show_answers_after,
    max_attempts_per_question: originalQuiz.max_attempts_per_question,
    max_attempts_per_user: originalQuiz.max_attempts_per_user,
    status: 'draft',
    archived: false,
    admin_id: adminId,
    start_date: originalQuiz.start_date,
    end_date: originalQuiz.end_date,
  };

  // Insert new quiz
  const newQuizId = await quizOperations.create(newQuizData);

  if (!newQuizId) {
    throw new Error('Failed to create duplicate quiz');
  }

  // Fetch and copy questions
  const questions = await questionOperations.getByQuiz(quizId);

  if (questions && questions.length > 0) {
    // Prepare questions for insertion
    const newQuestions = questions.map((q, index) => ({
      quiz_id: newQuizId,
      question_text: q.question_text || q.text,
      question_type: q.question_type || q.type,
      image_url: q.image_url || q.imageUrl,
      video_url: q.video_url || q.videoUrl,
      points: q.points,
      correct_answer: q.correct_answer || q.correctAnswer,
      options: q.options,
      question_order: q.question_order || q.orderIndex || index,
    }));

    // Insert all questions
    try {
      for (const question of newQuestions) {
        await questionOperations.create(question);
      }
    } catch (err) {
      console.error('Error copying questions:', err);
      // Still return the quiz ID even if questions failed to copy
    }
  }

  return newQuizId;
}

/**
 * Archive a quiz (marks archived = true). Does not delete.
 * @param {string} quizId
 * @returns {Promise<void>}
 */
export async function archiveQuiz(quizId) {
  if (!quizId) throw new Error('quizId is required');
  await quizOperations.update(quizId, { archived: true });
}

/**
 * Restore a previously archived quiz (sets archived = false).
 * @param {string} quizId
 * @returns {Promise<void>}
 */
export async function restoreQuiz(quizId) {
  if (!quizId) throw new Error('quizId is required');
  await quizOperations.update(quizId, { archived: false });
}