import React from 'react';

const LandingFooter = () => {
    return (
        <footer className="landing-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <div className="logo">
                        <div className="logo-icon">🧠</div>
                        <h3>NoteMind</h3>
                    </div>
                    <p>Transform your ideas into intelligent notes</p>
                </div>
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>Product</h4>
                        <a href="#features">Features</a>
                        <a href="#pricing">Pricing</a>
                        <a href="#security">Security</a>
                    </div>
                    <div className="footer-column">
                        <h4>Company</h4>
                        <a href="#about">About</a>
                        <a href="#careers">Careers</a>
                        <a href="#contact">Contact</a>
                    </div>
                    <div className="footer-column">
                        <h4>Support</h4>
                        <a href="#help">Help Center</a>
                        <a href="#docs">Documentation</a>
                        <a href="#community">Community</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2024 NoteMind. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default LandingFooter;
