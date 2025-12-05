import React, { useState, useEffect } from 'react';

const AuthModal = ({ isOpen, onClose, initialView = 'signup', onLogin, onSignup, onGoogleSignIn, error, loading, firebaseStatus, clearError }) => {
    const [view, setView] = useState(initialView);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        if (isOpen) {
            setView(initialView);
            setEmail('');
            setPassword('');
            if (clearError) clearError();
        }
    }, [isOpen, initialView, clearError]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        if (view === 'login') {
            onLogin(email, password);
        } else {
            onSignup(email, password);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in" onClick={onClose}>
            <div
                className="relative w-full max-w-md bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_0_50px_-12px_rgba(139,92,246,0.25)] p-8 mx-4 transform transition-all"
                onClick={(e) => e.stopPropagation()}
            >
                <div onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white cursor-pointer transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-2">
                        {view === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-gray-400 text-sm">
                        {view === 'login' ? 'Enter your details to access your workspace' : 'Join thousands of users supercharging their productivity'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex p-1 mb-6 bg-white/5 rounded-lg border border-white/5">
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${view === 'login' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setView('login')}
                    >
                        Log In
                    </button>
                    <button
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${view === 'signup' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}
                        onClick={() => setView('signup')}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="email"
                            placeholder="Email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 focus:border-lovable-purple/50 focus:ring-1 focus:ring-lovable-purple/50 transition-all outline-none text-white placeholder-gray-500"
                        />
                    </div>
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 px-4 rounded-lg bg-white/5 border border-white/10 focus:border-lovable-purple/50 focus:ring-1 focus:ring-lovable-purple/50 transition-all outline-none text-white placeholder-gray-500"
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-lg font-medium bg-gradient-to-r from-lovable-purple to-lovable-pink text-white hover:opacity-90 shadow-lg shadow-lovable-purple/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Processing...' : (view === 'login' ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="relative flex items-center justify-center my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-white/10"></div>
                    </div>
                    <span className="relative bg-[#0F1115] px-2 text-sm text-gray-500">Or continue with</span>
                </div>

                <button
                    type="button"
                    onClick={onGoogleSignIn}
                    disabled={loading || firebaseStatus !== 'ready'}
                    className="w-full h-12 rounded-lg bg-white text-black font-medium hover:bg-gray-100 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                    </svg>
                    Google
                </button>
            </div>
        </div>
    );
};

export default AuthModal;
