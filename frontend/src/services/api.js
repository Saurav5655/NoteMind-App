import { auth } from './firebase';

// Helper function to make authenticated API requests
export const makeAuthenticatedRequest = async (url, options = {}) => {
  try {
    // Get the current user's ID token
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const idToken = await user.getIdToken();
    const headers = {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, {
      ...options,
      headers
    });

    // Handle authentication errors
    if (response.status === 401) {
      // Token might be expired, try to refresh
      try {
        await user.getIdToken(true); // Force refresh
        const newToken = await user.getIdToken();
        const newHeaders = {
          ...headers,
          'Authorization': `Bearer ${newToken}`
        };

        return fetch(url, {
          ...options,
          headers: newHeaders
        });
      } catch (refreshError) {
        console.error('Failed to refresh token:', refreshError);
        throw new Error('Authentication failed. Please log in again.');
      }
    }

    return response;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
};

// Wrapper for GET requests (no body needed for streaming endpoints)
export const authenticatedFetch = async (url, options = {}) => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }

  const idToken = await user.getIdToken();
  const headers = {
    'Authorization': `Bearer ${idToken}`,
    'Content-Type': 'application/json',
    ...options.headers
  };

  return fetch(url, {
    ...options,
    headers
  });
};

// Example: calling the Generative Language helper
// Import and call `generateContent` from `src/services/generativeApi.js`.
// In production, prefer implementing a server-side endpoint that stores the
// Google API key and forwards requests (keeps the key secret).

// Helper: call backend AI proxy (authenticated)
export const callBackendAIGenerate = async (prompt, /* options = {} */) => {
  const url = (process.env.REACT_APP_BACKEND_URL || '') + '/ai/generate';
  // Use authenticatedFetch if you want requests to include Firebase ID token
  try {
    // If you need authentication, use makeAuthenticatedRequest or authenticatedFetch
    const response = await makeAuthenticatedRequest(url, {
      method: 'POST',
      body: JSON.stringify({ prompt }),
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Backend AI error ${response.status}: ${text}`);
    }

    return response.json();
  } catch (err) {
    // Fall back to unauthenticated fetch if authentication is not configured
    const fallback = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!fallback.ok) {
      const text = await fallback.text();
      throw new Error(`Backend AI (fallback) error ${fallback.status}: ${text}`);
    }
    return fallback.json();
  }
};
