import React from 'react';

const LandingHeader = ({ setShowLoginModal, setError, setEmail, setPassword }) => {
    return (
        <header className="landing-header">
            <div className="logo">
                <div className="logo-icon">🧠</div>
                <h1>NoteMind</h1>
            </div>
            <nav className="landing-nav">
                <a href="#features">Features</a>
                <a href="#about">About</a>
                <a href="#contact">Contact</a>
                <button onClick={() => {
                    console.log('Login button clicked...');
                    setShowLoginModal(true);
                    setError('');
                    setEmail('');
                    setPassword('');
                }} className="cta-button secondary">Login</button>
            </nav>
        </header>
    );
};

export default LandingHeader;
