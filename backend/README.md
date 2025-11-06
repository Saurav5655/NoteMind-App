# Backend Setup

## Firebase Setup

To enable authentication, you need to configure Firebase Admin SDK:

### 1. Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one

### 2. Generate Service Account Key
1. In Firebase Console, go to Project Settings > Service accounts tab
2. Click "Generate new private key"
3. Save the downloaded JSON file as `firebase-service-account.json` in this backend directory

### 3. Alternative: Environment Variable
Instead of the JSON file, you can set `FIREBASE_SERVICE_ACCOUNT_KEY` environment variable with the JSON content.

### 4. Enable Authentication
1. In Firebase Console, go to Authentication > Sign-in method
2. Enable Google and Email/Password providers
3. (Optional) Configure authorized domains

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

```env
# Required: Gemini API Configuration
GEMINI_API_KEY=your_actual_api_key_here
GEMINI_MODEL=gemini-1.5-flash,gemini-1.5-pro

# Firebase (optional, if not using service account file)
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}

# Frontend URL for CORS
FRONTEND_URL=http://localhost:3000

# Other API keys as needed
```

### Getting Your Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into your `.env` file

### Testing Your Configuration

Run the test script to verify your API key works:

```bash
node scripts/test-gemini.js
```

## Installation & Running

```bash
npm install
npm start
# or for development:
npm run dev
