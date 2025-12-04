import React, { useState } from 'react';
import { generateContent } from '../services/generativeApi';

const MainApp = ({ user }) => {
    const [aiResponse, setAiResponse] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [prompt, setPrompt] = useState('');

    const handleAskAI = async () => {
        if (!prompt.trim()) return;

        setAiLoading(true);
        setAiResponse('');
        setAiError('');

        try {
            const token = user ? await user.getIdToken() : null;
            const result = await generateContent({ prompt, token });
            if (result && result.text) {
                setAiResponse(result.text);
            } else {
                setAiError('No response from AI.');
            }
        } catch (err) {
            setAiError(err.message || 'An error occurred while fetching the AI response.');
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* AI Assistant Section */}
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <span className="text-2xl">✨</span> AI Assistant
                </h2>
                <div className="flex gap-4">
                    <div className="flex-1">
                        <textarea
                            placeholder="Ask AI to help you brainstorm, summarize, or write notes..."
                            className="w-full min-h-[100px] p-4 rounded-lg bg-background border border-input focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-none"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <div className="mt-3 flex justify-end">
                            <button
                                onClick={handleAskAI}
                                disabled={aiLoading}
                                className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {aiLoading ? (
                                    <>
                                        <span className="animate-spin">⏳</span> Generating...
                                    </>
                                ) : (
                                    <>
                                        <span>🚀</span> Generate
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* AI Output */}
                {(aiResponse || aiError) && (
                    <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border animate-fade-in">
                        {aiError ? (
                            <p className="text-destructive">{aiError}</p>
                        ) : (
                            <div className="prose prose-invert max-w-none">
                                <h3 className="text-sm font-medium text-muted-foreground mb-2">AI Response:</h3>
                                <div className="whitespace-pre-wrap">{aiResponse}</div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Recent Notes Grid */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Recent Notes</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {/* Placeholder Notes */}
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="group bg-card hover:bg-accent/50 border border-border rounded-xl p-5 transition-all cursor-pointer hover:shadow-md">
                            <h3 className="font-medium text-lg mb-2 group-hover:text-primary transition-colors">Project Ideas {i}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-3">
                                This is a placeholder for note content. In a real app, this would show the beginning of your note text...
                            </p>
                            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                                <span>2 hours ago</span>
                                <span className="bg-primary/10 text-primary px-2 py-1 rounded-full">Work</span>
                            </div>
                        </div>
                    ))}

                    {/* Create New Note Card */}
                    <button className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-border rounded-xl hover:border-primary/50 hover:bg-accent/50 transition-all group h-full min-h-[160px]">
                        <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                            <span className="text-2xl text-primary">+</span>
                        </div>
                        <span className="font-medium text-muted-foreground group-hover:text-foreground">Create New Note</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainApp;
