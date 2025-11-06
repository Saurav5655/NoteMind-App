import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';
import { auth } from '../services/firebase';
import { GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { createUserProfile, logError } from '../services/firebase-utils';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';

const LandingPage = () => {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showSignupModal, setShowSignupModal] = useState(false);
    const [showEmailSignup, setShowEmailSignup] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [firebaseStatus, setFirebaseStatus] = useState('checking');
    const navigate = useNavigate();

    // Check Firebase initialization
    useEffect(() => {
        console.log('🔥 Checking Firebase initialization...');
        const checkFirebase = async () => {
            try {
                if (auth && auth.app) {
                    console.log('✅ Firebase auth is available');
                    setFirebaseStatus('ready');
                    await auth.currentUser;
                } else {
                    console.error('❌ Firebase auth is not available');
                    setFirebaseStatus('error');
                }
            } catch (error) {
                console.error('Firebase initialization error:', error);
                setFirebaseStatus('error');
                setError('Firebase initialization failed. Please check your configuration.');
            }
        };
        checkFirebase();
    }, []);

    const handleGoogleSignIn = async () => {
        console.log('🔐 Google Sign-In button clicked');
        setLoading(true);
        setError('');

        try {
            if (!auth) {
                console.error('Firebase auth is not initialized');
                throw new Error('Firebase auth not initialized');
            }

            const provider = new GoogleAuthProvider();
            provider.addScope('email');
            provider.setCustomParameters({
                prompt: 'select_account'
            });

            console.log('🚀 Attempting signInWithPopup...');
            const authResult = await signInWithPopup(auth, provider);
            console.log('Sign in popup completed');
            
            if (!authResult || !authResult.user) {
                throw new Error('No user data received from sign in');
            }
            
            console.log('User obtained:', {
                uid: authResult.user.uid,
                email: authResult.user.email,
                displayName: authResult.user.displayName
            });

            console.log('Creating user profile...');
            const profileResult = await createUserProfile(authResult.user);

            if (profileResult.success) {
                console.log('Profile created successfully, navigating to home...');
                navigate('/home');
            } else {
                throw new Error('Failed to create user profile');
            }
        } catch (error) {
            console.error('Google sign-in error:', error);
            logError('', error, { context: 'google_signin' });

            let userMessage = 'Sign-in failed. Please try again.';

            if (error.code === 'auth/popup-closed-by-user') {
                userMessage = 'Sign-in was cancelled. Please try again.';
            } else if (error.code === 'auth/popup-blocked') {
                userMessage = 'Pop-up was blocked. Please allow pop-ups for this site.';
            } else if (error.code === 'auth/unauthorized-domain') {
                userMessage = 'This domain is not authorized for sign-in. Please check Firebase Console settings.';
            } else if (error.code === 'auth/invalid-oauth-client-id') {
                userMessage = 'Invalid OAuth client configuration. Please check Firebase Console.';
            } else if (error.code === 'auth/invalid-oauth-provider-key') {
                userMessage = 'Invalid OAuth provider key. Please check Firebase Console.';
            } else if (error.message) {
                userMessage = error.message;
            }

            setError(userMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignUp = async (e) => {
        e.preventDefault();
        console.log('📧 Email signup form submitted');
        setError('');

        if (!email || !email.trim()) {
            setError("Please enter an email address.");
            return;
        }

        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters long.");
            return;
        }

        if (firebaseStatus !== 'ready') {
            setError("Firebase is not initialized. Please try again later.");
            return;
        }

        setLoading(true);

        try {
            console.log('🔐 Attempting email signup for:', email);

            if (!auth) {
                throw new Error('Firebase auth not initialized');
            }

            const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
            const profileResult = await createUserProfile(result.user);

            if (profileResult.success) {
                navigate('/home');
            } else {
                throw new Error('Failed to create user profile');
            }
        } catch (error) {
            console.error('Email signup error:', error);
            logError('', error, { context: 'email_signup' });

            if (error.code === 'auth/email-already-in-use') {
                setError("This email is already in use.");
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const profileResult = await createUserProfile(result.user);

            if (profileResult.success) {
                navigate('/home');
            } else {
                console.warn('User profile update failed, but login succeeded');
                navigate('/home');
            }
        } catch (error) {
            console.error('Email login error:', error);
            logError('', error, { context: 'email_login' });

            if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                setError("Invalid email or password.");
            } else if (error.code === 'auth/too-many-requests') {
                setError("Too many failed attempts. Please try again later.");
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    const openSignupModal = () => {
        console.log('Opening signup modal...');
        setShowSignupModal(true);
        setShowEmailSignup(false);
        setError('');
        setEmail('');
        setPassword('');
    }


    
    
    const closeModal = () => {
        setShowLoginModal(false);
        setShowSignupModal(false);
    }

    return (
        <div className="landing-page">
            {/* Animated Background */}
            <div className="animated-bg">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <LandingHeader 
                setShowLoginModal={setShowLoginModal}
                setError={setError}
                setEmail={setEmail}
                setPassword={setPassword}
            />

            <main className="landing-main">
                <HeroSection openSignupModal={openSignupModal} />
                <FeaturesSection />
                <TestimonialsSection />
                <CTASection openSignupModal={openSignupModal} />
            </main>

            {/* Firebase Status Indicator */}
            <div style={{
                position: 'fixed',
                top: '20px',
                right: '20px',
                background: firebaseStatus === 'ready' ? '#10B981' : firebaseStatus === 'error' ? '#EF4444' : '#F59E0B',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                zIndex: 1000
            }}>
                Firebase: {firebaseStatus === 'ready' ? '✅ Ready' : firebaseStatus === 'error' ? '❌ Error' : '⏳ Checking...'}
            </div>

            { (showLoginModal || showSignupModal) && (
                <div className="modal-backdrop" onClick={closeModal}>
                    { showLoginModal && (
                        <div className="modal" onClick={(e) => e.stopPropagation()}>
                            <div className="modal-close" onClick={closeModal}>&times;</div>
                            <div className="modal-header">
                                <h2>Welcome Back</h2>
                                <p>Sign in to your account</p>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEmailLogin}>
                                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                    {error && <div className="error-message">{error}</div>}
                                    <button className="cta-button primary" type="submit" disabled={loading}>
                                        {loading ? 'Signing in...' : 'Sign In'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            )}

            { showSignupModal && (
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                    <div className="modal-close" onClick={closeModal}>&times;</div>
                    <div className="modal-header">
                        <h2>Create Your Account</h2>
                        <p>Join thousands of users who&apos;ve transformed their productivity</p>
                    </div>
                    <div className="modal-body">
                        { !showEmailSignup ? (
                            <>
                                <button 
                                    className="google-signin-button"
                                    onClick={handleGoogleSignIn} 
                                    disabled={loading || firebaseStatus !== 'ready'}
                                >
                                    <span className="google-icon">🔍</span>
                                    {loading ? 'Signing in...' : 'Continue with Google'}
                                </button>
                                <div className="divider">
                                    <span>or</span>
                                </div>
                                <button 
                                    className="cta-button secondary" 
                                    onClick={() => setShowEmailSignup(true)}
                                    disabled={firebaseStatus !== 'ready'}
                                >
                                    Continue with Email
                                </button>
                            </>
                        ) : (
                            <form onSubmit={handleEmailSignUp}>
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                                {error && <div className="error-message">{error}</div>}
                                <button className="cta-button primary" type="submit" disabled={loading}>
                                    {loading ? 'Creating Account...' : 'Create Account'}
                                </button>
                                <button className="cta-button secondary" type="button" onClick={() => setShowEmailSignup(false)}>Back</button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <LandingFooter />
        </div>
    );
};

export default LandingPage;
