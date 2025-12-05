const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
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

        // Select model - prioritizing ones from env or falling back to a default
        const modelName = process.env.GEMINI_MODEL ? process.env.GEMINI_MODEL.split(',')[0] : "gemini-1.5-flash";
        const model = genAI.getGenerativeModel({ model: modelName });

        const chat = model.startChat({
            history: history || [],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ response: text });
    } catch (error) {
        console.error('Chat Error:', error);
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
