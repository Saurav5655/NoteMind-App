import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { subscribeToNotes, saveNote, updateNote, deleteNote } from '../services/firebase-utils';
import Sidebar from './Sidebar';
import AiChat from './AiChat';

const MainApp = ({ user }) => {
    const [notes, setNotes] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showAiPanel, setShowAiPanel] = useState(false); // Toggle for floating AI panel on dashboard
    const containerRef = useRef(null);

    // Subscribe to real-time updates
    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToNotes(
            user.uid,
            (fetchedNotes) => setNotes(fetchedNotes),
            (error) => {
                console.error("Permission denied or other error:", error);
                // Handle permission denied by maybe showing a local warning or just logging
                // For demo/dev purposes we might want to ignore it if it's intermittent
            }
        );
        return () => unsubscribe && unsubscribe();
    }, [user]);

    const handleAddNote = async (type = 'text', content = '', position = { x: 100, y: 100 }) => {
        if (!user) return;
        const newNote = {
            type,
            content: content || 'New Note',
            x: position.x,
            y: position.y,
            color: 'bg-card'
        };
        await saveNote(user.uid, newNote);
    };

    const handleUpdatePosition = async (id, x, y) => {
        if (!user) return;
        await updateNote(user.uid, id, { x, y });
    };

    const handleUpdateContent = async (id, content) => {
        if (!user) return;
        await updateNote(user.uid, id, { content });
    };

    const handleDeleteNote = async (id) => {
        if (!user) return;
        await deleteNote(user.uid, id);
    };

    return (
        <div className="flex w-full h-screen bg-[#0F1117] overflow-hidden font-sans text-gray-100">
            {/* Background Effects (Global) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage: 'radial-gradient(#8B5CF6 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-lovable-purple/10 rounded-full blur-[150px] animate-blob"></div>
                <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-lovable-blue/10 rounded-full blur-[150px] animate-blob animation-delay-2000"></div>
            </div>

            {/* Sidebar */}
            <div className="relative z-50 h-full">
                <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} user={user} />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 relative z-10 flex flex-col h-full overflow-hidden">

                {/* Top Search / Header Bar */}
                <header className="h-16 px-8 flex items-center justify-between backdrop-blur-sm border-b border-white/5">
                    <div className="flex items-center gap-4 text-gray-400">
                        <span className="text-xl">
                            {activeTab === 'dashboard' && 'Dashboard'}
                            {activeTab === 'notes' && 'My Notes'}
                            {activeTab === 'chat' && 'AI Assistant'}
                            {activeTab === 'files' && 'Documents'}
                            {activeTab === 'settings' && 'Settings'}
                        </span>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search notes..."
                            className="bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-lovable-purple/50 focus:ring-1 focus:ring-lovable-purple/50 w-64 transition-all"
                        />
                    </div>
                </header>

                {/* View Content */}
                <main className="flex-1 relative overflow-hidden" ref={containerRef}>

                    {/* DASHBOARD / NOTES CANVAS VIEW */}
                    {(activeTab === 'dashboard' || activeTab === 'notes') && (
                        <>
                            {notes.map((note) => (
                                <Draggable
                                    key={note.id}
                                    defaultPosition={{ x: note.x, y: note.y }}
                                    position={{ x: note.x, y: note.y }}
                                    bounds="parent"
                                    handle=".drag-handle"
                                    onStop={(e, data) => handleUpdatePosition(note.id, data.x, data.y)}
                                >
                                    <div className={`absolute w-80 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/10 ${note.color} flex flex-col backdrop-blur-xl bg-[#1A1D24]/80 transition-all duration-300 hover:shadow-lovable-purple/20 hover:scale-[1.01] group ring-1 ring-white/5 z-20`}>
                                        {/* Drag Handle */}
                                        <div className="drag-handle h-10 rounded-t-2xl cursor-grab active:cursor-grabbing flex items-center px-4 justify-between border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                                            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                                {note.type === 'ai' && <span className="text-lovable-purple animate-pulse">✨ AI Insight</span>}
                                                {note.type !== 'ai' && note.type}
                                            </span>
                                            <button
                                                className="w-6 h-6 rounded-full hover:bg-red-500/20 text-gray-400 hover:text-red-400 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                                                onClick={() => handleDeleteNote(note.id)}
                                            >
                                                ×
                                            </button>
                                        </div>

                                        {/* Content */}
                                        <div className="p-5">
                                            {note.type === 'ai' ? (
                                                <div className="prose prose-invert prose-sm max-w-none">
                                                    <p className="whitespace-pre-wrap text-sm text-gray-300 leading-relaxed font-sans">{note.content}</p>
                                                </div>
                                            ) : (
                                                <textarea
                                                    className="w-full bg-transparent border-none resize-none focus:ring-0 text-gray-200 leading-relaxed placeholder:text-gray-600 font-sans text-sm"
                                                    defaultValue={note.content}
                                                    placeholder="Type your thoughts..."
                                                    rows={5}
                                                    onBlur={(e) => handleUpdateContent(note.id, e.target.value)}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </Draggable>
                            ))}

                            {/* Floating Action Buttons */}
                            <div className="absolute bottom-8 right-8 flex flex-col gap-4 z-50">
                                <button
                                    onClick={() => handleAddNote('text', '', { x: 200, y: 200 })}
                                    className="w-14 h-14 rounded-full bg-white text-black shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative hover:shadow-white/20"
                                >
                                    <span className="text-2xl">IT</span>
                                    <span className="absolute right-full mr-4 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">New Note</span>
                                </button>
                                <button
                                    onClick={() => activeTab === 'dashboard' ? setShowAiPanel(!showAiPanel) : setActiveTab('chat')}
                                    className="w-14 h-14 rounded-full bg-gradient-to-tr from-lovable-purple to-lovable-blue text-white shadow-lg hover:scale-110 active:scale-95 transition-all flex items-center justify-center group relative hover:shadow-lovable-purple/40"
                                >
                                    <span className="text-2xl">✨</span>
                                    <span className="absolute right-full mr-4 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Ask AI</span>
                                </button>
                            </div>

                            {/* Floating AI Panel (Dashboard Overlay Mode) */}
                            {showAiPanel && (
                                <div className="absolute right-8 bottom-28 w-96 h-[500px] z-50 animate-slide-up">
                                    <AiChat
                                        user={user}
                                        onClose={() => setShowAiPanel(false)}
                                        onSaveToNote={(text) => {
                                            handleAddNote('ai', text, { x: 300, y: 300 });
                                            setShowAiPanel(false);
                                        }}
                                    />
                                </div>
                            )}
                        </>
                    )}

                    {/* FULL SCREEN CHAT VIEW */}
                    {activeTab === 'chat' && (
                        <div className="w-full h-full p-8 flex justify-center">
                            <div className="w-full max-w-4xl h-full">
                                <AiChat
                                    user={user}
                                    onSaveToNote={(text) => {
                                        handleAddNote('ai', text, { x: 300, y: 300 });
                                        setActiveTab('dashboard'); // Switch back to see the note
                                    }}
                                />
                            </div>
                        </div>
                    )}

                </main>
            </div>
        </div>
    );
};

export default MainApp;
