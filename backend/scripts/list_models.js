const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

(async () => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY_1 || process.env.GEMINI_API_KEY_2 || process.env.GEMINI_API_KEY_3;
  if (!apiKey) {
    console.error('No Gemini API key found in environment. Set GEMINI_API_KEY or GEMINI_API_KEY_1/2/3.');
    process.exit(1);
  }

  try {
    const gen = new GoogleGenerativeAI(apiKey);
    if (typeof gen.listModels !== 'function') {
      console.error('listModels is not supported by the installed SDK version.');
      process.exit(2);
    }

    const list = await gen.listModels();
    console.log(JSON.stringify(list, null, 2));
  } catch (err) {
    console.error('Error calling listModels:', err && err.message ? err.message : err);
    process.exit(3);
  }
})();
