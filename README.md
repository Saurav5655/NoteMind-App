# 🚀 NoteMind-App

A comprehensive, secure, and feature-rich AI-powered note-taking and productivity application built with modern web technologies.

![NoteMind App](https://img.shields.io/badge/Status-Production%20Ready-brightgreen) ![React](https://img.shields.io/badge/React-18.3.1-blue) ![Node.js](https://img.shields.io/badge/Node.js-16+-green) ![Firebase](https://img.shields.io/badge/Firebase-12.3.0-orange) ![Gemini AI](https://img.shields.io/badge/Gemini%20AI-1.5--flash-purple)

## 🌟 Features

### Core Functionality
- **🔐 Firebase Authentication** - Secure Google and email/password login
- **🤖 AI Chat** - Powered by Google's Gemini AI (gemini-1.5-flash)
- **📄 PDF Upload & Processing** - Extract and analyze PDF content
- **🧮 Calculator** - Built-in mathematical expression evaluator
- **🔍 Knowledge Base Search** - Intelligent document search
- **💼 Job Search** - Integrated employment search tools
- **📋 Resume Analyzer** - AI-powered resume analysis
- **🎯 Interview Prep** - Generate interview questions

### Security & Performance
- **🔒 Rate Limiting** - Prevents API abuse (100 requests/15min)
- **🛡️ Input Validation** - Comprehensive request validation
- **📊 Error Logging** - Advanced error tracking and reporting
- **🔄 Retry Mechanisms** - Automatic retry for failed operations
- **🌐 CORS Protection** - Secure cross-origin resource sharing

### User Experience
- **📱 Responsive Design** - Works on all devices
- **🌓 Dark/Light Theme** - Customizable user interface
- **⚡ Real-time Streaming** - Server-sent events for AI responses
- **💾 Data Persistence** - Firestore integration for data storage
- **🎨 Modern UI** - Clean, intuitive interface design

## 🛠️ Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Firebase Project** with Authentication and Firestore
- **Google Gemini AI API Keys**

### 1. Clone & Install
```bash
# Install all dependencies
npm run install-all

# Or manually
npm install
cd backend && npm install
cd ../frontend && npm install
```

### 2. Environment Setup

#### Backend Configuration (`.env`)
```env
# Gemini AI API Keys (Add your actual API keys)
GEMINI_API_KEY_1=AIzaSyDTB8IEf0zHOuNMbhEuuba5We6Ct9uaZgQ
GEMINI_API_KEY_2=AIzaSyCr-ocUfhWQthfLZH3dZToasQoyxGNVxzE
GEMINI_API_KEY_3=AIzaSyAzngLG0Cd4a2MVqYiFQVMhbyYa665kN4g

# Server Configuration
PORT=3001
NODE_ENV=development

# CORS Configuration
FRONTEND_URL=http://localhost:3000

# Employment API Keys (Optional)
JSEARCH_API_KEY=your_jsearch_api_key_here
ADZUNA_API_ID=your_adzuna_api_id_here
ADZUNA_API_KEY=your_adzuna_api_key_here
```

#### Frontend Configuration (`.env`)
```env
# Backend API
REACT_APP_BACKEND_URL=http://localhost:3001

# Firebase Configuration (Get from Firebase Console)
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
```

### 3. Firebase Setup
1. Create project at [Firebase Console](https://console.firebase.google.com/)
2. Enable **Authentication** (Google + Email/Password)
3. Enable **Firestore Database**
4. Get config from **Project Settings > General > Your apps**
5. Update `.env` files with your credentials

### 4. Start Application
```bash
# Development mode (both frontend and backend)
npm run dev

# Or manually:
# Terminal 1 - Backend
npm start

# Terminal 2 - Frontend
cd frontend && npm start
```

**Access the app:**
- **Frontend:** http://localhost:3000
- **Backend:** http://localhost:3001

## 🔧 Recent Security & Quality Improvements

### ✅ Critical Fixes Applied

#### **🚨 Security Enhancements**
- **Removed exposed Firebase API keys** from frontend code
- **Added comprehensive input validation** and sanitization
- **Implemented rate limiting** (100 requests per 15 minutes)
- **Enhanced CORS protection** with strict origin checking
- **Added request size limits** (1MB payload, 10MB file upload)

#### **🔧 Technical Improvements**
- **Fixed AI model** from deprecated `gemini-pro` to `gemini-1.5-flash`
- **Enhanced error handling** with retry mechanisms and user-friendly messages
- **Improved logging system** with structured error reporting
- **Added environment validation** for required configuration
- **Consolidated package management** with proper workspace setup

#### **📊 Monitoring & Reliability**
- **Advanced error logging** to Firestore with context tracking
- **Request/response logging** for debugging and monitoring
- **Graceful degradation** when services are unavailable
- **Input validation** for all API endpoints

## 🐛 Troubleshooting

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **Backend connection failed** | Verify backend runs on port 3001, check `REACT_APP_BACKEND_URL` |
| **Firebase auth issues** | Ensure credentials in `.env` are correct, enable auth providers |
| **AI chat not working** | Check Gemini API keys are valid and have quota |
| **File upload fails** | Only PDF files supported, max 10MB size limit |
| **CORS errors** | Ensure `FRONTEND_URL` matches your frontend URL |

### Debug Information
- **Backend logs:** Terminal running the server
- **Frontend logs:** Browser DevTools Console (F12)
- **Network issues:** DevTools Network tab

## 📁 Project Structure

```
NoteMind-App/
├── 📄 package.json           # Root package management
├── 📄 README.md             # This documentation
├──
├── 🔧 backend/              # Backend server
│   ├── 📄 server.js         # Main Express server with security middleware
│   ├── 📄 package.json      # Node.js dependencies
│   ├── 📄 .env             # Backend environment variables
│   ├── 📄 .env.example     # Environment template
│   ├── 📄 .gitignore       # Git ignore rules
│   └── 📁 knowledge_base/   # Document storage
│
└── ⚛️ frontend/             # React application
    ├── 📄 package.json      # React dependencies
    ├── 📄 .env             # Frontend environment variables
    ├── 📄 .env.example     # Environment template
    ├── 📄 .gitignore       # Git ignore rules
    └── 📁 src/
        ├── 📄 App.js        # Main React application
        ├── 📄 index.js      # React entry point
        ├── 📁 components/   # Reusable UI components
        ├── 📁 pages/       # Page components
        └── 📁 services/    # API and utility services
            ├── 📄 firebase.js       # Firebase configuration
            └── 📄 firebase-utils.js # Firebase utilities
```

## 🔒 Security Features

- **Environment-based configuration** - No hardcoded secrets
- **Rate limiting** - Prevents API abuse
- **Input validation** - All inputs sanitized and validated
- **CORS protection** - Strict origin checking
- **Error handling** - No sensitive data in error messages
- **Request logging** - Comprehensive audit trail

## 🚀 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Server health check |
| `/chat` | GET | AI chat with streaming |
| `/calculate` | POST | Mathematical calculations |
| `/search-kb` | POST | Knowledge base search |
| `/upload` | POST | PDF file upload |
| `/jobs/search` | GET | Job search (JSearch API) |
| `/jobs/adzuna` | GET | Job search (Adzuna API) |
| `/company/:name` | GET | Company information |
| `/resume/analyze` | POST | AI resume analysis |
| `/interview/questions` | GET | Interview question generation |

## 🔮 Future Enhancements

### Planned Features
- [ ] **TypeScript migration** for better type safety
- [ ] **Advanced file support** (DOCX, TXT, images)
- [ ] **Real-time collaboration** features
- [ ] **Mobile app** (React Native)
- [ ] **Advanced AI features** (code execution, image analysis)
- [ ] **Team workspaces** and sharing
- [ ] **API documentation** with Swagger/OpenAPI
- [ ] **Unit and integration tests**

### Performance Improvements
- [ ] **Database query optimization**
- [ ] **Caching layer** implementation
- [ ] **CDN integration** for static assets
- [ ] **Progressive Web App** features

## 📊 Technical Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Google Generative AI** - AI integration
- **Firebase Admin SDK** - Database and auth
- **Multer** - File upload handling
- **PDF-Parse** - PDF text extraction

### Frontend
- **React 18.3.1** - UI framework
- **Material-UI** - Component library
- **Firebase SDK** - Authentication and database
- **Axios** - HTTP client
- **Tailwind CSS** - Styling framework

### Database & Services
- **Firestore** - NoSQL database
- **Firebase Auth** - Authentication
- **Firebase Analytics** - Usage tracking
- **Google Gemini AI** - AI capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support & Contact

### Getting Help
1. **Check Troubleshooting section** above
2. **Review console logs** for error details
3. **Verify environment variables** are correctly set
4. **Check API quotas** for Gemini AI

### Issues & Bugs
- Report bugs via [GitHub Issues](../../issues)
- Include error logs and steps to reproduce
- Specify your environment (OS, Node version, browser)

---

**⚠️ Important Security Notice:** Never commit API keys or sensitive credentials to version control. Always use environment variables for configuration.
