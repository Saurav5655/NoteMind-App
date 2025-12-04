import React from 'react';

const CTASection = ({ openSignupModal }) => {
    return (
        <section className="py-24 px-6 bg-background relative overflow-hidden">
            <div className="absolute inset-0 bg-primary/5 -skew-y-3 transform origin-top-left z-0"></div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Productivity?</h2>
                <p className="text-xl text-muted-foreground mb-10">Join thousands of users who have revolutionized their note-taking experience.</p>

                <button
                    onClick={openSignupModal}
                    className="h-14 px-8 rounded-full bg-primary text-primary-foreground text-lg font-semibold hover:bg-primary/90 transition-all hover:scale-105 shadow-lg shadow-primary/25 flex items-center gap-3 mx-auto"
                >
                    <span>🚀</span>
                    Start Your Journey
                </button>

                <div className="flex flex-wrap justify-center gap-8 mt-12 text-sm font-medium text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <span className="text-green-500">✅</span>
                        <span>Free forever</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-green-500">✅</span>
                        <span>No credit card required</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-green-500">✅</span>
                        <span>Setup in 30 seconds</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
