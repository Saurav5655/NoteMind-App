// Small helper for calling Google's Generative Language API (Gemini) from the frontend.
// IMPORTANT: Embedding API keys in client-side code is insecure. Use a server-side
// proxy for production and keep keys in server environment variables.

const MODELS = [
  'gemini-2.0-flash',
  'gemini-1.5-flash',
  'gemini-pro'
];

const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const BACKEND_PROXY_PATH = process.env.REACT_APP_BACKEND_URL ? `${process.env.REACT_APP_BACKEND_URL}/chat` : 'http://localhost:3002/chat';

/**
 * generateContent
 * - inputs: { prompt: string }
 * - returns: parsed JSON response from the API
 * - errors: throws Error on network or API-level failures
 */
export async function generateContent({ prompt, token } = {}) {
  if (!prompt) throw new Error('prompt is required');

  // First preference: use backend proxy if available (keeps API key secret)
  // Default to false for local dev with direct keys unless specified
  const useBackend = (process.env.REACT_APP_USE_BACKEND_AI || 'false').toLowerCase() === 'true';

  if (useBackend) {
    // call our backend proxy
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(BACKEND_PROXY_PATH, {
      method: 'POST',
      headers,
      body: JSON.stringify({ message: prompt }) // Server expects 'message'
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
        parts: [{ text: prompt }]
      }
    ]
  };

  // Try models in sequence
  let lastError = null;
  for (const model of MODELS) {
    try {
      console.log(`🤖 Attempting AI generation with model: ${model}`);
      const url = `${BASE_URL}/${model}:generateContent?key=${encodeURIComponent(apiKey)}`;

      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      if (!res.ok) {
        const text = await res.text();
        // If 404 (Not Found) or 400 (Bad Request - possibly invalid model), try next
        if (res.status === 404 || res.status === 400) {
          console.warn(`⚠️ Model ${model} failed (${res.status}), trying next...`);
          lastError = new Error(`Model ${model} error ${res.status}: ${text}`);
          continue;
        }
        throw new Error(`Generative API error ${res.status}: ${text}`);
      }

      const data = await res.json();

      // Extract text from response structure
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!generatedText) {
        throw new Error('Unexpected response structure from Gemini API');
      }

      return { text: generatedText };

    } catch (error) {
      console.error(`❌ Error with model ${model}:`, error);
      lastError = error;
      // Continue to next model if it's a fetch error or handled error
    }
  }

  throw lastError || new Error('All AI models failed');
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
