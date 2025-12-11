import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform, useMotionValue } from 'framer-motion';
import { Github, Linkedin, ArrowRight, Code, UserPlus } from 'lucide-react';

const Hero = () => {
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
        <section className="relative min-h-[85vh] flex items-center py-20 px-4 group">
            <div className="w-full grid md:grid-cols-2 gap-8 items-center">

                {/* Text Content - Left Side */}
                <div className="text-left z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mb-8 px-4 py-1.5 w-fit rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-mono tracking-widest uppercase flex items-center gap-2"
                    >
                        <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                        👋 Hello World! I'm Eshan
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-7xl lg:text-8xl font-display font-bold leading-tight mb-6"
                    >
                        Cyber<span className="text-transparent bg-clip-text bg-gradient-to-r from-[--primary] to-[--secondary]">Security</span> <br />
                        & Web Dev
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="text-gray-400 text-lg md:text-xl max-w-xl mb-10 leading-relaxed"
                    >
                        Securing digital ecosystems and crafting innovative, high-performance web solutions with a security-first mindset.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap gap-4"
                    >
                        <a href="#projects" className="btn-primary">
                            View My Work
                        </a>
                        <a href="#contact" className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/5 transition font-bold text-white">
                            Contact Me
                        </a>
                    </motion.div>
                </div>

                {/* Right Side - Space for 3D Robot */}
                {/* The Robot is in the background ThreeScene, but we can put a target layout here if needed. 
                    For now, keeping it empty allows the 3D element to shine. */}
                <div className="hidden md:block h-full min-h-[500px]">
                    {/* Placeholder for spacing logic if needed */}
                </div>
            </div>
        </section>
    );
};

export default Hero;
