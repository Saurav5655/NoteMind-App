import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Paperclip, Loader2 } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

const Hero = ({ onSignup }) => {
    const [prompt, setPrompt] = useState('');
    const [isBuilding, setIsBuilding] = useState(false);
    // const navigate = useNavigate(); // Temporarily unused, so we comment it out or remove it to fix lint

    const handleBuild = (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;

        setIsBuilding(true);
        // Simulate "Plan -> Analyze -> Build" start
        setTimeout(() => {
            // Ideally navigate to the main builder app with the prompt
            // For now, we trigger the signup/login flow if not auth, or go to home
            onSignup();
            setIsBuilding(false);
        }, 1500);
    };

    return (
        <section className="relative min-h-[80vh] flex flex-col items-center justify-center py-20 px-4">

            {/* Main Headline */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl lg:text-6xl font-bold text-center text-white mb-10 tracking-tight"
            >
                What do you want to <span className="text-primary">build</span>?
            </motion.h1>

            {/* Prompt Input Container */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="w-full max-w-3xl relative z-10"
            >
                <form onSubmit={handleBuild} className="relative group">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/50 to-purple-600/50 rounded-2xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>

                    <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl p-4 shadow-2xl">
                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="How can NoteMind help you today?"
                            className="w-full h-32 bg-transparent text-lg text-white placeholder-gray-500 resize-none focus:outline-none font-light leading-relaxed"
                            spellCheck="false"
                        />

                        <div className="flex items-center justify-between mt-4 border-t border-white/5 pt-3">
                            <div className="flex gap-2 text-gray-400">
                                <button type="button" className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Attach context">
                                    <Paperclip className="w-5 h-5" />
                                </button>
                                <button type="button" className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Enhance prompt">
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </button>
                            </div>

                            <button
                                type="submit"
                                disabled={!prompt.trim() || isBuilding}
                                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-all ${prompt.trim()
                                    ? 'bg-white text-black hover:bg-gray-200'
                                    : 'bg-white/10 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {isBuilding ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span>Initializing...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Build It</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>

                {/* Suggestions */}
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    {['Build a Todo App', 'Create a Landing Page', 'Design a Dashboard', 'E-commerce Store'].map((suggestion, i) => (
                        <motion.button
                            key={suggestion}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + (i * 0.1) }}
                            onClick={() => setPrompt(suggestion)}
                            className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-all font-light"
                        >
                            {suggestion}
                        </motion.button>
                    ))}
                </div>
            </motion.div>
        </section>
    );
};

export default Hero;
