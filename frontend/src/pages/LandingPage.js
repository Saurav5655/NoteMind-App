import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithPopup } from '../services/firebase';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { createUserProfile } from '../services/firebase-utils';
import HeroSection from '../components/landing/HeroSection';
import FeaturesSection from '../components/landing/FeaturesSection';
import TestimonialsSection from '../components/landing/TestimonialsSection';
import CTASection from '../components/landing/CTASection';
import LandingHeader from '../components/landing/LandingHeader';
import LandingFooter from '../components/landing/LandingFooter';
import AuthModal from '../components/auth/AuthModal';

const LandingPage = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('signup'); // 'login' or 'signup'
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [firebaseStatus, setFirebaseStatus] = useState('checking');
    const navigate = useNavigate();

    // Check Firebase initialization
    useEffect(() => {
        console.log('🔥 Checking Firebase initialization...');
        const checkFirebase = async () => {
            try {
                if (auth) {
                    console.log('✅ Firebase auth is available');
                    setFirebaseStatus('ready');
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

    const openAuthModal = (view = 'signup') => {
        setAuthModalView(view);
        setIsAuthModalOpen(true);
        setError('');
    };

    const handleGoogleSignIn = async () => {
        setLoading(true);
        setError('');
        try {
            if (!auth) throw new Error('Firebase auth not initialized');
            const provider = new GoogleAuthProvider();
            const authResult = await signInWithPopup(auth, provider);
            const profileResult = await createUserProfile(authResult.user);
            if (profileResult.success) navigate('/home');
        } catch (error) {
            console.error('Google sign-in error:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignUp = async (email, password) => {
        setLoading(true);
        setError('');
        try {
            if (!auth) throw new Error('Firebase auth not initialized');
            if (password.length < 6) throw new Error("Password must be at least 6 characters.");
            const result = await createUserWithEmailAndPassword(auth, email.trim(), password);
            const profileResult = await createUserProfile(result.user);
            if (profileResult.success) navigate('/home');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (email, password) => {
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home');
        } catch (error) {
            setError("Invalid email or password.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing-page">
            <LandingHeader
                setShowLoginModal={() => openAuthModal('login')}
                setError={setError}
                setEmail={() => { }}
                setPassword={() => { }}
            />

            <main className="landing-main">
                <HeroSection openSignupModal={() => openAuthModal('signup')} />
                <FeaturesSection />
                <TestimonialsSection />
                <CTASection openSignupModal={() => openAuthModal('signup')} />
            </main>

            {/* Firebase Status */}
            <div style={{ position: 'fixed', top: '20px', right: '20px', background: firebaseStatus === 'ready' ? '#10B981' : '#EF4444', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', zIndex: 1000 }}>
                Firebase: {firebaseStatus === 'ready' ? '✅ Ready' : '❌ Error'}
            </div>

            <AuthModal
                isOpen={isAuthModalOpen}
                initialView={authModalView}
                onClose={() => setIsAuthModalOpen(false)}
                onLogin={handleEmailLogin}
                onSignup={handleEmailSignUp}
                onGoogleSignIn={handleGoogleSignIn}
                error={error}
                loading={loading}
                firebaseStatus={firebaseStatus}
                clearError={() => setError('')}
            />

            <LandingFooter />
        </div>
    );
};

export default LandingPage;
