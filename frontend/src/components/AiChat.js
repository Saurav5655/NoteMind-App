import React, { useState, useRef, useEffect } from 'react';
import { generateContent } from '../services/generativeApi';

const AiChat = ({ user, onClose, onSaveToNote }) => {
    const [messages, setMessages] = useState([
        { role: 'assistant', content: "Hello! I'm your Second Brain AI. How can I help you organize your thoughts today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const token = user ? await user.getIdToken() : null;

            // Format history for backend if needed, currently backend expects 'history' array of {role, parts: [{text}]} 
            // but our generativeApi helper handles single prompt. 
            // For true history support, we'd need to update generativeApi to pass history.
            // For now, we'll just send the prompt with context.

            const result = await generateContent({ prompt: userMessage, token });

            if (result && result.text) {
                setMessages(prev => [...prev, { role: 'assistant', content: result.text }]);
            }
        } catch (error) {
            console.error("Chat Error:", error);
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full bg-black/20 backdrop-blur-3xl rounded-3xl border border-white/10 overflow-hidden shadow-2xl animate-fade-in relative z-10">
            {/* Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-lovable-purple to-lovable-pink flex items-center justify-center shadow-lg animate-pulse-glow">
                        <span className="text-xl text-white">✨</span>
                    </div>
                    <div>
                        <h3 className="font-semibold text-white">Gemini Assistant</h3>
                        <p className="text-xs text-gray-400">Powered by Google AI</p>
                    </div>
                </div>
                {onClose && (
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white">
                        ×
                    </button>
                )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user'
                                    ? 'bg-lovable-purple/20 border border-lovable-purple/30 text-white rounded-br-none'
                                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-bl-none'
                                }`}
                        >
                            <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                            {msg.role === 'assistant' && onSaveToNote && (
                                <button
                                    onClick={() => onSaveToNote(msg.content)}
                                    className="mt-3 text-xs flex items-center gap-1 text-lovable-blue hover:text-lovable-blue/80 transition-colors"
                                >
                                    <span>+</span> Save to Note
                                </button>
                            )}
                        </div>
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                            <span className="w-2 h-2 bg-lovable-purple rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-lovable-purple rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-lovable-purple rounded-full animate-bounce delay-200"></span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-white/5">
                <div className="relative flex items-end gap-2 bg-black/20 border border-white/10 rounded-xl p-2 focus-within:border-lovable-purple/50 transition-colors">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Ask anything..."
                        className="w-full bg-transparent border-none focus:ring-0 text-white placeholder-gray-500 resize-none max-h-32 min-h-[44px] py-3 px-2 text-sm"
                        rows={1}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="p-2 rounded-lg bg-lovable-purple text-white hover:bg-lovable-purple/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end mb-1"
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AiChat;
