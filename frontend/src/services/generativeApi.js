// Small helper for calling Google's Generative Language API (Gemini) from the frontend.
// IMPORTANT: Embedding API keys in client-side code is insecure. Use a server-side
// proxy for production and keep keys in server environment variables.

const GOOGLE_BASE_URL = process.env.REACT_APP_GOOGLE_API_URL || 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const BACKEND_PROXY_PATH = process.env.REACT_APP_BACKEND_URL ? new URL('/ai/generate', process.env.REACT_APP_BACKEND_URL).toString() : '/ai/generate';

/**
 * generateContent
 * - inputs: { prompt: string }
 * - returns: parsed JSON response from the API
 * - errors: throws Error on network or API-level failures
 */
export async function generateContent({ prompt, token } = {}) {
  if (!prompt) throw new Error('prompt is required');
  // First preference: use backend proxy if available (keeps API key secret)
  const useBackend = (process.env.REACT_APP_USE_BACKEND_AI || 'true').toLowerCase() === 'true';

  if (useBackend) {
    // call our backend proxy
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(BACKEND_PROXY_PATH, {
      method: 'POST',
      headers,
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Backend AI proxy error ${res.status}: ${text}`);
    }

    const data = await res.json();
    return data; // { text }
  }

  // Fallback: use direct Google API call (requires REACT_APP_GOOGLE_API_KEY set)
  const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
  if (!apiKey) {
    throw new Error('Missing REACT_APP_GOOGLE_API_KEY environment variable for direct call');
  }

  const body = {
    contents: [
      {
        parts: [ { text: prompt } ]
      }
    ]
  };

  const res = await fetch(`${GOOGLE_BASE_URL}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Generative API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  return data;
}

/**
 * streamGenerateContent
 * - inputs: { prompt: string, history: array, token: string, onMessage: function, onError: function }
 * - returns: EventSource instance
 * - errors: calls onError callback on network or API-level failures
 */
export function streamGenerateContent({ prompt, history, token, onMessage, onError }) {
  if (!prompt) {
    onError(new Error('Prompt is required for streaming.'));
    return null;
  }

  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3002'; // Default to 3002
  const eventSourceUrl = `${backendUrl}/chat?prompt=${encodeURIComponent(prompt)}&history=${encodeURIComponent(JSON.stringify(history))}&token=${token}`;

  const eventSource = new EventSource(eventSourceUrl);

  eventSource.onmessage = (event) => {
    if (onMessage) {
      onMessage(event);
    }
  };

  eventSource.onerror = (err) => {
    console.error("EventSource failed in streamGenerateContent:", err);
    if (onError) {
      onError(err);
    }
    eventSource.close();
  };

  return eventSource;
}
