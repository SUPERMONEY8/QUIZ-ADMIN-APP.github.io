// User Manager - Handles unique user ID generation and storage for multi-tenant support

// Determine API URL based on environment
const getApiUrl = () => {
  // Check for environment variable first
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Check if we're in production (deployed)
  const isProduction = typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    // In production, use the same domain as the app (Node.js API)
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    return `${protocol}//${hostname}/api`;
  }
  
  // Development: use localhost (Node.js API)
  return 'http://localhost:3000/api';
};

const API_URL = typeof window !== 'undefined' ? getApiUrl() : 'http://localhost:3000/api';
const USER_ID_KEY = 'quiz_app_user_id';
const USER_EMAIL_KEY = 'quiz_app_user_email';

// Generate a unique user ID (UUID-like)
function generateUserId() {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// Get or create user ID
export async function getOrCreateUserId(email = null) {
  try {
    // Check localStorage first
    let userId = localStorage.getItem(USER_ID_KEY);
    let storedEmail = localStorage.getItem(USER_EMAIL_KEY);
    
    // If we have a stored user ID, verify/create user in database
    if (userId) {
      try {
        // Try to get user from database (Node.js API)
        const response = await fetch(`${API_URL}/users/${userId}`);
        if (response.ok) {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const user = await response.json();
            // Update email if provided and different
            if (email && email !== storedEmail) {
              await updateUserEmail(userId, email);
              localStorage.setItem(USER_EMAIL_KEY, email);
            }
            return userId;
          }
        }
      } catch (error) {
        console.warn('User verification failed (API may be unavailable):', error.message);
        // If API is unavailable, just return the stored ID
        return userId;
      }
    }
    
    // Create new user
    userId = generateUserId();
    
    // Try to create user in database, but fallback to localStorage if API unavailable
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          email: email || null,
          name: email ? email.split('@')[0] : null,
        }),
      });
      
      if (response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          // Store in localStorage
          localStorage.setItem(USER_ID_KEY, userId);
          if (email) {
            localStorage.setItem(USER_EMAIL_KEY, email);
          }
          return userId;
        }
      }
    } catch (error) {
      console.warn('API unavailable, using localStorage fallback:', error.message);
    }
    
    // Fallback: store locally even if API fails
    localStorage.setItem(USER_ID_KEY, userId);
    if (email) {
      localStorage.setItem(USER_EMAIL_KEY, email);
    }
    return userId;
  } catch (error) {
    console.error('Error getting/creating user ID:', error);
    // Fallback: generate and store locally
    const userId = generateUserId();
    localStorage.setItem(USER_ID_KEY, userId);
    if (email) {
      localStorage.setItem(USER_EMAIL_KEY, email);
    }
    return userId;
  }
}

// Get current user ID from localStorage
export function getCurrentUserId() {
  return localStorage.getItem(USER_ID_KEY);
}

// Update user email
async function updateUserEmail(userId, email) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    // Check if response is JSON, not HTML
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('API returned non-JSON response, skipping email update');
      return;
    }
  } catch (error) {
    console.warn('Error updating user email (API may be unavailable):', error.message);
  }
}

// Get user info
export async function getUserInfo(userId) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`);
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
    }
    return null;
  } catch (error) {
    console.warn('Error getting user info (API may be unavailable):', error.message);
    return null;
  }
}

// Update user customization (app name, color palette, icon)
export async function updateUserCustomization(userId, customization) {
  try {
    const response = await fetch(`${API_URL}/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        app_name: customization.appName,
        color_palette: customization.colorPalette,
        selected_icon: customization.selectedIcon,
      }),
    });
    // Check if response is JSON, not HTML
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.warn('API returned non-JSON response, skipping customization update');
      return;
    }
  } catch (error) {
    console.warn('Error updating user customization (API may be unavailable):', error.message);
  }
}

