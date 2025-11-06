# 🚀 Complete Setup Guide for NoteMind App

## ✅ **Current Status**
- ✅ Backend Gemini API integration is **WORKING**
- ✅ Server starts successfully on port 3002
- ✅ API key is valid and connected
- ❌ Frontend needs environment configuration

## 🔧 **Required Setup Steps**

### **Step 1: Create Backend .env File**

Create `backend/.env` with this content:

```env
NODE_ENV=development
PORT=3002
FRONTEND_URL=http://localhost:3000

# Gemini API Configuration (YOUR KEY IS ALREADY WORKING!)
GEMINI_API_KEY=AIzaSyBlOaD2h1FUjMuTettR94rmpdK7OgHuBLg
GEMINI_MODEL=gemini-2.0-flash-exp,gemini-1.5-flash,gemini-1.5-pro
```

### **Step 2: Create Frontend .env File**

Create `frontend/.env` with this content:

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

## 🚀 **How to Run the Application**

### **Option 1: Run Both Backend and Frontend Together**
```bash
npm run dev
```

### **Option 2: Run Separately (Recommended for debugging)**

**Terminal 1 - Backend:**
```bash
npm run start:backend
```

**Terminal 2 - Frontend:**
```bash
npm run start:frontend
```

## 🎯 **Expected Results**

After creating both `.env` files:

1. **Backend** will show:
   ```
   ✅ Successfully initialized Gemini with key AIzaSy...166Y and model gemini-2.0-flash-exp
   Server is running on http://localhost:3002
   ```

2. **Frontend** will start on `http://localhost:3000` and connect to backend

3. **AI Chat** will work properly without connection errors

## 🔍 **Troubleshooting**

### If you get "Cannot find module" errors:
```bash
npm run install-all
```

### If backend port is in use:
```bash
# Find and kill process using port 3002
netstat -ano | findstr :3002
taskkill /PID <PID_NUMBER> /F
```

### If frontend can't connect to backend:
- Check that `REACT_APP_BACKEND_URL=http://localhost:3002` is in `frontend/.env`
- Make sure backend is running first
- Check browser console for connection errors

## 📁 **File Structure After Setup**
```
NoteMind-App/
├── backend/
│   ├── .env                    # ← CREATE THIS
│   ├── server.js              # ✅ Working
│   └── package.json
├── frontend/
│   ├── .env                    # ← CREATE THIS  
│   ├── src/
│   └── package.json
└── package.json                # ✅ Updated with new scripts
```

## 🎉 **Success Indicators**

- Backend: "Successfully initialized Gemini" message
- Frontend: No console errors about missing REACT_APP_BACKEND_URL
- AI Chat: Messages send and receive responses
- All features work: Calculator, Job Search, Resume Analyzer, etc.
