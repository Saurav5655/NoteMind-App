import React, { useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { ArrowRight, Code, UserPlus } from 'lucide-react';

const Hero = ({ onSignup }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smoother spring animation for cursor movement
    const springConfig = { damping: 30, stiffness: 100 }; // More fluid movement
    const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), springConfig);

    const handleMouseMove = (e) => {
        const { innerWidth, innerHeight } = window;
        // Normalize mouse position from -0.5 to 0.5
        mouseX.set(e.clientX / innerWidth - 0.5);
        mouseY.set(e.clientY / innerHeight - 0.5);
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <section className="relative min-h-[85vh] flex flex-col items-center justify-center text-center py-20 px-4 perspective-1000">

            {/* Floating Tag */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-8 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-mono tracking-widest uppercase flex items-center gap-2"
            >
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                SYSTEM STATUS: ONLINE
            </motion.div>

            {/* Main Headline */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
            >
                The AI That Builds <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-secondary relative">
                    The Future
                    <span className="absolute -inset-1 blur-2xl bg-primary/20 -z-10" />
                </span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
            >
                Generate high-performance, cyber-secure websites in seconds.<br />
                The next evolution of web development is here.
            </motion.p>

            {/* Buttons */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 mb-16 z-20"
            >
                <button
                    onClick={onSignup}
                    className="px-8 py-3 rounded-xl bg-accent text-black font-bold tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(75,255,179,0.3)] hover:shadow-[0_0_30px_rgba(75,255,179,0.5)] flex items-center justify-center gap-2 hover:scale-105"
                >
                    <UserPlus className="w-5 h-5" />
                    <span>Start Building Free</span>
                </button>

                <a href="#about" className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(154,92,255,0.3)] hover:shadow-[0_0_30px_rgba(154,92,255,0.5)] flex items-center justify-center gap-2 group">
                    <Code className="w-5 h-5" />
                    <span>How It Works</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
            </motion.div>

            {/* 3D Robot Visual & Scene */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="relative w-full max-w-[700px] aspect-square md:aspect-[4/3] flex items-center justify-center pointer-events-none perspective-1000 mt-10"
            >
                {/* 1. Deep Background Glow (Ambient) */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] bg-blue-600/10 blur-[120px] rounded-full mix-blend-screen" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-primary/20 blur-[80px] rounded-full mix-blend-overlay" />

                {/* 2. The Robot Image with Bottom Fade Mask */}
                <motion.div
                    style={{ translateZ: 50 }}
                    animate={{
                        y: [-12, 12, -12],
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative z-10 w-full h-full flex items-center justify-center"
                >
                    <img
                        src="/hero-robot.png"
                        alt="AI Builder"
                        className="w-full h-full object-contain drop-shadow-2xl transform-gpu"
                        style={{
                            // Mask the bottom to blend with the page
                            maskImage: "linear-gradient(to bottom, black 60%, transparent 100%)",
                            WebkitMaskImage: "linear-gradient(to bottom, black 60%, transparent 100%)"
                        }}
                    />

                    {/* Overlay Highlight for integration */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60 mix-blend-multiply z-20"></div>
                </motion.div>

                {/* 3. Foreground HUD & Particles (Scanning Effect) */}
                <motion.div
                    style={{ translateZ: 80 }}
                    className="absolute inset-0 z-30 overflow-hidden"
                >
                    {/* Holographic Grid Floor */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[150%] h-[40%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"
                        style={{ maskImage: "radial-gradient(ellipse at center, black, transparent 70%)", WebkitMaskImage: "radial-gradient(ellipse at center, black, transparent 70%)" }}></div>

                    {/* Scanning Beam */}
                    <motion.div
                        animate={{ top: ['0%', '100%', '0%'], opacity: [0, 1, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute left-0 right-0 h-[2px] bg-accent/50 shadow-[0_0_20px_rgba(75,255,179,0.8)] blur-[1px]"
                    />

                    {/* Floating Data Points */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="hidden md:block absolute top-[20%] right-[10%] p-4 rounded-xl border border-white/10 bg-black/40 backdrop-blur-md"
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-xs font-mono text-gray-300">NEURAL LINK</span>
                        </div>
                        <div className="h-1 w-32 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                animate={{ width: ["0%", "100%"] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="h-full bg-accent"
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
