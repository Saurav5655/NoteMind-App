import React from 'react';

const HeroSection = ({ openSignupModal }) => {
    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl opacity-30 animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-border mb-8 animate-fade-in">
                    <span className="text-xl">✨</span>
                    <span className="text-sm font-medium">AI-Powered Productivity</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent animate-slide-up">
                    Transform Your <span className="text-primary">Ideas</span><br />
                    Into Intelligent Notes
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up delay-100">
                    Experience the future of note-taking with AI that understands, organizes,
                    and enhances your thoughts. Join thousands of users who&apos;ve revolutionized
                    their productivity.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
                    <button
                        onClick={openSignupModal}
                        className="h-12 px-8 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2"
                    >
                        <span>🚀</span> Start Free Today
                    </button>
                    <button className="h-12 px-8 rounded-full bg-secondary text-secondary-foreground font-medium hover:bg-secondary/80 transition-all hover:scale-105 flex items-center gap-2">
                        <span>▶️</span> Watch Demo
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-20 border-t border-border pt-10">
                    {[
                        { number: '10K+', label: 'Active Users' },
                        { number: '1M+', label: 'Notes Created' },
                        { number: '99.9%', label: 'Uptime' }
                    ].map((stat, i) => (
                        <div key={i} className="text-center">
                            <div className="text-3xl font-bold text-foreground">{stat.number}</div>
                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;