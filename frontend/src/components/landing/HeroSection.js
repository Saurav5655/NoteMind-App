```javascript
import React from 'react';

const HeroSection = ({ openSignupModal }) => {
    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-lovable-purple/20 rounded-full blur-[100px] opacity-40 animate-blob"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-lovable-pink/20 rounded-full blur-[100px] opacity-40 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-lovable-blue/10 rounded-full blur-[120px] opacity-30 animate-pulse-glow"></div>
            </div>

            <div className="max-w-7xl mx-auto text-center relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-border/50 backdrop-blur-sm mb-8 animate-fade-in hover:border-lovable-purple/50 transition-colors cursor-default">
                    <span className="text-xl animate-bounce">✨</span>
                    <span className="text-sm font-medium bg-gradient-to-r from-lovable-purple to-lovable-pink bg-clip-text text-transparent">AI-Powered Productivity</span>
                </div>

                <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-slide-up font-heading">
                    Transform Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-lovable-blue via-lovable-purple to-lovable-pink">Ideas</span><br />
                    Into Intelligent Notes
                </h1>

                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up delay-100 leading-relaxed">
                    Experience the future of note-taking with AI that understands, organizes,
                    and enhances your thoughts. Join thousands of users who&apos;ve revolutionized
                    their productivity.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up delay-200">
                    <button
                        onClick={openSignupModal}
                        className="h-14 px-8 rounded-full bg-gradient-to-r from-lovable-purple to-lovable-pink text-white font-semibold hover:opacity-90 transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] flex items-center gap-2 group"
                    >
                        <span className="group-hover:rotate-12 transition-transform">🚀</span> 
                        Start Free Today
                    </button>
                    <button className="h-14 px-8 rounded-full bg-secondary/80 backdrop-blur-sm text-secondary-foreground font-medium hover:bg-secondary transition-all hover:scale-105 border border-border/50 flex items-center gap-2">
                        <span>▶️</span> Watch Demo
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto mt-24 pt-10 border-t border-border/30 relative">
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                    {[
                        { number: '10K+', label: 'Active Users' },
                        { number: '1M+', label: 'Notes Created' },
                        { number: '99.9%', label: 'Uptime' }
                    ].map((stat, i) => (
                        <div key={i} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                            <div className="text-4xl font-bold text-foreground mb-1 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">{stat.number}</div>
                            <div className="text-sm text-muted-foreground font-medium">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;
```