import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithPopup } from '../services/firebase';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { createUserProfile } from '../services/firebase-utils';

import AuthModal from '../components/auth/AuthModal';

// Portfolio Components
import Navbar from '../components/portfolio/Navbar';
import Hero from '../components/portfolio/Hero';
import About from '../components/portfolio/About';
import Skills from '../components/portfolio/Skills';
import Projects from '../components/portfolio/Projects';
import Contact from '../components/portfolio/Contact';

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
        <div className="portfolio-wrapper min-h-screen relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none z-0" />
            <div className="fixed top-0 left-0 w-full h-[500px] bg-portfolio-primary/20 blur-[150px] rounded-full -translate-y-1/2 pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col min-h-screen">
                <Navbar
                    onLogin={() => openAuthModal('login')}
                    onSignup={() => openAuthModal('signup')}
                />

                <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
                    <Hero onSignup={() => openAuthModal('signup')} />
                    <About />
                    <Skills />
                    <Projects />
                    <Contact />
                </main>

                <footer className="py-6 text-center text-sm text-gray-400/60 z-10 glass-panel mx-4 mb-4">
                    <span className="flex items-center justify-center gap-2">
                        Built with ❤️ + AI Robotics
                    </span>
                </footer>
            </div>

            {/* Firebase Status */}
            <div style={{ position: 'fixed', top: '20px', left: '20px', background: firebaseStatus === 'ready' ? '#10B981' : '#EF4444', color: 'white', padding: '8px 16px', borderRadius: '20px', fontSize: '14px', zIndex: 1000 }}>
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
        </div>
    );
};

export default LandingPage;
