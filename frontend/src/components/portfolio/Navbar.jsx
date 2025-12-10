import React from 'react';
import { motion } from 'framer-motion';

const Navbar = ({ onLogin, onSignup }) => {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto glass-panel px-6 py-4 flex justify-between items-center">
                <div className="font-display font-bold text-2xl tracking-wider text-white">
                    ESHAN<span className="text-primary">.SEC</span>
                </div>

                <div className="hidden md:flex gap-8 text-sm font-medium text-gray-300">
                    {['About', 'Skills', 'Projects', 'Contact'].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="hover:text-primary transition-colors duration-300 uppercase tracking-widest text-xs"
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <button
                        onClick={onLogin}
                        className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        Log In
                    </button>
                    <button
                        onClick={onSignup}
                        className="px-5 py-2 rounded-full bg-primary/10 border border-primary/50 text-primary text-xs font-bold tracking-widest hover:bg-primary/20 transition-all duration-300 uppercase glow-btn"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
