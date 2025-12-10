import React from 'react';
import Navbar from './Navbar';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-dark text-white relative overflow-hidden">
            {/* Background Elements */}
            <div className="fixed inset-0 cyber-grid opacity-20 pointer-events-none z-0" />
            <div className="fixed top-0 left-0 w-full h-[500px] bg-primary/20 blur-[150px] rounded-full -translate-y-1/2 pointer-events-none z-0" />

            <div className="relative z-10 flex flex-col min-h-screen">
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
