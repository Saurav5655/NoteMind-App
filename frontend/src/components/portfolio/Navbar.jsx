import React from 'react';
import { motion } from 'framer-motion';

const Navbar = ({ onLogin, onSignup }) => {
    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                <div className="font-sans font-bold text-xl tracking-tight text-white flex items-center gap-2">
                    <span className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-black">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                        </svg>
                    </span>
                    NoteMind
                </div>

                <div className="hidden md:flex gap-8 text-sm font-medium text-gray-400">
                    {/* Removed Links as requested */}
                </div>

                <div className="flex items-center gap-4">
                    <button
                        onClick={onLogin}
                        className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                    >
                        Log In
                    </button>
                    <button
                        onClick={onSignup}
                        className="btn-primary"
                    >
                        Sign Up
                    </button>
                </div>
            </div>
        </motion.nav>
    );
};

export default Navbar;
