import React, { useState, useEffect, useRef } from 'react';
import { Send, Paperclip, User, Bot, ArrowLeft } from 'lucide-react';

const ChatInterface = ({ user, initialPrompt, onBuildUpdate, onBack }) => {
    const [messages, setMessages] = useState([
        { role: 'ai', content: 'Hi! I\'m NoteMind AI. What would you like to build today?' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const hasInitialized = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isTyping]);

    // Handle initial prompt from Dashboard
    useEffect(() => {
        if (initialPrompt && !hasInitialized.current) {
            hasInitialized.current = true;
            handleSend(null, initialPrompt);
        }
    }, [initialPrompt]);

    const handleSend = async (e, manualPrompt) => {
        if (e) e.preventDefault();
        const text = manualPrompt || input;

        if (!text.trim()) return;

        // Add User Message
        const userMsg = { role: 'user', content: text };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsTyping(true);
        onBuildUpdate('building', 'User requested: ' + text);

        try {
            // Trigger Visual Build Simulation (Immediate feedback)
            const buildSteps = [
                { msg: "Analyzing requirements...", delay: 500 },
                { msg: "Scaffolding project structure...", delay: 2000, action: () => onBuildUpdate('building', 'Creating files...') },
                { msg: "Generating component code...", delay: 4000, action: () => onBuildUpdate('building', 'Compiling modules...') },
            ];

            buildSteps.forEach(({ msg, delay, action }) => {
                setTimeout(() => {
                    if (action) action();
                }, delay);
            });

            // Prepare history: 
            // 1. Filter out the initial greeting (index 0) if it's from AI, as Gemini history must start with User.
            // 2. Map strict roles ('user' | 'model').
            const validHistory = messages
                .filter(((_, i) => i > 0)) // Skip the first message (Greeting)
                .map(m => ({
                    role: m.role === 'ai' ? 'model' : 'user',
                    parts: [{ text: m.content }]
                }));

            // Call Backend API
            const response = await fetch('http://localhost:3002/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    history: validHistory
                })
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data.error || 'Failed to get response');

            const aiResponseText = data.text;

            // Show AI Response and finalize
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'ai', content: aiResponseText }]);
                setIsTyping(false);
                onBuildUpdate('ready', 'Build complete!');
            }, 5000); // Wait long enough for the visual steps to play out approximately

        } catch (error) {
            console.error('Chat Error:', error);
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'ai', content: "Sorry, I couldn't connect to the builder backend. Please make sure the server is running." }]);
                setIsTyping(false);
                onBuildUpdate('error', 'Connection failed');
            }, 2000);
        }
    };

    return (
        <div className="flex flex-col h-full bg-[#0a0a0a]">
            {/* Header */}
            <div className="h-12 border-b border-white/5 flex items-center px-4 bg-[#0a0a0a] gap-3">
                <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="font-semibold text-sm text-gray-200">Chat</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                        {msg.role === 'ai' && (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                <Bot className="w-4 h-4 text-primary" />
                            </div>
                        )}

                        <div className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${msg.role === 'user'
                            ? 'bg-primary/20 border border-primary/20 text-white'
                            : 'bg-white/5 border border-white/10 text-gray-300'
                            }`}>
                            {msg.content}
                        </div>
                    </div>
                ))}

                {isTyping && (
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <Bot className="w-4 h-4 text-primary" />
                        </div>
                        <div className="text-xs text-gray-500 flex items-center mt-2 animate-pulse">
                            Thinking...
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-white/5 bg-[#0a0a0a]">
                <form onSubmit={handleSend} className="relative group">
                    <div className="relative bg-[#171717] border border-white/10 rounded-xl p-2 transition-all group-focus-within:border-primary/50">
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(e);
                                }
                            }}
                            placeholder="How can NoteMind help you?"
                            className="w-full h-auto min-h-[44px] max-h-32 bg-transparent text-sm text-white placeholder-gray-500 resize-none focus:outline-none px-2 py-2 font-light"
                            rows={1}
                        />

                        <div className="flex justify-between items-center mt-2 px-1">
                            <div className="flex gap-1">
                                <button type="button" className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-gray-300 transition-colors">
                                    <Paperclip className="w-4 h-4" />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={!input.trim()}
                                className="p-1.5 bg-primary rounded-lg text-black hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatInterface;
