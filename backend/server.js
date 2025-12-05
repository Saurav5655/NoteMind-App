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
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// File Upload Config
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Routes

// Health Check
app.get('/', (req, res) => {
    res.json({ message: 'NoteMind Backend is running', status: 'OK' });
});

// Chat Endpoint
app.post('/chat', async (req, res) => {
    try {
        const { message, history } = req.body;
        if (!message) return res.status(400).json({ error: 'Message is required' });

        // Select models from env
        const models = process.env.GEMINI_MODEL
            ? process.env.GEMINI_MODEL.split(',').map(m => m.trim())
            : ["gemini-1.5-flash", "gemini-pro"];

        let lastError = null;
        let generatedText = null;

        // Try models in sequence
        for (const modelName of models) {
            try {
                console.log(`🤖 Attempting generation with model: ${modelName}`);
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

                // If successful, break the loop
                if (generatedText) break;
            } catch (error) {
                console.warn(`⚠️ Model ${modelName} failed:`, error.message);
                lastError = error;
                // Continue to next model
            }
        }

        if (!generatedText) {
            throw lastError || new Error("All models failed to generate response");
        }

        res.json({ text: generatedText });
    } catch (error) {
        console.error('Chat Error (Full):', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));

        // If API key is invalid/restricted (400/403), return a friendly mock response for demo purposes
        if (error.message?.includes('403') || error.message?.includes('Forbidden') || error.status === 403 || error.status === 400) {
            console.log('⚠️ API Key restriction detected. Sending fallback mock response.');
            return res.json({
                text: "⚠️ **Demo Mode (Invalid API Key)**\n\nIt looks like your API key is restricted (likely a Firebase-only key). To get real AI responses:\n\n1. Go to [Google AI Studio](https://aistudio.google.com/)\n2. Create a new API Key\n3. Update your `.env` file.\n\nIn the meantime, I am listening! This is a simulated response to verify the UI works."
            });
        }

        if (error.response) {
            console.error('API Response Error:', JSON.stringify(error.response, null, 2));
        }
        res.status(500).json({ error: 'Failed to generate response', details: error.message, fullError: error });
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
