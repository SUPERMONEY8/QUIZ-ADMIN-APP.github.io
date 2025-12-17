// PostgreSQL API Helpers - Uses Node.js API with Neon PostgreSQL
import { getOrCreateUserId, getCurrentUserId } from './userManager.js';

// Determine API URL based on environment
const getApiUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're in production (deployed)
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    // In production, use the same domain as the app
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}/api`;
  }
  
  // Development: use localhost (if running Node.js API locally)
  return 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

// Get admin ID (user ID) - required for all operations
async function getAdminId() {
  const userId = getCurrentUserId();
  if (userId) {
    return userId;
  }
  // Create new user if doesn't exist
  return await getOrCreateUserId();
}

// Helper to convert timestamp to seconds (for compatibility)
export const toSeconds = (timestamp) => {
  if (!timestamp) return null;
  if (timestamp.seconds) return timestamp.seconds;
  if (timestamp instanceof Date) return Math.floor(timestamp.getTime() / 1000);
  if (typeof timestamp === 'string') {
    return Math.floor(new Date(timestamp).getTime() / 1000);
  }
  return null;
};

// Helper to convert seconds to Date
export const fromSeconds = (seconds) => {
  if (!seconds) return null;
  return new Date(seconds * 1000);
};

// Helper to transform quiz data
export const transformQuiz = (data) => {
  if (!data) return null;
  return {
    id: data.id,
    name: data.title || data.name,
    title: data.title || data.name,
    description: data.description,
    durationMinutes: data.duration_minutes || data.durationMinutes,
    difficulty: data.difficulty,
    randomizeQuestions: data.randomize_questions || data.randomize_questions,
    randomizeAnswers: data.randomize_answers || data.randomize_answers,
    status: data.status,
    archived: data.archived || false,
    createdAt: data.created_at ? { seconds: toSeconds(data.created_at) } : null,
    updatedAt: data.updated_at ? { seconds: toSeconds(data.updated_at) } : null,
    publishedAt: data.published_at ? { seconds: toSeconds(data.published_at) } : null,
    startAt: data.start_date || data.startAt,
    endAt: data.end_date || data.endAt,
    shareCode: data.share_code || data.share_code || "",
    ownerId: data.admin_id || data.ownerId,
    admin_id: data.admin_id || data.ownerId,
    is_published: data.is_published !== undefined ? data.is_published : (data.status === "published"),
    share_code: data.share_code || data.share_code || "",
    published_at: data.published_at || data.publishedAt,
    duration_minutes: data.duration_minutes || data.durationMinutes,
    randomize_questions: data.randomize_questions || data.randomizeQuestions,
    randomize_answers: data.randomize_answers || data.randomizeAnswers,
  };
};

// Helper to transform question data
export const transformQuestion = (data) => {
  if (!data) return null;
  
  // Parse options if it's a string
  let options = data.options;
  if (typeof options === 'string') {
    try {
      options = JSON.parse(options);
    } catch (e) {
      options = null;
    }
  }
  
  return {
    id: data.id,
    quiz_id: data.quiz_id || data.quizId,
    question_text: data.question_text || data.text,
    text: data.question_text || data.text,
    question_type: data.question_type || data.type,
    type: data.question_type || data.type,
    options: options,
    correct_answer: data.correct_answer || data.correctAnswer,
    correctAnswer: data.correct_answer || data.correctAnswer,
    points: data.points,
    question_order: data.question_order || data.orderIndex || 0,
    orderIndex: data.question_order || data.orderIndex || 0,
    image_url: data.image_url || data.imageUrl,
    imageUrl: data.image_url || data.imageUrl,
    video_url: data.video_url || data.videoUrl || data.streamable_embed_url,
    videoUrl: data.video_url || data.videoUrl || data.streamable_embed_url,
    streamableEmbedUrl: data.streamable_embed_url || data.video_url || data.videoUrl,
    status: data.status || "published",
  };
};

// API call helper
async function apiCall(endpoint, method = 'GET', data = null) {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      options.body = JSON.stringify(data);
    }

    const fullUrl = `${API_URL}/${endpoint}`;
    console.log(`🌐 API Call: ${method} ${fullUrl}`, data ? { data } : '');

    const response = await fetch(fullUrl, options);
    
    // Check if response is HTML (error page) instead of JSON
    const contentType = response.headers.get('content-type');
    if (contentType && !contentType.includes('application/json')) {
      const text = await response.text();
      if (text.trim().startsWith('<!') || text.trim().startsWith('<html')) {
        console.error(`❌ API returned HTML instead of JSON: ${endpoint}`);
        console.error(`URL: ${fullUrl}`);
        if (method === 'GET') {
          const arrayEndpoints = ['quizzes', 'questions', 'results'];
          const isArrayEndpoint = arrayEndpoints.some(e => endpoint.includes(e));
          return isArrayEndpoint ? [] : null;
        }
        throw new Error(`API endpoint not found. Please ensure the Node.js API is deployed on Vercel. URL: ${fullUrl}`);
      }
    }
    
    if (!response.ok) {
      try {
        const error = await response.json();
        throw new Error(error.error || `HTTP error! status: ${response.status}`);
      } catch (parseError) {
        const errorText = await response.text().catch(() => '');
        throw new Error(`API error: ${response.status} - ${response.statusText}. ${errorText.substring(0, 100)}`);
      }
    }

    const jsonData = await response.json();
    return jsonData;
  } catch (error) {
    console.error(`❌ API Error (${endpoint}):`, error);
    
    // Provide helpful error messages
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error(`Cannot connect to API at ${API_URL}. Please ensure:\n1. The Node.js API is deployed on Vercel\n2. Neon database is configured with DATABASE_URL\n3. The API is accessible at ${API_URL}`);
    }
    
    throw error;
  }
}

// Quiz operations
export const quizOperations = {
  // Get single quiz
  get: async (quizId) => {
    if (!quizId || quizId.startsWith('temp-')) {
      console.warn("Invalid quizId:", quizId);
      return null;
    }
    try {
      const adminId = await getAdminId();
      const data = await apiCall(`quizzes/${quizId}?admin_id=${encodeURIComponent(adminId)}`);
      return transformQuiz(data);
    } catch (error) {
      console.error("Error fetching quiz:", error);
      throw error;
    }
  },

  // Get quizzes by admin
  getByAdmin: async (adminId) => {
    try {
      const userId = adminId || await getAdminId();
      const data = await apiCall(`quizzes?admin_id=${encodeURIComponent(userId)}`);
      return Array.isArray(data) ? data.map(transformQuiz).filter(Boolean) : [];
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      throw error;
    }
  },

  // Create quiz
  create: async (data) => {
    try {
      const adminId = await getAdminId();
      const quizData = {
        ...data,
        admin_id: adminId,
      };
      const result = await apiCall('quizzes', 'POST', quizData);
      return result.id;
    } catch (error) {
      console.error("Error creating quiz:", error);
      throw error;
    }
  },

  // Update quiz
  update: async (quizId, data) => {
    try {
      const adminId = await getAdminId();
      const updateData = {
        ...data,
        admin_id: adminId,
      };
      await apiCall(`quizzes/${quizId}`, 'PUT', updateData);
    } catch (error) {
      console.error("Error updating quiz:", error);
      throw error;
    }
  },

  // Delete quiz
  delete: async (quizId) => {
    try {
      const adminId = await getAdminId();
      await apiCall(`quizzes/${quizId}?admin_id=${encodeURIComponent(adminId)}`, 'DELETE');
    } catch (error) {
      console.error("Error deleting quiz:", error);
      throw error;
    }
  },
};

// Question operations
export const questionOperations = {
  // Get questions by quiz
  getByQuiz: async (quizId) => {
    try {
      const adminId = await getAdminId();
      const data = await apiCall(`questions?quiz_id=${encodeURIComponent(quizId)}&admin_id=${encodeURIComponent(adminId)}`);
      return Array.isArray(data) ? data.map(transformQuestion).filter(Boolean) : [];
    } catch (error) {
      console.error("Error fetching questions:", error);
      throw error;
    }
  },

  // Create question
  create: async (data) => {
    try {
      const result = await apiCall('questions', 'POST', data);
      return result.id;
    } catch (error) {
      console.error("Error creating question:", error);
      throw error;
    }
  },

  // Update question
  update: async (questionId, data) => {
    try {
      const adminId = await getAdminId();
      const updateData = {
        ...data,
        admin_id: adminId,
      };
      await apiCall(`questions/${questionId}`, 'PUT', updateData);
    } catch (error) {
      console.error("Error updating question:", error);
      throw error;
    }
  },

  // Delete question
  delete: async (questionId) => {
    try {
      const adminId = await getAdminId();
      await apiCall(`questions/${questionId}?admin_id=${encodeURIComponent(adminId)}`, 'DELETE');
    } catch (error) {
      console.error("Error deleting question:", error);
      throw error;
    }
  },
};

// Results operations
export const resultOperations = {
  // Create result
  create: async (data) => {
    try {
      const result = await apiCall('results', 'POST', data);
      return result.id;
    } catch (error) {
      console.error("Error creating result:", error);
      throw error;
    }
  },

  // Get results by quiz (requires admin_id for security)
  getByQuiz: async (quizId) => {
    try {
      const adminId = await getAdminId();
      const data = await apiCall(`results?quiz_id=${encodeURIComponent(quizId)}&admin_id=${encodeURIComponent(adminId)}`);
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("Error fetching results:", error);
      throw error;
    }
  },
};


