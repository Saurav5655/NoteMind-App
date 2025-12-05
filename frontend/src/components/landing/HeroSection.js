import React, { useState, useEffect } from 'react';

const HeroSection = ({ openSignupModal }) => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [textIndex, setTextIndex] = useState(0);
    const [displayedText, setDisplayedText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    // Typewriter phrases
    const phrases = ["Supercharged", "Optimized", "Revolutionized", "Simplified"];
    const typingSpeed = 150;
    const deletingSpeed = 75;
    const pauseTime = 1500;

    // Mouse Parallax Logic
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX - window.innerWidth / 2) / 50,
                y: (e.clientY - window.innerHeight / 2) / 50,
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // Typewriter Logic
    useEffect(() => {
        const handleTyping = () => {
            const currentPhrase = phrases[textIndex];

            if (isDeleting) {
                setDisplayedText(currentPhrase.substring(0, displayedText.length - 1));
            } else {
                setDisplayedText(currentPhrase.substring(0, displayedText.length + 1));
            }

            if (!isDeleting && displayedText === currentPhrase) {
                setTimeout(() => setIsDeleting(true), pauseTime);
            } else if (isDeleting && displayedText === "") {
                setIsDeleting(false);
                setTextIndex((prev) => (prev + 1) % phrases.length);
            }
        };

        const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed);
        return () => clearTimeout(timer);
    }, [displayedText, isDeleting, textIndex, phrases]);

    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden min-h-screen flex flex-col justify-center bg-black/5">
            {/* Interactive Background Elements (Parallax) */}
            <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
                <div
                    className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-lovable-purple/20 rounded-full blur-[120px] opacity-40 mix-blend-screen transition-transform duration-100 ease-out"
                    style={{ transform: `translate(${mousePosition.x * -2}px, ${mousePosition.y * -2}px)` }}
                />
                <div
                    className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-lovable-pink/20 rounded-full blur-[120px] opacity-40 mix-blend-screen transition-transform duration-100 ease-out"
                    style={{ transform: `translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)` }}
                />
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-lovable-blue/10 rounded-full blur-[150px] opacity-30 animate-pulse-glow transition-transform duration-100 ease-out"
                    style={{ transform: `scale(1.1) translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
                />
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
            </div>

            <div className="max-w-7xl mx-auto text-center relative z-10">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-fade-in hover:bg-white/10 transition-colors cursor-default shadow-lg shadow-lovable-purple/10">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lovable-pink opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-lovable-pink"></span>
                    </span>
                    <span className="text-sm font-medium text-white/90 tracking-wide">AI-Powered Productivity v2.0</span>
                </div>

                {/* Main Heading with Typewriter */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 animate-slide-up font-heading leading-[1.1]">
                    Your Second Brain,<br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-lovable-purple via-lovable-pink to-lovable-blue bg-[length:200%_auto] animate-gradient-x">
                        {displayedText}
                        <span className="ml-1 w-[3px] h-[1em] bg-lovable-pink inline-block animate-blink">|</span>
                    </span>
                </h1>

                {/* Subheading */}
                <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-12 animate-slide-up delay-100 leading-relaxed font-light">
                    Capture, organize, and synthesize your ideas with the power of Gemini AI.
                    The smartest way to document your life.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up delay-200 mb-20">
                    <button
                        onClick={openSignupModal}
                        className="h-14 px-10 rounded-full bg-white text-black font-bold hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] flex items-center gap-3 group relative overflow-hidden"
                    >
                        <span className="relative z-10">Start for Free</span>
                        <span className="relative z-10 group-hover:translate-x-1 transition-transform">→</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </button>

                    <button className="h-14 px-10 rounded-full bg-white/5 backdrop-blur-md text-white font-medium hover:bg-white/10 transition-all border border-white/10 flex items-center gap-3">
                        <span>▶</span> Watch Demo
                    </button>
                </div>

                {/* Dashboard Preview (3D Tilt Effect + Parallax) */}
                <div
                    className="relative max-w-5xl mx-auto animate-slide-up delay-300 perspective-1000 group"
                    style={{ transform: `rotateX(${mousePosition.y * -0.5}deg) rotateY(${mousePosition.x * 0.5}deg)` }}
                >
                    <div className="relative rounded-xl bg-gradient-to-t from-lovable-purple/20 to-transparent p-1 transform transition-transform duration-700 hover:rotate-x-2">
                        <div className="absolute inset-0 blur-3xl bg-lovable-purple/20 opacity-50 group-hover:opacity-75 transition-opacity"></div>
                        <img
                            src="/assets/dashboard-preview.png"
                            alt="App Dashboard"
                            className="relative rounded-lg shadow-2xl border border-white/10 w-full h-auto object-cover transform transition-transform"
                        />

                        {/* Floating Elements for Depth */}
                        <div
                            className="absolute -right-12 -top-12 p-4 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl animate-float hidden md:block"
                            style={{ transform: `translate(${mousePosition.x * -1}px, ${mousePosition.y * -1}px)` }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-lovable-blue/20 flex items-center justify-center text-lovable-blue">✨</div>
                                <div>
                                    <div className="text-xs text-gray-400">AI Analysis</div>
                                    <div className="text-sm font-semibold text-white">Project Optimized</div>
                                </div>
                            </div>
                        </div>

                        <div
                            className="absolute -left-8 bottom-12 p-4 bg-gray-900/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl animate-float animation-delay-2000 hidden md:block"
                            style={{ transform: `translate(${mousePosition.x * 1.5}px, ${mousePosition.y * 1.5}px)` }}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-lovable-pink/20 flex items-center justify-center text-lovable-pink">🧠</div>
                                <div className="text-sm font-semibold text-white">Idea Saved</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-32 pt-10 border-t border-white/5">
                    {[
                        { number: '10K+', label: 'Active Users' },
                        { number: '1M+', label: 'Notes Created' },
                        { number: '4.9/5', label: 'User Rating' },
                        { number: '99.9%', label: 'Uptime' }
                    ].map((stat, i) => (
                        <div key={i} className="text-center group hover:-translate-y-1 transition-transform duration-300">
                            <div className="text-3xl font-bold text-white mb-1">{stat.number}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HeroSection;