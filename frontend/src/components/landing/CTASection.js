import React from 'react';

const CTASection = ({ openSignupModal }) => {
    return (
        <section className="cta-section">
            <div className="cta-content">
                <h2>Ready to Transform Your Productivity?</h2>
                <p>Join thousands of users who have revolutionized their note-taking experience.</p>
                <button
                    className="cta-button primary large"
                    onClick={openSignupModal}
                >
                    <span className="button-icon">🚀</span>
                    Start Your Journey
                </button>
                <div className="cta-features">
                    <div className="cta-feature">
                        <span className="check-icon">✅</span>
                        <span>Free forever</span>
                    </div>
                    <div className="cta-feature">
                        <span className="check-icon">✅</span>
                        <span>No credit card required</span>
                    </div>
                    <div className="cta-feature">
                        <span className="check-icon">✅</span>
                        <span>Setup in 30 seconds</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
