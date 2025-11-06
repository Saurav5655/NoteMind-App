import React from 'react';

const FeaturesSection = () => {
    return (
        <section className="features" id="features">
            <div className="section-header">
                <h2>Why Choose NoteMind?</h2>
                <p>Powerful features designed for modern productivity</p>
            </div>
            <div className="features-grid">
                <div className="feature-card">
                    <div className="feature-icon">🤖</div>
                    <h3>AI-Powered Intelligence</h3>
                    <p>Smart suggestions, automatic categorization, and intelligent search that understands context.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⚡</div>
                    <h3>Lightning Fast</h3>
                    <p>Search and organize your notes in milliseconds with our optimized engine.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🔒</div>
                    <h3>Enterprise Security</h3>
                    <p>End-to-end encryption and secure cloud storage for your peace of mind.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">📱</div>
                    <h3>Cross-Platform</h3>
                    <p>Seamless sync across all your devices with real-time collaboration.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🎨</div>
                    <h3>Beautiful Design</h3>
                    <p>Clean, modern interface that makes note-taking a pleasure.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🔗</div>
                    <h3>Smart Connections</h3>
                    <p>Automatically link related notes and discover hidden connections.</p>
                </div>
            </div>
        </section>
    );
};

export default FeaturesSection;
