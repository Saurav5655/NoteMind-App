import React from 'react';

const LandingHeader = ({ setShowLoginModal, setError, setEmail, setPassword }) => {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="text-2xl">🧠</div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                        NoteMind
                    </h1>
                </div>

                <nav className="hidden md:flex items-center gap-8">
                    <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
                    <a href="#about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
                    <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</a>
                    <button
                        onClick={() => {
                            setShowLoginModal(true);
                            setError('');
                            setEmail('');
                            setPassword('');
                        }}
                        className="px-4 py-2 rounded-full bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                    >
                        Login
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default LandingHeader;
