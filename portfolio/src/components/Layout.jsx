import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen relative overflow-hidden pointer-events-none">
            {/* Content Wrapper - Pointer events enabled for interaction */}
            <div className="relative z-10 flex flex-col min-h-screen pointer-events-auto">
                <Navbar />
                <main className="flex-grow container mx-auto px-4 pt-24 pb-12">
                    {children}
                </main>

                <footer className="py-6 text-center text-sm text-gray-400/60 z-10 glass-panel mx-4 mb-4">
                    <span className="flex items-center justify-center gap-2">
                        Built with ❤️ + AI Robotics
                    </span>
                </footer>
            </div>
        </div>
    );
};

export default Layout;
