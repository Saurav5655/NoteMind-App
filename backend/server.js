require('dotenv').config({ path: './.env' });
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const multer = require('multer');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const sseExpress = require('sse-express');
const math = require('mathjs');
const fs = require('fs');
const path = require('path');

// Firebase Admin SDK initialization
const admin = require('firebase-admin');

try {
    const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');
    if (fs.existsSync(serviceAccountPath)) {
        const serviceAccount = require(serviceAccountPath);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log('Firebase Admin initialized with service account.');
    } else if (process.env.NODE_ENV === 'development') {
        admin.initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID || 'note-mind-app-91bdc',
        });
        console.log('Firebase Admin initialized in development mode without service account.');
    } else {
        console.warn('Firebase Admin initialization skipped: service account not found for production.');
    }
} catch (error) {
    console.error('Firebase Admin initialization failed:', error.message);
}

// Authentication middleware
const authenticateUser = async (req, res, next) => {
    // In development mode, accept all requests
    if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: Authentication bypassed');
        return next();
    }

    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No authentication token provided' });
        }

        const idToken = authHeader.split('Bearer ')[1];

        if (!idToken) {
            return res.status(401).json({ error: 'Invalid authentication token format' });
        }

        try {
            // Try to verify the token if Firebase Admin is initialized
            const decodedToken = await admin.auth().verifyIdToken(idToken);
            req.user = decodedToken;
        } catch (verifyError) {
            console.warn('Token verification skipped:', verifyError.message);
            // Still allow the request in development
            if (process.env.NODE_ENV === 'development') {
                console.log('Development mode: Continuing despite verification failure');
                return next();
            }
            throw verifyError;
        }

        next();
    } catch (error) {
        console.error('Authentication error:', error);
        if (error.code === 'auth/id-token-expired') {
            return res.status(401).json({ error: 'Authentication token expired' });
        } else if (error.code === 'auth/id-token-revoked') {
            return res.status(401).json({ error: 'Authentication token revoked' });
        } else {
            return res.status(401).json({ error: 'Invalid authentication token' });
        }
    }
};

// Optional auth middleware for development (allows requests without tokens if Firebase Admin not configured)
const optionalAuth = (req, res, next) => {
    if (!admin.apps.length) {
        // No Firebase Admin configured, allow in development
        req.user = { uid: 'anonymous', email: 'anonymous@example.com' };
        return next();
    }
    return authenticateUser(req, res, next);
};

const app = express();
console.log("process.env.PORT:", process.env.PORT);
const port = process.env.PORT || 3004;

// Security middleware
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, etc.)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            process.env.FRONTEND_URL || 'http://localhost:3000',
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:5173'
        ];

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200,
    credentials: true
};

// Rate limiting (simple in-memory implementation)
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX_REQUESTS = 100;

const rateLimitMiddleware = (req, res, next) => {
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW;

    // Clean old entries
    for (const [ip, requests] of rateLimit.entries()) {
        if (requests.timestamp < windowStart) {
            rateLimit.delete(ip);
        }
    }

    // Check current rate limit
    const clientRequests = rateLimit.get(clientIP);
    if (clientRequests && clientRequests.count >= RATE_LIMIT_MAX_REQUESTS) {
        return res.status(429).json({
            error: 'Too many requests',
            retryAfter: Math.ceil((clientRequests.timestamp + RATE_LIMIT_WINDOW - now) / 1000)
        });
    }

    // Update rate limit
    if (clientRequests) {
        clientRequests.count++;
    } else {
        rateLimit.set(clientIP, { count: 1, timestamp: now });
    }

    next();
};

// Input validation middleware
const validateInput = (req, res, next) => {
    const maxSize = 1024 * 1024; // 1MB limit

    if (req.body && JSON.stringify(req.body).length > maxSize) {
        return res.status(413).json({ error: 'Request too large' });
    }

    next();
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(rateLimitMiddleware);
app.use(validateInput);

// Request logging middleware
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`${timestamp} - ${req.method} ${req.path} - IP: ${req.ip}`);
    next();
});

// --- Gemini AI Configuration ---
// Support multiple keys and model candidates. If the SDK supports listing models,
// try that first and pick a compatible model.
const geminiApiKeys = [process.env.GEMINI_API_KEY_1, process.env.GEMINI_API_KEY_2, process.env.GEMINI_API_KEY_3, process.env.GEMINI_API_KEY].filter(Boolean);
// Allow explicitly specifying a single model via GEMINI_MODEL to avoid trying many models
const geminiModelCandidates = (process.env.GEMINI_MODEL || process.env.GEMINI_MODELS || 'gemini-1.5-flash,gemini-1.5-pro,gemini-2.0-flash-exp')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
let validGenAI = null;
let validModel = null;

const maskKey = (k) => (k && k.length > 10) ? `${k.slice(0,6)}...${k.slice(-4)}` : (k || 'NO_KEY');

const initializeGemini = async () => {
    // If mock mode is enabled, create a fake model for local development and exit early
    if (process.env.MOCK_GEMINI === 'true' || process.env.GEMINI_MODE === 'mock') {
        console.log('MOCK_GEMINI enabled — creating a mock AI model for local development.');
        validGenAI = { mock: true };
        validModel = {
            // emulate generateContent used by non-stream endpoints
            generateContent: async (prompt) => ({ response: { text: () => `{"mock":true, "prompt": ${JSON.stringify(String(prompt))}}` } }),
            // emulate chat startChat and streaming
            startChat: () => ({
                sendMessageStream: async (prompt) => ({
                    stream: (async function* () {
                        // yield a couple of chunks then finish
                        yield { text: () => `Mock reply start for: ${prompt}` };
                        yield { text: () => `Mock reply end` };
                    })()
                })
            })
        };
        return;
    }

    if (!geminiApiKeys.length) {
        console.error('❌ No Gemini API keys configured!');
        console.error('📝 To fix this:');
        console.error('   1. Create a .env file in the backend directory');
        console.error('   2. Add: GEMINI_API_KEY=your_actual_api_key_here');
        console.error('   3. Get your API key from: https://aistudio.google.com/app/apikey');
        console.error('   4. Restart the server');
        console.error('🚫 AI chat will not work until this is fixed.');
        return;
    }

    for (const apiKey of geminiApiKeys) {
        const genAIInstance = new GoogleGenerativeAI(apiKey);

        // Build a list of candidate model names to try: try SDK-provided list first if available
        let triedModels = [];
        try {
            if (typeof genAIInstance.listModels === 'function') {
                try {
                    const listResult = await genAIInstance.listModels();
                    // listResult may be an array or an object with a 'models' field
                    let names = [];
                    if (Array.isArray(listResult)) names = listResult;
                    else if (Array.isArray(listResult.models)) names = listResult.models.map(m => m.name || m.id || m.model || m);
                    else if (Array.isArray(listResult.modelInfos)) names = listResult.modelInfos.map(m => m.name || m.id || m.model || m);
                    // Normalize to strings
                    names = names.map(n => (typeof n === 'string') ? n : (n && (n.name || n.id || String(n)))).filter(Boolean);
                    triedModels = triedModels.concat(names);
                } catch (listErr) {
                    // ignore listing errors and fall back to candidates
                    console.warn('Could not list models via SDK (will try candidate names):', listErr.message);
                }
            }
        } catch (e) {
            // ignore
        }

        // Append configured candidate models
        triedModels = triedModels.concat(geminiModelCandidates);
        // Deduplicate
        triedModels = Array.from(new Set(triedModels));

        for (const modelName of triedModels) {
            try {
                const modelInstance = genAIInstance.getGenerativeModel({ model: modelName });
                // quick validation call (non-streaming) to ensure the model/key combo works
                await modelInstance.generateContent('Ping');
                validGenAI = genAIInstance;
                validModel = modelInstance;
                console.log(`Successfully initialized Gemini with key ${maskKey(apiKey)} and model ${modelName}`);
                return;
            } catch (err) {
                // Enhanced error messages with actionable guidance
                if (err.status === 400 && err.message && err.message.includes('API key not valid')) {
                    console.error(`❌ Invalid API key: ${maskKey(apiKey)}`);
                    console.error('📝 To fix this:');
                    console.error('   1. Check your API key at: https://aistudio.google.com/app/apikey');
                    console.error('   2. Make sure the key is copied correctly (no extra spaces)');
                    console.error('   3. Ensure the key has proper permissions for Gemini API');
                } else if (err.status === 404 && err.message && err.message.includes('not found')) {
                    console.error(`❌ Model not found: ${modelName}`);
                    console.error('📝 This model is not available. Trying next model...');
                } else {
                    console.error(`❌ Key ${maskKey(apiKey)} + model ${modelName} failed:`, err.message || err);
                }
                if (process.env.DEBUG_GEMINI === 'true') console.warn('Debug details:', err);
            }
        }
    }

    console.error('❌ All Gemini API key/model combinations failed to initialize.');
    console.error('📝 Troubleshooting steps:');
    console.error('   1. Verify your API key is valid at: https://aistudio.google.com/app/apikey');
    console.error('   2. Check that your .env file has GEMINI_API_KEY=your_actual_key');
    console.error('   3. Ensure you have internet connectivity');
    console.error('   4. Try setting DEBUG_GEMINI=true for detailed error logs');
    console.error('🚫 AI chat will not work until this is resolved.');
};

initializeGemini();

// --- File Upload Configuration ---
const upload = multer({ storage: multer.memoryStorage() });

// --- API Endpoints ---

// Basic root endpoint
app.get('/', (req, res) => {
    res.status(200).send('Backend server is running.');
});

// Chat endpoint with streaming
app.get('/chat', optionalAuth, async (req, res) => {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
        if (!validGenAI || !validModel) {
            const errorData = { error: 'AI chat is not available. Please check API keys and model configuration.' };
            console.warn('Chat request received but AI is not initialized.');
            res.write(`data: ${JSON.stringify(errorData)}\n\n`);
            return;
        }

        if (!req.user && req.query.token) {
            try {
                const decodedToken = await admin.auth().verifyIdToken(req.query.token);
                req.user = decodedToken;
            } catch (tokenError) {
                console.warn('Invalid token in query params:', tokenError.message);
                res.write(`data: ${JSON.stringify({ error: 'Authentication required' })}\n\n`);
                return;
            }
        }

        console.log('Received /chat request:', req.query);
        if (!validModel) {
            res.write(`data: ${JSON.stringify({ error: 'AI chat is not initialized. Please check API keys.' })}\n\n`);
            return;
        }

        const { prompt, history } = req.query;
        const parsedHistory = history ? JSON.parse(history) : [];
        const chat = validModel.startChat({ history: parsedHistory });
        const result = await chat.sendMessageStream(prompt);

        for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            const dataToSend = { response: chunkText || '' };
            console.log('Sending SSE data:', dataToSend); // Log sent data
            res.write(`data: ${JSON.stringify(dataToSend)}\n\n`);
        }

        const doneData = { done: true };
        console.log('Sending SSE done:', doneData); // Log done message
        res.write(`data: ${JSON.stringify(doneData)}\n\n`);

    } catch (error) {
        console.error('Error in /chat endpoint:', error);
        const errorData = { error: 'Failed to get response from AI' };
        console.log('Sending SSE error:', errorData); // Log error message
        res.write(`data: ${JSON.stringify(errorData)}\n\n`);
    } finally {
        res.end();
    }
});

// Calculator endpoint
app.post('/calculate', optionalAuth, (req, res) => {
    try {
        const { expression } = req.body;
        const result = math.evaluate(expression);
        res.json({ result });
    } catch (error) {
        console.error('Error in /calculate endpoint:', error);
        res.status(400).json({ error: 'Invalid expression' });
    }
});

// Knowledge Base Search endpoint
app.post('/search-kb', optionalAuth, async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) {
            return res.status(400).json({ error: 'Query parameter is required' });
        }

        const knowledgeBaseDir = path.join(__dirname, 'knowledge_base');
        const files = await fs.promises.readdir(knowledgeBaseDir);
        let results = [];

        for (const file of files) {
            const filePath = path.join(knowledgeBaseDir, file);
            const content = await fs.promises.readFile(filePath, 'utf-8');
            const paragraphs = content.split('\n\n'); // Simple paragraph splitting

            for (const paragraph of paragraphs) {
                if (paragraph.toLowerCase().includes(query.toLowerCase())) {
                    results.push({
                        file: file,
                        paragraph: paragraph.trim()
                    });
                }
            }
        }
        res.json({ results });
    } catch (error) {
        console.error('Error in /search-kb endpoint:', error);
        res.status(500).json({ error: 'Failed to perform knowledge base search' });
    }
});

// File upload endpoint
app.post('/upload', optionalAuth, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        const data = await pdf(req.file.buffer);
        res.json({ text: data.text });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to process PDF' });
    }
});

// Diagnostic endpoint: list available AI models for the configured Gemini API key
app.get('/ai/models', optionalAuth, async (req, res) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY_3;
        if (!apiKey) return res.status(400).json({ error: 'No Gemini API key configured. Set GEMINI_API_KEY or GEMINI_API_KEY_1/2/3.' });

        const genAI = new GoogleGenerativeAI(apiKey);
        if (typeof genAI.listModels !== 'function') {
            return res.status(501).json({ error: 'listModels not supported by the installed @google/generative-ai SDK version.' });
        }

        const listResult = await genAI.listModels();
        // Return the raw result (could be array or object) so client can inspect
        res.json({ models: listResult });
    } catch (error) {
        console.error('Error in /ai/models endpoint:', error && error.message ? error.message : error);
        res.status(500).json({ error: 'Failed to list AI models' });
    }
});

// Simple generate endpoint (POST) - server-side proxy that keeps the API key secret
app.post('/ai/generate', optionalAuth, async (req, res) => {
    try {
        const { prompt } = req.body || {};
        if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
            return res.status(400).json({ error: 'prompt is required and must be a non-empty string' });
        }
        // If mock mode is enabled, return a deterministic mock response
        if (validGenAI && validGenAI.mock) {
            const mockText = `Mock reply for prompt: ${prompt}`;
            return res.json({ text: mockText });
        }

        // Preferred path: use initialized SDK model if available
        if (validModel) {
            try {
                const result = await validModel.generateContent(prompt);
                const responseObj = result && (result.response || result);
                let text = '';
                try {
                    text = responseObj.text();
                } catch (readErr) {
                    console.warn('Could not extract text from model response:', readErr && readErr.message ? readErr.message : readErr);
                    text = JSON.stringify(responseObj);
                }

                return res.json({ text });
            } catch (sdkErr) {
                console.warn('SDK generateContent failed, will try REST fallback if key available:', sdkErr && sdkErr.message ? sdkErr.message : sdkErr);
                // fall through to REST fallback
            }
        }

        // REST fallback: if a GEMINI_API_KEY or GOOGLE_API_KEY is present, call Generative Language REST API directly
        const restKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY_3 || process.env.GOOGLE_API_KEY || process.env.GEMINI_API_KEY_ENV;
        if (!restKey) {
            return res.status(503).json({ error: 'AI model not initialized and no API key provided. Please set GEMINI_API_KEY or GOOGLE_API_KEY.' });
        }

        try {
            const body = {
                contents: [ { parts: [ { text: prompt } ] } ]
            };

                        const modelToUse = validModel ? validModel.model : 'gemini-1.5-flash'; // Fallback to a known model
            const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelToUse}:generateContent?key=${encodeURIComponent(restKey)}`;
            const fetchRes = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (!fetchRes.ok) {
                const text = await fetchRes.text();
                console.error('REST fallback returned error:', fetchRes.status, text);
                return res.status(502).json({ error: `Generative API REST error ${fetchRes.status}`, body: text });
            }

            const json = await fetchRes.json();
            // Heuristic extraction of generated text
            let extracted = '';
            if (json && json.candidates && Array.isArray(json.candidates) && json.candidates[0]) {
                const cand = json.candidates[0];
                if (cand.content && Array.isArray(cand.content)) {
                    extracted = cand.content.map(c => c.text || JSON.stringify(c)).join('\n');
                } else if (cand.output) {
                    extracted = JSON.stringify(cand.output);
                } else if (cand.text) {
                    extracted = cand.text;
                }
            } else if (json && json.output) {
                extracted = JSON.stringify(json.output);
            } else {
                extracted = JSON.stringify(json);
            }

            return res.json({ text: extracted, raw: json });
        } catch (restErr) {
            console.error('Error during REST fallback call:', restErr && restErr.stack ? restErr.stack : restErr);
            return res.status(500).json({ error: 'Failed to call Generative REST API' });
        }
    } catch (error) {
        console.error('Error in /ai/generate endpoint:', error && error.stack ? error.stack : error);
        return res.status(500).json({ error: 'Failed to generate content' });
    }
});

// --- Employment API Endpoints ---

// Job Search endpoint using JSearch API
app.get('/jobs/search', optionalAuth, async (req, res) => {
    try {
        const { query, location, page = 1 } = req.query;
        const apiKey = process.env.JSEARCH_API_KEY;

        if (!apiKey || apiKey === 'your_jsearch_api_key_here') {
            return res.status(400).json({ error: 'JSearch API key not configured' });
        }

        const searchQuery = query || 'software developer';
        const searchLocation = location || 'United States';

        const response = await fetch(
            `${process.env.JSEARCH_API_URL}?query=${encodeURIComponent(searchQuery)}&page=${page}&num_pages=1&country=${encodeURIComponent(searchLocation)}`,
            {
                headers: {
                    'X-RapidAPI-Key': apiKey,
                    'X-RapidAPI-Host': 'jsearch.p.rapidapi.com'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`JSearch API error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error in /jobs/search endpoint:', error);
        res.status(500).json({ error: 'Failed to search jobs' });
    }
});

// Job Search endpoint using Adzuna API
app.get('/jobs/adzuna', optionalAuth, async (req, res) => {
    try {
        const { query, location, country = 'us' } = req.query;
        const appId = process.env.ADZUNA_API_ID;
        const apiKey = process.env.ADZUNA_API_KEY;

        if (!appId || !apiKey || appId === 'your_adzuna_api_id_here' || apiKey === 'your_adzuna_api_key_here') {
            return res.status(400).json({ error: 'Adzuna API credentials not configured' });
        }

        const searchQuery = query || 'software developer';
        const searchLocation = location || 'United States';

        const response = await fetch(
            `${process.env.ADZUNA_API_URL}/${country}/search/1?app_id=${appId}&app_key=${apiKey}&results_per_page=20&what=${encodeURIComponent(searchQuery)}&where=${encodeURIComponent(searchLocation)}`
        );

        if (!response.ok) {
            throw new Error(`Adzuna API error: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error in /jobs/adzuna endpoint:', error);
        res.status(500).json({ error: 'Failed to search jobs via Adzuna' });
    }
});

// Resume Analysis endpoint
app.post('/resume/analyze', optionalAuth, async (req, res) => {
    try {
        const { resumeText, jobDescription } = req.body;

        if (!validModel) {
            return res.status(400).json({ error: 'AI model not initialized' });
        }

        const prompt = `
        Analyze the following resume and provide feedback:

        RESUME:
        ${resumeText}

        JOB DESCRIPTION:
        ${jobDescription}

        Please provide:
        1. Overall resume score (1-10)
        2. Key strengths
        3. Areas for improvement
        4. Keyword matches with job description
        5. Specific suggestions for improvement
        `;

        const result = await validModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            const analysis = JSON.parse(text);
            res.json(analysis);
        } catch (parseError) {
            res.json({
                score: 5,
                strengths: ["Resume structure"],
                improvements: ["Consider using structured format"],
                keyword_matches: [],
                suggestions: ["Use JSON format for better parsing"]
            });
        }
    } catch (error) {
        console.error('Error in /resume/analyze endpoint:', error);
        res.status(500).json({ error: 'Failed to analyze resume' });
    }
});

// Interview Questions endpoint
app.get('/interview/questions', optionalAuth, async (req, res) => {
    try {
        const { jobTitle, experience = 'mid' } = req.query;

        if (!jobTitle) {
            return res.status(400).json({ error: 'jobTitle parameter is required' });
        }

        if (!validModel) {
            return res.status(400).json({ error: 'AI model not initialized' });
        }

        const prompt = `
        Generate 10 common interview questions for a ${experience}-level ${jobTitle} position.
        Return them as a JSON array of strings.
        Example: ["Question 1?", "Question 2?", "Question 3?"]
        `;

        const result = await validModel.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        try {
            const questions = JSON.parse(text);
            if (!Array.isArray(questions)) {
                throw new Error('AI response is not an array');
            }
            res.json({ questions });
        } catch (parseError) {
            // Fallback questions if AI doesn't return proper JSON
            const fallbackQuestions = [
                "Tell me about yourself",
                "What are your greatest strengths?",
                "What is your greatest weakness?",
                "Why do you want to work here?",
                "Where do you see yourself in 5 years?",
                "Why should we hire you?",
                "Tell me about a challenge you faced at work",
                "How do you handle stress?",
                "Describe your ideal work environment",
                "What motivates you?"
            ];
            res.json({ questions: fallbackQuestions });
        }
    } catch (error) {
        console.error('Error in /interview/questions endpoint:', error);
        res.status(500).json({ error: 'Failed to generate interview questions' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
