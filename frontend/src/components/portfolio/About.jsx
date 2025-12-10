import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Zap } from 'lucide-react';

const About = () => {
    return (
        <section id="about" className="py-20 relative">
            <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-12 h-1 bg-primary rounded-full"></span>
                        <span className="text-primary font-mono tracking-widest uppercase text-sm">The Engine</span>
                    </div>

                    <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">
                        Powered by <span className="text-white">Advanced AI</span>
                    </h2>

                    <div className="space-y-6 text-gray-400 leading-relaxed text-lg">
                        <p className="glass-panel p-6 border-l-4 border-l-primary">
                            Stop coding from scratch. Our <span className="text-white font-semibold">neural network</span> analyzes your requirements and builds production-ready websites in seconds.
                        </p>

                        <p>
                            From complex layouts to responsive design, NoteMind handles the heavy lifting. Security and performance are baked into every line of code generated.
                        </p>
                    </div>

                    <div className="flex gap-6 mt-10">
                        <div className="flex items-center gap-3 text-sm font-mono text-gray-300">
                            <Shield className="text-accent" />
                            <span>Enterprise Security</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm font-mono text-gray-300">
                            <Zap className="text-secondary" />
                            <span>Instant Deploy</span>
                        </div>
                    </div>
                </motion.div>

                {/* Visual Content */}
                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative flex justify-center"
                >
                    <div className="relative w-80 h-96">
                        {/* Frame Effects */}
                        <div className="absolute inset-0 border-2 border-primary/30 rounded-2xl transform rotate-3" />
                        <div className="absolute inset-0 border-2 border-secondary/30 rounded-2xl transform -rotate-3" />

                        <div className="absolute inset-4 bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md rounded-xl overflow-hidden flex items-center justify-center border border-white/10 group hover:border-accent/50 transition-colors duration-500">
                            <div className="absolute inset-0 bg-grid-white/[0.05] [mask-image:linear-gradient(to_bottom,transparent,black)]"></div>

                            <div className="text-6xl text-white/20 font-display font-bold">
                                AI
                            </div>

                            {/* Scanning Line Animation */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-accent/50 shadow-[0_0_20px_rgba(75,255,179,0.5)] animate-scan" style={{ animationDuration: '3s' }}></div>
                        </div>

                        {/* Floating Badges */}
                        <div className="absolute -top-4 -right-4 bg-dark border border-gray-800 p-3 rounded-lg shadow-xl flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-xs font-mono text-gray-400">Processing</span>
                        </div>
                    </div>
                </motion.div>

            </div>
        </section>
    );
};

export default About;
