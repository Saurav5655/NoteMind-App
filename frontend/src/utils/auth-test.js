// Utility for testing Firebase authentication setup
// Use this to debug authentication issues

import { auth } from '../services/firebase';

export const testFirebaseConfig = async () => {
  console.log('🔥 Testing Firebase Configuration...');

  try {
    // Check if Firebase is initialized
    if (!auth) {
      console.error('❌ Firebase auth not initialized');
      return { success: false, error: 'Auth not initialized' };
    }

    console.log('✅ Firebase configured:', {
      currentUser: auth.currentUser?.email || 'No user signed in',
      projectId: auth.app.options.projectId,
      authDomain: auth.app.options.authDomain
    });

    return {
      success: true,
      config: {
        projectId: auth.app.options.projectId,
        authDomain: auth.app.options.authDomain,
        apiKey: auth.app.options.apiKey.substring(0, 20) + '...', // Partial key for security
      }
    };
  } catch (error) {
    console.error('❌ Firebase config test failed:', error);
    return { success: false, error: error.message };
  }
};

export const testGoogleSignIn = async () => {
  console.log('🧪 Testing Google Sign-In capability...');

  try {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      return { success: false, error: 'Not in browser environment' };
    }

    // Check for potential blockers
    const hasPopupBlocker = () => {
      const testPopup = window.open('', '_blank', 'width=1,height=1');
      if (!testPopup) return true;
      testPopup.close();
      return false;
    };

    if (hasPopupBlocker()) {
      console.warn('⚠️ Popup blocker detected - this may prevent Google sign-in');
    }

    return {
      success: true,
      popupBlocked: hasPopupBlocker(),
      userAgent: navigator.userAgent,
      location: window.location.origin
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Call this function manually in browser console to test
export const runFullAuthTest = async () => {
  console.log('🚀 Starting Full Authentication Test...\n');

  // Test 1: Firebase Config
  const configTest = await testFirebaseConfig();
  console.log('\n📋 Config Test Result:', configTest);

  // Test 2: Environment Check
  console.log('\n🌍 Environment Test:');
  console.log('User Agent:', navigator.userAgent);
  console.log('Protocol:', window.location.protocol);
  console.log('Host:', window.location.host);

  // Test 3: Google Sign-In Check
  const googleTest = await testGoogleSignIn();
  console.log('\n🔐 Google Sign-In Test:', googleTest);

  console.log('\n✨ Test complete! Check results above for issues.');
  return {
    configTest,
    googleTest,
    environment: {
      protocol: window.location.protocol,
      host: window.location.host,
      isLocalhost: window.location.hostname === 'localhost'
    }
  };
};
