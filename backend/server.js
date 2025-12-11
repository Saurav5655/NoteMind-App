const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require('@google/generative-ai');
const multer = require('multer');
const pdf = require('pdf-parse');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));
app.use(express.json());

// Initialize Keys function
const getApiKeys = () => {
    // Collect all keys from env starting with GEMINI_API_KEY
    const keys = [];
    if (process.env.GEMINI_API_KEY) keys.push(process.env.GEMINI_API_KEY);

    // Check for indexed keys (GEMINI_API_KEY_1, _2, etc.)
    Object.keys(process.env).forEach(key => {
        if (key.match(/^GEMINI_API_KEY_\d+$/)) {
            keys.push(process.env[key]);
        }
    });

    // Also check for a comma-separated list
    if (keys.length === 0 && process.env.GEMINI_API_KEYS) {
        return process.env.GEMINI_API_KEYS.split(',').map(k => k.trim());
    }

    return [...new Set(keys)]; // Unique keys
};

// Chat Endpoint
app.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        // 1. Try OpenRouter First (HTTP Request)
        if (process.env.OPENROUTER_API_KEY) {
            try {
                console.log('🌐 Attempting OpenRouter generation...');
                const openRouterResponse = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                        "HTTP-Referer": process.env.FRONTEND_URL || "http://localhost:3000",
                        "X-Title": "NoteMind Builder",
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        "model": process.env.OPENROUTER_MODEL || "google/gemini-2.0-flash-exp:free",
                        "messages": [
                            ...(history || []).map(h => ({ role: h.role === 'model' ? 'assistant' : h.role, content: h.parts[0].text })),
                            { "role": "user", "content": message }
                        ]
                    })
                });

                if (openRouterResponse.ok) {
                    const data = await openRouterResponse.json();
                    const text = data.choices[0].message.content;
                    return res.json({ text });
                } else {
                    const errText = await openRouterResponse.text();
                    console.warn(`OpenRouter failed: ${openRouterResponse.status} - ${errText}`);
                    // Fallthrough to Gemini direct if OpenRouter fails
                }
            } catch (orError) {
                console.warn("OpenRouter connection error:", orError);
                // Fallthrough to Gemini direct
            }
        }

        // 2. Direct Gemini Fallback (Existing Logic)

        // Select models
        const models = process.env.GEMINI_MODEL
            ? process.env.GEMINI_MODEL.split(',').map(m => m.trim())
            : ["gemini-1.5-flash", "gemini-pro"];

        const apiKeys = getApiKeys();

        if (apiKeys.length === 0) {
            return res.status(500).json({ error: 'No API Keys configured (OpenRouter or Gemini)' });
        }

        let lastError = null;
        let generatedText = null;

        // Loop through KEYS first (Failover)
        for (const apiKey of apiKeys) {
            if (generatedText) break;

            console.log(`🔑 Trying Gemini API Key: ...${apiKey.slice(-4)}`);
            const genAI = new GoogleGenerativeAI(apiKey);

            // Loop through MODELS (Capabilities)
            for (const modelName of models) {
                try {
                    console.log(`  🤖 Attempting generation with model: ${modelName}`);
                    const model = genAI.getGenerativeModel({
                        model: modelName,
                        safetySettings: [
                            { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
                            { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
                        ]
                    });

                    const chat = model.startChat({
                        history: history || [],
                    });

                    const result = await chat.sendMessage(message);
                    const response = await result.response;
                    generatedText = response.text();

                    // If successful
                    if (generatedText) break;
                } catch (error) {
                    console.warn(`  ⚠️ Model ${modelName} with current key failed:`, error.message);
                    lastError = error;
                    // Continue to next model with SAME key.
                    // If all models fail with this key, the loop continues to the next KEY.
                }
            }
        }

        if (!generatedText) {
            throw lastError || new Error("All keys and models exhausted without response");
        }

        res.json({ text: generatedText });

    } catch (error) {
        console.error('Chat Error (Full):', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

        // Friendly error for demo
        if (error.message?.includes('403') || error.message?.includes('Forbidden')) {
            return res.json({
                text: "⚠️ **System Message**\n\nAll configured API keys (OpenRouter & Gemini) appear to be restricted or quota-limited."
            });
        }
        res.status(500).json({ error: 'Failed to generate response', details: error.message });
    }
});

// Upload PDF Endpoint
app.post('/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

        const dataBuffer = req.file.buffer;
        const data = await pdf(dataBuffer);

        res.json({
            text: data.text,
            info: data.info,
            metadata: data.metadata
        });
    } catch (error) {
        console.error('PDF Error:', error);
        res.status(500).json({ error: 'Failed to parse PDF' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Successfully initialized Gemini`);
});
