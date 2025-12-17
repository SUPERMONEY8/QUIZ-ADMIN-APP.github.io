import React, { useEffect, useState } from 'react';
import { quizOperations, resultOperations } from '../utils/databaseConfig';
import useAuth from '../hooks/useAuth';
import { Trash2, Eye, ChevronUp } from 'lucide-react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { t } from '../store/translations';

/**
 * ParticipantManagement
 * - Lists all unique participants from results table (ONLY from quiz results)
 * - Shows quiz results per participant
 * - Delete participant results (with confirmation)
 */
export default function ParticipantManagement() {
  const { user } = useAuth();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [expandedParticipant, setExpandedParticipant] = useState(null);

  // modal state
  const [confirm, setConfirm] = useState({ open: false, type: '', participant: null });

  useEffect(() => {
    if (user?.id || user?.uid) {
      fetchParticipants();
    }
  }, [user]);

  async function fetchParticipants() {
    if (!user?.id && !user?.uid) return;
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const adminId = user?.id || user?.uid || 'admin-access-direct';

      // Get all quizzes for this admin using Firebase
      const quizzesList = await quizOperations.getByAdmin(adminId);
      
      if (quizzesList.length === 0) {
        setParticipants([]);
        setLoading(false);
        return;
      }

      const quizIds = quizzesList.map((q) => q.id);

      // Get all results for these quizzes - ONLY from quiz results (when they take quiz)
      const allResults = [];
      for (const quizId of quizIds) {
        try {
          const quizResults = await resultOperations.getByQuiz(quizId);
          allResults.push(...quizResults);
        } catch (err) {
          console.error(`Error loading results for quiz ${quizId}:`, err);
        }
      }

      // Group by participant_name and calculate stats
      const participantMap = new Map();
      
      allResults.forEach((result) => {
        const participantName = result.participant_name;
        // Only include participants who have a name (from quiz results)
        if (!participantName || participantName === "Anonymous") return;

        if (!participantMap.has(participantName)) {
          participantMap.set(participantName, {
            name: participantName,
            quizzesTaken: new Set(),
            totalScore: 0,
            totalQuestions: 0,
            lastAttempt: null,
            results: [],
          });
        }

        const participant = participantMap.get(participantName);
        participant.quizzesTaken.add(result.quiz_id);
        participant.totalScore += Number(result.total_score) || 0;
        participant.totalQuestions += Number(result.total_questions) || 0;
        
        // Handle Firebase timestamp format
        let completedAt = null;
        if (result.completed_at) {
          if (result.completed_at.seconds) {
            completedAt = new Date(result.completed_at.seconds * 1000);
          } else if (result.completed_at instanceof Date) {
            completedAt = result.completed_at;
          } else if (typeof result.completed_at === 'string') {
            completedAt = new Date(result.completed_at);
          }
        }
        
        if (completedAt && (!participant.lastAttempt || completedAt > participant.lastAttempt)) {
          participant.lastAttempt = completedAt;
        }

        participant.results.push({
          id: result.id,
          quizId: result.quiz_id,
          totalScore: Number(result.total_score) || 0,
          totalQuestions: Number(result.total_questions) || 0,
          completedAt: completedAt,
        });
      });

      // Convert to array and add quiz names
      const participantsList = Array.from(participantMap.values()).map((p) => {
        const quizNames = Array.from(p.quizzesTaken).map((qId) => {
          const quiz = quizzesList.find((q) => q.id === qId);
          return { id: qId, name: quiz?.title || quiz?.name || "Unknown" };
        });

        const averageScore = p.totalQuestions > 0 
          ? Math.round((p.totalScore / p.totalQuestions) * 100) 
          : 0;

        return {
          name: p.name,
          quizzesTaken: p.quizzesTaken.size,
          quizNames: quizNames,
          totalScore: p.totalScore,
          totalQuestions: p.totalQuestions,
          averageScore: averageScore,
          lastAttempt: p.lastAttempt,
          results: p.results,
        };
      });

      // Sort by name
      participantsList.sort((a, b) => a.name.localeCompare(b.name));

      setParticipants(participantsList);
    } catch (err) {
      console.error("Error fetching participants:", err);
      setError(err?.message || 'Failed to load participants.');
    } finally {
      setLoading(false);
    }
  }

  function openDeleteParticipant(participant) {
    setConfirm({ open: true, type: 'delete-participant', participant });
  }

  async function performConfirmAction() {
    const { type, participant } = confirm;
    if (!participant) {
      setConfirm({ open: false, type: '', participant: null });
      return;
    }

    setActionLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      if (type === 'delete-participant') {
        await deleteParticipantResults(participant.name);
        setSuccess(`${t("participants.allResultsDeleted")} "${participant.name}" ${t("participants.haveBeenDeleted")}`);
      }
      await fetchParticipants();
      setTimeout(() => setSuccess(null), 5000);
    } catch (err) {
      console.error("Error performing action:", err);
      setError(err?.message || 'Action failed. Check console for details.');
    } finally {
      setActionLoading(false);
      setConfirm({ open: false, type: '', participant: null });
    }
  }

  // Delete all results for a participant using Firebase
  async function deleteParticipantResults(participantName) {
    if (!participantName) {
      throw new Error("Participant name is required");
    }

    // Get all result documents for this participant
    const q = query(
      collection(db, 'results'),
      where('participant_name', '==', participantName)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return; // No results to delete
    }

    // Delete all results
    const deletePromises = snapshot.docs.map((docSnapshot) => 
      deleteDoc(doc(db, 'results', docSnapshot.id))
    );
    
    await Promise.all(deletePromises);
  }

  function formatDate(d) {
    if (!d) return '—';
    try {
      const dt = d instanceof Date ? d : new Date(d);
      return dt.toLocaleString();
    } catch {
      return String(d);
    }
  }

  const toggleParticipantHistory = (participantName) => {
    setExpandedParticipant(expandedParticipant === participantName ? null : participantName);
  };

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t("participants.title")}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {t("participants.viewParticipants")}
          </p>
        </div>
        <button
          onClick={fetchParticipants}
          className="medical-button"
          disabled={loading}
        >
          {loading ? t("common.loading") : t("participants.refresh")}
        </button>
      </div>

      {error && (
        <div className="mb-4 rounded-md bg-red-50 dark:bg-red-900/20 p-4 text-sm text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 rounded-md bg-green-50 dark:bg-green-900/20 p-4 text-sm text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800">
          {success}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-8 w-8 border-2 border-medical-600 border-t-transparent rounded-full"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">{t("participants.loadingParticipants")}</span>
        </div>
      ) : participants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-gray-400">{t("participants.noParticipantsFound")}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            {t("participants.participantsWillAppear")}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {participants.map((p) => {
            const isExpanded = expandedParticipant === p.name;
            return (
              <div
                key={p.name}
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                {/* Participant Row */}
                <div className="bg-white dark:bg-gray-800 p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("participants.name")}</div>
                        <div className="text-base font-semibold text-gray-900 dark:text-white mt-1">{p.name}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("participants.quizzesTaken")}</div>
                        <div className="text-base text-gray-900 dark:text-white mt-1">{p.quizzesTaken}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("participants.averageScore")}</div>
                        <div className="text-base text-gray-900 dark:text-white mt-1">{p.averageScore}%</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("participants.totalScore")}</div>
                        <div className="text-base text-gray-900 dark:text-white mt-1">{p.totalScore} / {p.totalQuestions}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{t("participants.lastAttempt")}</div>
                        <div className="text-base text-gray-900 dark:text-white mt-1">{formatDate(p.lastAttempt)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => toggleParticipantHistory(p.name)}
                        className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400 transition-colors"
                        title={t("participants.viewQuizResults")}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                      <button
                        onClick={() => openDeleteParticipant(p)}
                        className="p-2 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors"
                        title={t("participants.deleteAllResults")}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Expanded History */}
                {isExpanded && (
                  <div className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                      {t("participants.quizResultsFor")} {p.name}
                    </h3>
                    
                    {/* Quiz Results */}
                    <div className="mb-6">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">{t("participants.results")}</h4>
                      <div className="space-y-2">
                        {p.results.length === 0 ? (
                          <p className="text-sm text-gray-500 dark:text-gray-400">{t("participants.noResultsFound")}</p>
                        ) : (
                          p.results.map((result, idx) => {
                            const quiz = p.quizNames.find((q) => q.id === result.quizId);
                            const resultPercent = result.totalQuestions > 0 
                              ? Math.round((result.totalScore / result.totalQuestions) * 100) 
                              : 0;
                            return (
                              <div
                                key={idx}
                                className="bg-white dark:bg-gray-800 rounded-md p-3 border border-gray-200 dark:border-gray-700 flex items-center justify-between"
                              >
                                <div className="flex-1">
                                  <div className="font-medium text-gray-900 dark:text-white">
                                    {quiz?.name || "Unknown Quiz"}
                                  </div>
                                  <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {t("analytics.score")}: {result.totalScore} / {result.totalQuestions} ({resultPercent}%) • {formatDate(result.completedAt)}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal */}
      {confirm.open && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 dark:bg-black/70 backdrop-blur-sm"
          onClick={() => !actionLoading && setConfirm({ open: false, type: '', participant: null })}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-lg w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {t("participants.deleteAllResultsTitle")}
            </h3>
            <div className="mb-4">
              <div className="space-y-2">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  {t("participants.areYouSureDelete")}
                </p>
                <p className="text-base font-semibold text-gray-900 dark:text-white bg-red-50 dark:bg-red-900/20 p-3 rounded border border-red-200 dark:border-red-800">
                  {confirm.participant?.name}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  {t("participants.deleteWarning")}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirm({ open: false, type: '', participant: null })}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                disabled={actionLoading}
              >
                {t("common.cancel")}
              </button>
              <button
                onClick={performConfirmAction}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={actionLoading}
              >
                {actionLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    {t("participants.processing")}
                  </span>
                ) : (
                  t("participants.deleteAllResults")
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
