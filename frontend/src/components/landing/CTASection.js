import React from 'react';

const CTASection = ({ openSignupModal }) => {
    return (
        <section className="py-32 px-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-lovable-purple/5"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background"></div>

            <div className="max-w-5xl mx-auto text-center relative z-10">
                <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight font-heading">
                    Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-lovable-purple to-lovable-pink">Supercharge</span><br />
                    Your Brain?
                </h2>
                <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed">
                    Join thousands of students, professionals, and researchers who have
                    revolutionized their workflow with NoteMind AI.
                </p>

                <div className="flex flex-col items-center">
                    <button
                        onClick={openSignupModal}
                        className="h-16 px-12 rounded-full bg-white text-black text-lg font-bold hover:scale-105 transition-transform shadow-2xl shadow-white/10 flex items-center gap-3"
                    >
                        <span>✨</span>
                        Start Your Journey Free
                    </button>

                    <p className="mt-6 text-sm text-gray-500">
                        No credit card required · Free 14-day Pro trial · Cancel anytime
                    </p>
                </div>
            </div>
        </section>
    );
};

export default CTASection;
