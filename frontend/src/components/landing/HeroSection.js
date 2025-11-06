import React from 'react';

const HeroSection = ({ openSignupModal }) => {
    return (
        <section className="hero">
            <div className="hero-content">
                <div className="hero-badge">
                    <span className="badge-icon">✨</span>
                    <span>AI-Powered Productivity</span>
                </div>
                <h1 className="hero-title">
                    Transform Your
                    <span className="gradient-text"> Ideas</span>
                    <br />Into Intelligent Notes
                </h1>
                <p className="hero-subtitle">
                    Experience the future of note-taking with AI that understands, organizes,
                    and enhances your thoughts. Join thousands of users who&apos;ve revolutionized
                    their productivity.
                </p>
                <div className="hero-buttons">
                    <button
                        className="cta-button primary"
                        onClick={openSignupModal}
                    >
                        <span className="button-icon">🚀</span>
                        Start Free Today
                    </button>
                    <button className="cta-button secondary">
                        <span className="button-icon">▶️</span>
                        Watch Demo
                    </button>
                </div>
                <div className="hero-stats">
                    <div className="stat">
                        <span className="stat-number">10K+</span>
                        <span className="stat-label">Active Users</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">1M+</span>
                        <span className="stat-label">Notes Created</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">99.9%</span>
                        <span className="stat-label">Uptime</span>
                    </div>
                </div>
            </div>
            <div className="hero-visual">
                <div className="floating-cards">
                    <div className="card card-1">
                        <div className="card-header">
                            <div className="card-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div className="card-content">
                            <h4>Meeting Notes</h4>
                            <p>AI-generated summary and action items</p>
                            <div className="ai-badge">🤖 AI Enhanced</div>
                        </div>
                    </div>
                    <div className="card card-2">
                        <div className="card-header">
                            <div className="card-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div className="card-content">
                            <h4>Research Notes</h4>
                            <p>Automatically categorized and tagged</p>
                            <div className="tags">
                                <span className="tag">#research</span>
                                <span className="tag">#important</span>
                            </div>
                        </div>
                    </div>
                    <div className="card card-3">
                        <div className="card-header">
                            <div className="card-dots">
                                <span></span>
                                <span></span>
                                <span></span>
                            </div>
                        </div>
                        <div className="card-content">
                            <h4>Quick Ideas</h4>
                            <p>Voice-to-text with smart formatting</p>
                            <div className="voice-indicator">🎤 Recording...</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;