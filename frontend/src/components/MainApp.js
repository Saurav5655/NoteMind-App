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
            <div className="absolute inset-0 opacity-20 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#4B5563 1px, transparent 1px)',
                    backgroundSize: '24px 24px'
                }}
            />

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
                    <div className={`absolute w-80 rounded-xl shadow-2xl border border-border/50 ${note.color} flex flex-col backdrop-blur-sm bg-opacity-90`}>
                        {/* Drag Handle */}
                        <div className="drag-handle h-8 bg-accent/30 rounded-t-xl cursor-grab active:cursor-grabbing flex items-center px-3 justify-between group">
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{note.type}</span>
                            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 hover:bg-red-500 cursor-pointer"
                                    onClick={() => handleDeleteNote(note.id)} />
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            {note.type === 'ai' ? (
                                <div className="prose prose-invert prose-sm max-w-none">
                                    <div className="flex items-center gap-2 mb-2 text-primary text-xs font-semibold">
                                        <span>✨</span> AI Generated
                                    </div>
                                    <p className="whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">{note.content}</p>
                                </div>
                            ) : (
                                <textarea
                                    className="w-full bg-transparent border-none resize-none focus:ring-0 text-foreground/90 leading-relaxed placeholder:text-muted-foreground/50"
                                    defaultValue={note.content}
                                    rows={4}
                                    onBlur={(e) => handleUpdateContent(note.id, e.target.value)}
                                />
                            )}
                        </div>
                    </div>
                </Draggable>
            ))}

            {/* Floating Toolbar */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 rounded-full bg-background/80 backdrop-blur-md border border-border shadow-2xl z-50">
                <button
                    onClick={() => handleAddNote('text', '', { x: window.innerWidth / 2 - 160, y: window.innerHeight / 2 - 100 })}
                    className="w-10 h-10 rounded-full bg-accent/50 hover:bg-accent flex items-center justify-center text-foreground transition-colors tooltip"
                    title="Add Note"
                >
                    <span className="text-xl">📝</span>
                </button>
                <button
                    onClick={() => setShowAiModal(true)}
                    className="w-10 h-10 rounded-full bg-primary/20 hover:bg-primary/30 text-primary flex items-center justify-center transition-colors"
                    title="Ask AI"
                >
                    <span className="text-xl">✨</span>
                </button>
                <div className="w-px h-6 bg-border mx-1" />
                <button className="w-10 h-10 rounded-full bg-accent/50 hover:bg-accent flex items-center justify-center text-foreground transition-colors">
                    <span className="text-xl">🖼️</span>
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
