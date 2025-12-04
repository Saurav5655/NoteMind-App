import {
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  addDoc,
  getDocs,
  deleteDoc,
  Timestamp
} from "firebase/firestore";
import { db } from "./firebase";

// User Profile Management
export const createUserProfile = async (user) => {
  try {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      const { displayName, email, photoURL, emailVerified } = user;
      const createdAt = Timestamp.now();

      await setDoc(userRef, {
        displayName,
        email,
        photoURL,
        emailVerified,
        createdAt,
        lastLogin: createdAt,
        preferences: {
          theme: 'dark',
          notifications: true,
          language: 'en'
        }
      });
      return { success: true, isNewUser: true };
    } else {
      // Update last login
      await updateDoc(userRef, {
        lastLogin: Timestamp.now()
      });
      return { success: true, isNewUser: false };
    }
  } catch (error) {
    console.error("Error creating user profile:", error);
    return { success: false, error: error.message };
  }
};

// Chat History Management
export const saveChatMessage = async (userId, message) => {
  try {
    const chatRef = collection(db, "users", userId, "chatHistory");
    await addDoc(chatRef, {
      ...message,
      timestamp: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving chat message:", error);
    return { success: false, error: error.message };
  }
};

export const getChatHistory = async (userId) => {
  try {
    const chatRef = collection(db, "users", userId, "chatHistory");
    const q = query(chatRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    const messages = [];
    querySnapshot.forEach((doc) => {
      messages.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, messages };
  } catch (error) {
    console.error("Error getting chat history:", error);
    return { success: false, error: error.message };
  }
};

// Real-time chat history listener
export const subscribeToChatHistory = (userId, callback) => {
  try {
    const chatRef = collection(db, "users", userId, "chatHistory");
    const q = query(chatRef, orderBy("timestamp", "desc"));

    return onSnapshot(q, (querySnapshot) => {
      const messages = [];
      querySnapshot.forEach((doc) => {
        messages.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(messages);
    });
  } catch (error) {
    console.error("Error subscribing to chat history:", error);
    return null;
  }
};

// User Preferences Management
export const updateUserPreferences = async (userId, preferences) => {
  try {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
      preferences: {
        ...preferences,
        updatedAt: Timestamp.now()
      }
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating user preferences:", error);
    return { success: false, error: error.message };
  }
};

export const getUserPreferences = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { success: true, preferences: userSnap.data().preferences };
    } else {
      return { success: false, error: "User not found" };
    }
  } catch (error) {
    console.error("Error getting user preferences:", error);
    return { success: false, error: error.message };
  }
};

// Knowledge Base Management
export const saveToKnowledgeBase = async (userId, content, metadata = {}) => {
  try {
    const kbRef = collection(db, "users", userId, "knowledgeBase");
    await addDoc(kbRef, {
      content,
      metadata,
      timestamp: Timestamp.now(),
      type: metadata.type || 'document'
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving to knowledge base:", error);
    return { success: false, error: error.message };
  }
};

export const searchKnowledgeBase = async (userId, searchQuery) => {
  try {
    const kbRef = collection(db, "users", userId, "knowledgeBase");
    const q = query(kbRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    const results = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const content = data.content.toLowerCase();
      const query = searchQuery.toLowerCase();

      if (content.includes(query)) {
        results.push({
          id: doc.id,
          ...data,
          relevance: calculateRelevance(content, query)
        });
      }
    });

    // Sort by relevance
    results.sort((a, b) => b.relevance - a.relevance);

    return { success: true, results };
  } catch (error) {
    console.error("Error searching knowledge base:", error);
    return { success: false, error: error.message };
  }
};

// Helper function to calculate relevance score
const calculateRelevance = (content, query) => {
  const queryWords = query.split(' ');
  let score = 0;

  queryWords.forEach(word => {
    const occurrences = (content.match(new RegExp(word, 'g')) || []).length;
    score += occurrences;
  });

  return score;
};

// Notes Management (for future note-taking features)
export const saveNote = async (userId, note) => {
  try {
    const notesRef = collection(db, "users", userId, "notes");
    await addDoc(notesRef, {
      ...note,
      timestamp: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving note:", error);
    return { success: false, error: error.message };
  }
};

export const getNotes = async (userId) => {
  try {
    const notesRef = collection(db, "users", userId, "notes");
    const q = query(notesRef, orderBy("updatedAt", "desc"));
    const querySnapshot = await getDocs(q);

    const notes = [];
    querySnapshot.forEach((doc) => {
      notes.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, notes };
  } catch (error) {
    console.error("Error getting notes:", error);
    return { success: false, error: error.message };
  }
};

export const subscribeToNotes = (userId, callback) => {
  try {
    const notesRef = collection(db, "users", userId, "notes");
    const q = query(notesRef, orderBy("updatedAt", "desc"));

    return onSnapshot(q, (querySnapshot) => {
      const notes = [];
      querySnapshot.forEach((doc) => {
        notes.push({
          id: doc.id,
          ...doc.data()
        });
      });
      callback(notes);
    });
  } catch (error) {
    console.error("Error subscribing to notes:", error);
    return null;
  }
};

export const updateNote = async (userId, noteId, updates) => {
  try {
    const noteRef = doc(db, "users", userId, "notes", noteId);
    await updateDoc(noteRef, {
      ...updates,
      updatedAt: Timestamp.now()
    });
    return { success: true };
  } catch (error) {
    console.error("Error updating note:", error);
    return { success: false, error: error.message };
  }
};

export const deleteNote = async (userId, noteId) => {
  try {
    const noteRef = doc(db, "users", userId, "notes", noteId);
    await deleteDoc(noteRef);
    return { success: true };
  } catch (error) {
    console.error("Error deleting note:", error);
    return { success: false, error: error.message };
  }
};

// Enhanced error logging with better error handling
export const logError = async (userId, error, context = {}) => {
  try {
    // Only log if we have a valid database connection
    if (!db) {
      console.error("Database not initialized, cannot log error");
      return;
    }

    const errorsRef = collection(db, "errorLogs");
    await addDoc(errorsRef, {
      userId: userId || 'anonymous',
      error: error.message || String(error),
      stack: error.stack || 'No stack trace available',
      context: {
        ...context,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString()
      },
      timestamp: Timestamp.now(),
      severity: context.severity || 'medium'
    });

    console.error("Error logged to database:", {
      userId,
      error: error.message,
      context
    });
  } catch (logError) {
    console.error("Failed to log error to database:", logError);
    // Fallback to console logging if database logging fails
    console.error("Original error:", error);
  }
};

// Enhanced error handler for async operations
export const handleAsyncError = (error, context = {}) => {
  console.error(`Error in ${context.operation || 'operation'}:`, error);

  // Log to database if user is available
  if (typeof window !== 'undefined' && window.currentUser) {
    logError(window.currentUser.uid, error, {
      ...context,
      severity: 'high'
    });
  }

  return {
    success: false,
    error: error.message || 'An unexpected error occurred',
    code: error.code || 'UNKNOWN_ERROR'
  };
};

// Retry mechanism for failed operations
export const retryOperation = async (operation, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await operation();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      console.warn(`Operation failed, retrying (${i + 1}/${maxRetries}):`, error.message);
      await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
    }
  }
};
