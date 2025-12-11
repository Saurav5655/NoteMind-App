import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithPopup } from '../services/firebase';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { createUserProfile } from '../services/firebase-utils';

import AuthModal from '../components/auth/AuthModal';
import Navbar from '../components/portfolio/Navbar';
import Hero from '../components/portfolio/Hero';

const LandingPage = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authModalView, setAuthModalView] = useState('signup');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [firebaseStatus, setFirebaseStatus] = useState('checking');
    const navigate = useNavigate();

    useEffect(() => {
        const checkFirebase = async () => {
            if (auth) {
                setFirebaseStatus('ready');
            } else {
                setFirebaseStatus('error');
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
        <div className="min-h-screen relative overflow-hidden bg-transparent font-sans text-white">
            <Navbar
                onLogin={() => openAuthModal('login')}
                onSignup={() => openAuthModal('signup')}
            />

            <main className="container mx-auto px-4 pt-10">
                <Hero onSignup={() => openAuthModal('signup')} />
            </main>

            {/* Simple Footer */}
            <footer className="py-8 text-center text-sm text-gray-500 border-t border-white/5 mt-auto">
                <p>&copy; {new Date().getFullYear()} NoteMind AI. All rights reserved.</p>
            </footer>

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
