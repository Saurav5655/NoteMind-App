import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { Linkedin, ArrowRight, Code, UserPlus } from 'lucide-react';

const Hero = ({ onSignup }) => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth spring animation for cursor movement
    const springConfig = { damping: 25, stiffness: 150 };
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
                👋 Hello World! I'm Eshan — This is my space.
            </motion.div>

            {/* Main Headline */}
            <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-tight mb-6"
            >
                Cybersecurity & <br className="hidden md:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-primary to-secondary relative">
                    Web Dev Specialist
                    <span className="absolute -inset-1 blur-2xl bg-primary/20 -z-10" />
                </span>
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-gray-400 text-lg md:text-xl max-w-2xl mb-10 leading-relaxed"
            >
                Securing, Building & Innovating<br />
                I secure digital ecosystems and craft innovative, high-performance web solutions.
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
                    <span>Sign Up</span>
                </button>

                <a href="#contact" className="px-8 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold tracking-wide transition-all duration-300 shadow-[0_0_20px_rgba(154,92,255,0.3)] hover:shadow-[0_0_30px_rgba(154,92,255,0.5)] flex items-center justify-center gap-2 group">
                    <Linkedin className="w-5 h-5" />
                    <span>Visit My LinkedIn</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <a href="#projects" className="px-8 py-3 rounded-xl border border-white/20 hover:border-secondary/50 hover:bg-secondary/10 text-white font-semibold tracking-wide transition-all duration-300 backdrop-blur-sm flex items-center justify-center gap-2">
                    <Code className="w-5 h-5 text-secondary" />
                    <span>View My Work</span>
                </a>
            </motion.div>

            {/* 3D Robot Visual */}
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                    rotateX,
                    rotateY,
                    transformStyle: "preserve-3d"
                }}
                className="relative w-full max-w-[600px] aspect-square md:aspect-[4/3] flex items-center justify-center pointer-events-none perspective-1000"
            >
                {/* Glow Effects */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-500/10 blur-[100px] rounded-full" />

                <motion.img
                    src="/hero-robot.png"
                    alt="AI Assistant"
                    style={{
                        translateZ: 50 // Parallax depth
                    }}
                    animate={{
                        y: [-10, 10, -10],
                        filter: ["drop-shadow(0 0 20px rgba(75, 163, 255, 0.2))", "drop-shadow(0 0 30px rgba(154, 92, 255, 0.3))", "drop-shadow(0 0 20px rgba(75, 163, 255, 0.2))"]
                    }}
                    transition={{
                        duration: 6,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl transform-gpu"
                />

                {/* HUD Elements Overlay */}
                <motion.div
                    style={{ translateZ: 100 }} // Float in front of robot
                    className="absolute inset-0 z-20 overflow-visible"
                >
                    {/* Left Bracket */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="absolute top-1/4 -left-10 w-32 h-32 border-l border-t border-primary/30 rounded-tl-3xl"
                    />
                    {/* Right Bracket */}
                    <motion.div
                        animate={{ opacity: [0.3, 0.8, 0.3] }}
                        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                        className="absolute bottom-1/4 -right-10 w-32 h-32 border-r border-b border-accent/30 rounded-br-3xl"
                    />

                    {/* Floating Code Snippet */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="hidden md:block absolute top-20 right-0 p-3 glass-panel text-[10px] font-mono text-accent/80 border-l-2 border-accent"
                    >
                        <div>System.Active = true;</div>
                        <div>Scanning Network...</div>
                        <div>Secure Connection: ESTABLISHED</div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
