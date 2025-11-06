#!/usr/bin/env node
/**
 * Test script to verify Gemini API configuration
 * Usage: node scripts/test-gemini.js
 */

require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiConfig() {
    console.log('🔍 Testing Gemini API Configuration...\n');

    // Check for API keys
    const apiKeys = [
        process.env.GEMINI_API_KEY,
        process.env.GEMINI_API_KEY_1,
        process.env.GEMINI_API_KEY_2,
        process.env.GEMINI_API_KEY_3
    ].filter(Boolean);

    if (apiKeys.length === 0) {
        console.error('❌ No API keys found in environment variables');
        console.error('📝 Create a .env file with: GEMINI_API_KEY=your_key_here');
        process.exit(1);
    }

    console.log(`✅ Found ${apiKeys.length} API key(s)`);

    // Test each API key
    for (let i = 0; i < apiKeys.length; i++) {
        const apiKey = apiKeys[i];
        const maskedKey = apiKey.length > 10 ? `${apiKey.slice(0, 6)}...${apiKey.slice(-4)}` : '***';
        
        console.log(`\n🔑 Testing API key ${i + 1}: ${maskedKey}`);
        
        try {
            const genAI = new GoogleGenerativeAI(apiKey);
            
            // Test with different models (prioritize working ones)
            const models = [
                'gemini-2.0-flash-exp',
                'gemini-1.5-flash',
                'gemini-1.5-pro'
            ];

            for (const modelName of models) {
                try {
                    console.log(`  🧪 Testing model: ${modelName}`);
                    const model = genAI.getGenerativeModel({ model: modelName });
                    const result = await model.generateContent('Hello, this is a test.');
                    const response = await result.response;
                    const text = response.text();
                    
                    console.log(`  ✅ ${modelName} works! Response: "${text.substring(0, 50)}..."`);
                    break; // Found a working model, no need to test others
                } catch (modelErr) {
                    if (modelErr.status === 404) {
                        console.log(`  ⚠️  ${modelName} not available (404)`);
                    } else if (modelErr.status === 400 && modelErr.message.includes('API key not valid')) {
                        console.log(`  ❌ ${modelName} - Invalid API key`);
                        break; // Don't test other models with invalid key
                    } else {
                        console.log(`  ❌ ${modelName} - ${modelErr.message}`);
                    }
                }
            }
        } catch (error) {
            console.error(`  ❌ API key test failed: ${error.message}`);
        }
    }

    console.log('\n🎉 Gemini API configuration test completed!');
}

testGeminiConfig().catch(console.error);
