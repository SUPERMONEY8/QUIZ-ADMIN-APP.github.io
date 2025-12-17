import { resultOperations } from "./databaseConfig";

/**
 * saveQuizResults - Save quiz results to Supabase
 * 
 * Note: This function is now primarily for analytics/backward compatibility.
 * The main results and question_attempts are already saved during quiz taking.
 * 
 * @param {string} participantName - Participant's name
 * @param {string} quizId - Quiz ID
 * @param {Array} answers - Array of answer objects
 * @param {number} score - Final score
 * @param {number} timeSpent - Time spent in seconds
 * @param {Object} attemptData - Additional attempt data { resultId, ownerId, totalPossible, etc. }
 * @returns {Promise<string>} resultId
 */
export default async function saveQuizResults(participantName, quizId, answers, score, timeSpent, attemptData = {}) {
  try {
    if (!quizId) throw new Error("quizId is required");
    
    // If resultId is provided, the result is already saved, just return it
    if (attemptData?.resultId) {
      return attemptData.resultId;
    }

    // Otherwise, create a new result (shouldn't normally happen as result is created at quiz start)
    const totalPossible = inferTotalPossible(answers, attemptData);
    
    const resultId = await resultOperations.create({
      quiz_id: quizId,
      participant_name: participantName || "",
      total_score: Number(score) || 0,
      max_score: Number(totalPossible) || 0,
      time_spent_seconds: timeSpent || 0,
      completed_at: new Date().toISOString(),
    });

    if (!resultId) {
      throw new Error("Failed to create result record");
    }

    // Note: Question attempts can be saved separately if needed
    // For now, we just save the main result
    
    return resultId;
  } catch (err) {
    console.error("Error saving quiz results:", err);
    const message = err?.message || "Failed to save quiz results";
    throw new Error(message);
  }
}

function inferTotalPossible(answers, attemptData) {
  if (attemptData && typeof attemptData.totalPossible === "number") return attemptData.totalPossible;
  if (!Array.isArray(answers)) return 0;
  // If answers carry pointsPossible per entry, sum them
  const sum = answers.reduce((acc, a) => acc + (Number(a.pointsPossible) || 0), 0);
  return sum;
}


