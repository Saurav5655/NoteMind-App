import React, { useState, useRef, useEffect } from 'react';
import Draggable from 'react-draggable';
import { generateContent } from '../services/generativeApi';
import { subscribeToNotes, saveNote, updateNote, deleteNote } from '../services/firebase-utils';

const MainApp = ({ user }) => {
    const [notes, setNotes] = useState([]);
    const [prompt, setPrompt] = useState('');
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);

    const containerRef = useRef(null);

    // Subscribe to real-time updates
    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToNotes(user.uid, (fetchedNotes) => {
            setNotes(fetchedNotes);
        });

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

    const handleAskAI = async () => {
        if (!prompt.trim()) return;
        setIsAiLoading(true);
        try {
            const token = user ? await user.getIdToken() : null;
            const result = await generateContent({ prompt, token });
            if (result && result.text) {
                await handleAddNote('ai', result.text, { x: 300, y: 300 });
                setPrompt('');
                setShowAiModal(false);
            }
        } catch (error) {
            console.error("AI Error:", error);
            alert("Failed to generate content");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleUpdatePosition = async (id, x, y) => {
        if (!user) return;
        await updateNote(user.uid, id, { x, y });
    };

    const handleUpdateContent = async (id, content) => {
        if (!user) return;
        // Debounce this in a real app, but for now direct update is okay for simple text
        await updateNote(user.uid, id, { content });
    };

    const handleDeleteNote = async (id) => {
        if (!user) return;
        await deleteNote(user.uid, id);
    };

    return (
        <div className="relative w-full h-full bg-[#0F1117] overflow-hidden" ref={containerRef}>
            {/* Dot Grid Background */}
            <div className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#8B5CF6 1px, transparent 1px)',
                    backgroundSize: '32px 32px'
                }}
            />

            {/* Ambient Glow */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-lovable-purple/10 rounded-full blur-[120px] animate-blob"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-lovable-blue/10 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
            </div>

            {/* Notes */}
            {notes.map((note) => (
                <Draggable
                    key={note.id}
                    defaultPosition={{ x: note.x, y: note.y }}
                    position={{ x: note.x, y: note.y }}
                    bounds="parent"
                    handle=".drag-handle"
                    onStop={(e, data) => handleUpdatePosition(note.id, data.x, data.y)}
                >
                    <div className={`absolute w-80 rounded-2xl shadow-xl border border-white/10 ${note.color} flex flex-col backdrop-blur-xl bg-card/60 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] group ring-1 ring-white/5`}>
                        {/* Drag Handle */}
                        <div className="drag-handle h-10 rounded-t-2xl cursor-grab active:cursor-grabbing flex items-center px-4 justify-between border-b border-white/5 bg-gradient-to-r from-white/5 to-transparent">
                            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 flex items-center gap-2">
                                {note.type === 'ai' && <span className="text-lovable-purple animate-pulse">✨</span>}
                                {note.type}
                            </span>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                <button
                                    className="w-6 h-6 rounded-full bg-destructive/10 hover:bg-destructive text-destructive hover:text-white flex items-center justify-center transition-colors"
                                    onClick={() => handleDeleteNote(note.id)}
                                >
                                    <span className="text-xs">×</span>
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                            {note.type === 'ai' ? (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <p className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed font-sans">{note.content}</p>
                                </div>
                            ) : (
                                <textarea
                                    className="w-full bg-transparent border-none resize-none focus:ring-0 text-foreground/90 leading-relaxed placeholder:text-muted-foreground/40 font-sans text-sm"
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

            {/* Floating Toolbar */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2.5 rounded-full bg-background/60 backdrop-blur-xl border border-white/10 shadow-2xl z-50 ring-1 ring-white/20 hover:scale-105 transition-transform duration-300">
                <button
                    onClick={() => handleAddNote('text', '', { x: window.innerWidth / 2 - 160, y: window.innerHeight / 2 - 100 })}
                    className="w-12 h-12 rounded-full bg-card/50 hover:bg-lovable-blue hover:text-white text-foreground flex items-center justify-center transition-all duration-300 shadow-sm group relative"
                    title="Add Note"
                >
                    <span className="text-xl group-hover:scale-110 transition-transform">📝</span>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">New Note</span>
                </button>
                <button
                    onClick={() => setShowAiModal(true)}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-lovable-purple to-lovable-pink text-white flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-lovable-purple/50 hover:scale-110 group relative"
                    title="Ask AI"
                >
                    <span className="text-2xl group-hover:rotate-12 transition-transform">✨</span>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Ask AI</span>
                </button>
                <button className="w-12 h-12 rounded-full bg-card/50 hover:bg-lovable-teal hover:text-white text-foreground flex items-center justify-center transition-all duration-300 shadow-sm group relative">
                    <span className="text-xl group-hover:scale-110 transition-transform">🖼️</span>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">Add Image</span>
                </button>
            </div>

            {/* AI Modal */}
            {showAiModal && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
                    <div className="w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl p-6 animate-fade-in">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                            <span className="text-xl">✨</span> Ask AI
                        </h3>
                        <textarea
                            className="w-full h-32 bg-muted/50 rounded-xl p-4 mb-4 border border-transparent focus:border-primary focus:ring-0 resize-none"
                            placeholder="What would you like to create?"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowAiModal(false)}
                                className="px-4 py-2 rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAskAI}
                                disabled={isAiLoading || !prompt.trim()}
                                className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-medium disabled:opacity-50 flex items-center gap-2"
                            >
                                {isAiLoading ? 'Generating...' : 'Generate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MainApp;
