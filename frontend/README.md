# Frontend Setup

## Firebase Configuration & Authentication Setup

### 1. Firebase Console Setup

#### Enable Google Sign-In:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (`note-mind-app-91bdc`)
3. Go to **Authentication** → **Sign-in method** tab
4. Enable **Google** provider
5. Set up OAuth consent screen:
   - Go to **Authentication** → **Settings** tab
   - Click **Privacy Policy URL** (set to your site)
   - Click **Terms of Service URL** (optional)
   - Fill in required fields

#### Configure Authorized Domains:
1. In Firebase Console → **Authentication** → **Settings**
2. Add your domain to **Authorized domains**:
   - `localhost` (for development)
   - `note-mind-app-91bdc.firebaseapp.com` (production)
   - Your custom domain (if applicable)

#### Additional OAuth Settings:
1. Go to **Google Cloud Console** (linked from Firebase)
2. Navigate to **APIs & Services** → **Credentials**
3. Find your OAuth 2.0 Client ID
4. Add authorized redirect URIs:
   - `http://localhost:3000` (development)
   - `https://note-mind-app-91bdc.firebaseapp.com` (production)

### 2. Environment Configuration

Create a `.env` file in the frontend directory with the following content:

```env
# Backend API URL (REQUIRED)
REACT_APP_BACKEND_URL=http://localhost:3002

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=AIzaSyBlOaD2h1FUjMuTettR94rmpdK7OgHuBLg
REACT_APP_FIREBASE_AUTH_DOMAIN=note-mind-app-91bdc.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=note-mind-app-91bdc
REACT_APP_FIREBASE_STORAGE_BUCKET=note-mind-app-91bdc.firebasestorage.app
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=602485031611
REACT_APP_FIREBASE_APP_ID=1:602485031611:web:1242205b7c7bfb00979f9e
REACT_APP_FIREBASE_MEASUREMENT_ID=G-7K843QZYBE

# AI Configuration
REACT_APP_USE_BACKEND_AI=true
```

**Important**: The `REACT_APP_BACKEND_URL` is required for the frontend to communicate with the backend API.

### 3. Debugging Authentication Issues

#### Common Problems & Solutions:

1. **Popup doesn't appear:**
   - Check browser console for errors
   - Ensure popup blockers are disabled
   - Verify authorized domains in Firebase Console

2. **"Unauthorized domain" error:**
   - Add your domain to Firebase Console authorized domains
   - Check that domain matches exactly (no www. vs non-www.)

3. **"Invalid OAuth client" error:**
   - Verify Google Cloud Console OAuth settings
   - Ensure redirect URIs are correct

4. **Authentication succeeds but profile creation fails:**
   - Check Firestore security rules
   - Ensure user collection permissions

#### Debug Steps:
1. Open browser DevTools → Console tab
2. Try Google sign-in and check for JavaScript errors
3. Check Network tab for failed authentication requests
4. Verify Firebase config values in the console

### 4. Running the Application

```bash
npm install
npm start
```

Visit `http://localhost:3000` and test authentication flows.

### 5. Security Best Practices

- Never commit API keys to version control
- Use environment variables for all Firebase config
- Enable Firestore security rules
- Use Firebase security rules for data access
- Implement proper error handling
- Log authentication failures for monitoring

## Authentication Flow

1. **Landing Page**: User clicks "Sign Up" → modal opens
2. **Google OAuth**: User clicks "Continue with Google"
3. **OAuth Flow**: Firebase handles popup authentication
4. **Profile Creation**: New user profile created in Firestore
5. **Navigation**: User redirected to home page with animations

## Error Handling

The application includes comprehensive error handling for:
- Network failures during OAuth
- Invalid credentials
- Profile creation errors
- Popup blocking
- Unauthorized domains

All errors are logged to Firestore with context for debugging.
