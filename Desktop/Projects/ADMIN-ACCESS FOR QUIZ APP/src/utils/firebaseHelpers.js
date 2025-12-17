import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebaseConfig';

// Helper to convert Firestore timestamp to seconds (for compatibility)
export const toSeconds = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.seconds) return timestamp.seconds;
  if (timestamp instanceof Timestamp) return timestamp.seconds;
  if (timestamp instanceof Date) return Math.floor(timestamp.getTime() / 1000);
  return null;
};

// Helper to convert seconds to Firestore timestamp
export const fromSeconds = (seconds) => {
  if (!seconds) return null;
  return Timestamp.fromMillis(seconds * 1000);
};

// Helper to convert Firestore data to app format
export const transformQuiz = (doc) => {
  if (!doc.exists()) return null;
  const data = doc.data();
  return {
    id: doc.id,
    name: data.title || data.name,
    title: data.title || data.name,
    description: data.description,
    durationMinutes: data.duration_minutes || data.durationMinutes,
    difficulty: data.difficulty,
    randomizeQuestions: data.randomize_questions || data.randomizeQuestions,
    randomizeAnswers: data.randomize_answers || data.randomizeAnswers,
    status: data.status,
    archived: data.archived || false,
    createdAt: data.createdAt ? { seconds: toSeconds(data.createdAt) } : (data.created_at ? { seconds: toSeconds(data.created_at) } : null),
    updatedAt: data.updatedAt ? { seconds: toSeconds(data.updatedAt) } : (data.updated_at ? { seconds: toSeconds(data.updated_at) } : null),
    publishedAt: data.publishedAt ? { seconds: toSeconds(data.publishedAt) } : (data.published_at ? { seconds: toSeconds(data.published_at) } : null),
    startAt: data.start_date || data.startAt,
    endAt: data.end_date || data.endAt,
    shareCode: data.share_code || data.shareCode || "",
    ownerId: data.admin_id || data.ownerId,
    admin_id: data.admin_id || data.ownerId,
    is_published: data.is_published !== undefined ? data.is_published : (data.status === "published"),
    share_code: data.share_code || data.shareCode || "",
    published_at: data.published_at || data.publishedAt,
    duration_minutes: data.duration_minutes || data.durationMinutes,
    randomize_questions: data.randomize_questions || data.randomizeQuestions,
    randomize_answers: data.randomize_answers || data.randomizeAnswers,
  };
};

// Helper to convert Firestore question data
export const transformQuestion = (doc) => {
  if (!doc.exists()) return null;
  const data = doc.data();
  return {
    id: doc.id,
    quiz_id: data.quiz_id || data.quizId,
    question_text: data.question_text || data.text,
    text: data.question_text || data.text,
    question_type: data.question_type || data.type,
    type: data.question_type || data.type,
    options: data.options,
    correct_answer: data.correct_answer || data.correctAnswer,
    correctAnswer: data.correct_answer || data.correctAnswer,
    points: data.points,
    question_order: data.question_order || data.orderIndex || 0,
    orderIndex: data.question_order || data.orderIndex || 0,
    image_url: data.image_url || data.imageUrl,
    imageUrl: data.image_url || data.imageUrl,
    video_url: data.video_url || data.videoUrl,
    videoUrl: data.video_url || data.videoUrl,
    status: data.status || "published",
  };
};

// Quiz operations
export const quizOperations = {
  // Get single quiz
  get: async (quizId) => {
    if (!quizId || quizId.startsWith('temp-')) {
      console.warn("Invalid quizId:", quizId);
      return null;
    }
    try {
      const docRef = doc(db, 'quizzes', quizId);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.warn("Quiz document does not exist:", quizId);
        return null;
      }
      return transformQuiz(docSnap);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      throw error;
    }
  },

  // Get quizzes by admin
  getByAdmin: async (adminId) => {
    // Fetch without orderBy to avoid index requirement, then sort in JS
    const q = query(
      collection(db, 'quizzes'),
      where('admin_id', '==', adminId)
    );
    const snapshot = await getDocs(q);
    const quizzes = snapshot.docs.map(transformQuiz).filter(Boolean);
    
    // Sort by created_at descending (newest first)
    return quizzes.sort((a, b) => {
      const aTime = a.createdAt?.seconds || a.created_at?.seconds || 0;
      const bTime = b.createdAt?.seconds || b.created_at?.seconds || 0;
      return bTime - aTime; // descending
    });
  },

  // Create quiz
  create: async (data) => {
    const docRef = await addDoc(collection(db, 'quizzes'), {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    return docRef.id;
  },

  // Update quiz
  update: async (quizId, data) => {
    const docRef = doc(db, 'quizzes', quizId);
    // Convert published_at ISO string to Firestore Timestamp if present
    const updateData = { ...data };
    if (updateData.published_at && typeof updateData.published_at === 'string') {
      updateData.published_at = Timestamp.fromDate(new Date(updateData.published_at));
    }
    await updateDoc(docRef, {
      ...updateData,
      updated_at: serverTimestamp(),
    });
  },

  // Delete quiz
  delete: async (quizId) => {
    const docRef = doc(db, 'quizzes', quizId);
    await deleteDoc(docRef);
  },
};

// Question operations
export const questionOperations = {
  // Get questions by quiz
  getByQuiz: async (quizId) => {
    // Fetch without orderBy to avoid index requirement, then sort in JS
    const q = query(
      collection(db, 'questions'),
      where('quiz_id', '==', quizId)
    );
    const snapshot = await getDocs(q);
    const questions = snapshot.docs.map(transformQuestion).filter(Boolean);
    
    // Sort by question_order ascending
    return questions.sort((a, b) => {
      const aOrder = a.question_order || a.orderIndex || 0;
      const bOrder = b.question_order || b.orderIndex || 0;
      return aOrder - bOrder; // ascending
    });
  },

  // Create question
  create: async (data) => {
    const docRef = await addDoc(collection(db, 'questions'), {
      ...data,
      created_at: serverTimestamp(),
      updated_at: serverTimestamp(),
    });
    return docRef.id;
  },

  // Update question
  update: async (questionId, data) => {
    const docRef = doc(db, 'questions', questionId);
    await updateDoc(docRef, {
      ...data,
      updated_at: serverTimestamp(),
    });
  },

  // Delete question
  delete: async (questionId) => {
    const docRef = doc(db, 'questions', questionId);
    await deleteDoc(docRef);
  },
};

// Results operations
export const resultOperations = {
  // Create result
  create: async (data) => {
    const docRef = await addDoc(collection(db, 'results'), {
      ...data,
      created_at: serverTimestamp(),
      completed_at: data.completed_at ? Timestamp.fromDate(new Date(data.completed_at)) : serverTimestamp(),
    });
    return docRef.id;
  },

  // Get results by quiz
  getByQuiz: async (quizId) => {
    // Fetch without orderBy to avoid index requirement, then sort in JS
    const q = query(
      collection(db, 'results'),
      where('quiz_id', '==', quizId)
    );
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    // Sort by completed_at descending (newest first)
    return results.sort((a, b) => {
      const aTime = a.completed_at?.seconds || (a.completed_at instanceof Date ? a.completed_at.getTime() / 1000 : 0);
      const bTime = b.completed_at?.seconds || (b.completed_at instanceof Date ? b.completed_at.getTime() / 1000 : 0);
      return bTime - aTime; // descending
    });
  },
};

