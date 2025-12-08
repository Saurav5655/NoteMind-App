import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, signInWithPopup } from '../services/firebase';
import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { createUserProfile } from '../services/firebase-utils';

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
        <div className="landing-page font-[Inter] bg-white text-gray-900">
            {/* HERO SECTION */}
            <section id="hero" className="text-center py-24 px-6">
                <h1 className="text-5xl font-bold mb-6">
                    Build AI-Powered Landing Pages in Minutes
                </h1>

                <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
                    Use AI to design, generate, customize, and publish beautiful landing pages —
                    without writing a single line of code.
                </p>

                <button
                    onClick={() => openAuthModal('signup')}
                    className="bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
                >
                    Get Started Free
                </button>
            </section>

            {/* TRUST / SOCIAL PROOF SECTION */}
            <section id="trusted" className="bg-gray-50 py-12 px-6">
                <p className="text-center text-gray-500 uppercase mb-6">
                    Trusted by over <strong>500,000+</strong> creators & founders
                </p>

                <div className="flex justify-center gap-10 opacity-75 flex-wrap">
                    <div className="h-10 w-32 bg-gray-300 rounded"></div>
                    <div className="h-10 w-32 bg-gray-300 rounded"></div>
                    <div className="h-10 w-32 bg-gray-300 rounded"></div>
                    <div className="h-10 w-32 bg-gray-300 rounded"></div>
                </div>
            </section>

            {/* FEATURES SECTION */}
            <section id="features" className="py-20 px-6">
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

                    <div>
                        <h2 className="text-4xl font-bold mb-6">Why Choose Our Platform?</h2>

                        <ul className="space-y-4 text-lg text-gray-700">
                            <li>⚡ AI-generated modern layouts in seconds</li>
                            <li>🎨 Fully customizable drag-and-drop editor</li>
                            <li>🔌 Built-in API + CRM + form integrations</li>
                            <li>📈 SEO-ready + fast loading performance</li>
                            <li>🧠 Smart content personalization</li>
                        </ul>
                    </div>

                    {/* Image placeholder */}
                    <div className="h-80 bg-gray-200 rounded-lg shadow-inner"></div>
                </div>
            </section>

            {/* HOW IT WORKS SECTION */}
            <section id="how-it-works" className="bg-white py-20 px-6">
                <h3 className="text-3xl font-semibold text-center mb-14">How It Works</h3>

                <div className="container mx-auto grid md:grid-cols-3 gap-12 text-center">

                    <div>
                        <h4 className="text-2xl font-bold mb-2">1. Describe Your Idea</h4>
                        <p className="text-gray-600">Tell the AI what page you want and who it is for.</p>
                    </div>

                    <div>
                        <h4 className="text-2xl font-bold mb-2">2. Generate Instantly</h4>
                        <p className="text-gray-600">AI builds your entire landing page in seconds.</p>
                    </div>

                    <div>
                        <h4 className="text-2xl font-bold mb-2">3. Customize & Publish</h4>
                        <p className="text-gray-600">Edit text, images, layout — then deploy anywhere.</p>
                    </div>

                </div>
            </section>

            {/* UI FEATURES / HIGHLIGHTS */}
            <section id="ui-features" className="bg-gray-100 py-20 px-6">
                <h4 className="text-3xl font-bold text-center mb-12">
                    Features You&apos;ll Love
                </h4>

                <div className="container mx-auto grid md:grid-cols-3 gap-8">

                    <div className="bg-white p-8 rounded-xl shadow">
                        <h5 className="text-xl font-semibold mb-2">Instant UI Generation</h5>
                        <p>Create beautiful layouts instantly using AI-powered tools.</p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow">
                        <h5 className="text-xl font-semibold mb-2">Simple Visual Editor</h5>
                        <p>Edit everything inline — text, buttons, sections, images.</p>
                    </div>

                    <div className="bg-white p-8 rounded-xl shadow">
                        <h5 className="text-xl font-semibold mb-2">High-Conversion Templates</h5>
                        <p>Use proven designs optimized for marketing conversion.</p>
                    </div>

                </div>
            </section>

            {/* TESTIMONIALS */}
            <section id="testimonials" className="py-20 px-6">
                <h5 className="text-3xl font-bold text-center mb-10">
                    What Users Are Saying
                </h5>

                <blockquote className="max-w-2xl mx-auto text-center text-gray-700 italic">
                    “I built my entire landing page in under 10 minutes with this tool.
                    Clean UI, powerful editor, and amazing AI results.”
                    <br /><br />
                    — Startup Founder
                </blockquote>
            </section>

            {/* FINAL CTA SECTION */}
            <section id="final-cta" className="bg-blue-600 text-white py-20 text-center px-6">
                <h4 className="text-4xl font-bold mb-4">Ready to Build Your Page?</h4>
                <p className="text-lg mb-6">Start creating your custom landing page with the power of AI.</p>

                <button
                    onClick={() => openAuthModal('signup')}
                    className="bg-white text-blue-700 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-gray-200 transition"
                >
                    Start Free Now
                </button>
            </section>

            {/* FOOTER */}
            <footer className="bg-gray-900 text-gray-400 py-16 px-6">
                <div className="container mx-auto grid md:grid-cols-3 gap-10">

                    <div>
                        <h6 className="text-white font-bold mb-3">Product</h6>
                        <ul className="space-y-1">
                            <li><a href="#" className="hover:text-white">Features</a></li>
                            <li><a href="#" className="hover:text-white">Pricing</a></li>
                            <li><a href="#" className="hover:text-white">Templates</a></li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="text-white font-bold mb-3">Company</h6>
                        <ul className="space-y-1">
                            <li><a href="#" className="hover:text-white">About</a></li>
                            <li><a href="#" className="hover:text-white">Careers</a></li>
                            <li><a href="#" className="hover:text-white">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h6 className="text-white font-bold mb-3">Support</h6>
                        <ul className="space-y-1">
                            <li><a href="#" className="hover:text-white">Help Center</a></li>
                            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                        </ul>
                    </div>

                </div>
            </footer>

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
        </div>
    );
};

export default LandingPage;
