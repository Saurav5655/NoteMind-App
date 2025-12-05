import React from 'react';
import Header from './Header';

const Layout = ({ children, user }) => {
    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Sidebar is now handled within MainApp/HomePage for better state control */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Header might also be redundant if MainApp has it, but leaving it for now if HomePage uses it differently */}
                {/* Actually, looking at MainApp, it has its own Sidebar and Header structure. Layout might be completely redundant. */}
                {/* But for safety, I'll just remove the Sidebar import and element here so we don't have two. */}
                <main className="flex-1 overflow-hidden relative w-full h-full">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
