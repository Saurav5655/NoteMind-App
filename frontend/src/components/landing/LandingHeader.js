import React from 'react';

const LandingHeader = ({ setShowLoginModal, setError, setEmail, setPassword }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-lg border-b border-white/5">
            <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lovable-purple to-lovable-blue flex items-center justify-center text-xl shadow-lg shadow-lovable-purple/20">🧠</div>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent tracking-tight">
                        NoteMind
                    </h1>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Features</a>
                    <a href="#about" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">About</a>
                    <button
                        onClick={() => {
                            setShowLoginModal(true);
                            setError('');
                            setEmail('');
                            setPassword('');
                        }}
                        className="px-6 py-2.5 rounded-full bg-white/5 text-white text-sm font-medium hover:bg-white/10 transition-all border border-white/10 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    >
                        Sign In
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default LandingHeader;
