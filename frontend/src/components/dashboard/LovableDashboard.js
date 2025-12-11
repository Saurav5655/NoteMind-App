import React, { useState } from 'react';
import { Paperclip, MessageSquare, Mic, ArrowUp } from 'lucide-react';
// Sidebar removed
import Workbench from '../builder/Workbench';

const LovableDashboard = ({ user }) => {
    const [view, setView] = useState('dashboard'); // 'dashboard' or 'builder'
    const [prompt, setPrompt] = useState('');
    const [activeTab, setActiveTab] = useState('home');

    const handleStartBuild = (e) => {
        e.preventDefault();
        if (!prompt.trim()) return;
        setView('builder');
    };

    if (view === 'builder') {
        return <Workbench user={user} initialPrompt={prompt} onBack={() => setView('dashboard')} />;
    }

    return (
        <div className="flex w-full h-screen bg-white">
            {/* Sidebar Removed per user request */}

            <main className="flex-1 relative overflow-hidden flex flex-col">
                {/* Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-purple-100 opacity-60 pointer-events-none" />
                <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-gradient-to-l from-blue-300/30 to-purple-400/30 blur-[120px] rounded-full pointer-events-none mix-blend-multiply" />

                {/* Header Actions */}
                <div className="absolute top-4 right-4 flex gap-2 z-10">
                    <button className="w-8 h-8 rounded-lg hover:bg-black/5 flex items-center justify-center transition-colors">
                        <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="9" y1="3" x2="9" y2="21" /></svg>
                    </button>
                </div>

                {/* Hero Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-4 z-10 -mt-20">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-12 tracking-tight text-center">
                        What should we build{user?.displayName ? `, ${user.displayName.split(' ')[0]}` : ''}?
                    </h1>

                    {/* Input Area */}
                    <div className="w-full max-w-2xl">
                        <form onSubmit={handleStartBuild}>
                            <div className="bg-[#FFFDF8] rounded-3xl p-4 shadow-xl shadow-black/5 border border-gray-100 transition-shadow focus-within:shadow-2xl focus-within:ring-1 focus-within:ring-black/5">
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Ask Lovable to create a prototype..."
                                    className="w-full h-24 bg-transparent resize-none focus:outline-none text-lg text-gray-800 placeholder-gray-400 font-light"
                                />

                                <div className="flex items-center justify-between mt-2 pt-2">
                                    <div className="flex items-center gap-2">
                                        <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors">
                                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></svg>
                                        </button>
                                        <button type="button" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 text-sm font-medium text-gray-600 transition-colors">
                                            <Paperclip className="w-4 h-4" />
                                            <span>Attach</span>
                                        </button>
                                        <button type="button" className="flex items-center gap-2 px-3 py-1.5 rounded-full hover:bg-gray-100 text-sm font-medium text-gray-600 transition-colors">
                                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
                                            <span>Theme</span>
                                            <svg className="w-3 h-3 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9l6 6 6-6" /></svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-gray-100 cursor-pointer text-gray-500 text-sm font-medium transition-colors">
                                            <MessageSquare className="w-4 h-4" />
                                            <span>Chat</span>
                                        </div>
                                        <button type="button" className="p-2 rounded-full hover:bg-gray-100 text-gray-400 transition-colors">
                                            <Mic className="w-5 h-5" />
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={!prompt.trim()}
                                            className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${prompt.trim()
                                                ? 'bg-black text-white hover:scale-105 shadow-lg'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            <ArrowUp className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Simplified: No templates, just the simple footer */}
                <div className="mt-8 mb-12 text-center text-gray-400 text-sm">
                    Enter a prompt to generate your app instantly.
                </div>
            </main>
        </div>
    );
};

export default LovableDashboard;
