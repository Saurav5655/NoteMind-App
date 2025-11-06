import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';

// Contract:
// - input: `text` which may be:
//    - a plain string
//    - a JSON string like '{"response": "..."}' or '{"text":"..."}'
//    - an object serialized as string with nested parts
// - output: safe markdown-rendered React nodes

const extractText = (text) => {
    if (!text && text !== '') return '';

    // If already an object, handle directly
    if (typeof text === 'object') {
        if (text.response) return String(text.response);
        if (text.text) return String(text.text);
        if (Array.isArray(text.parts) && text.parts[0] && text.parts[0].text) return String(text.parts[0].text);
        return JSON.stringify(text);
    }

    // Ignore the literal string "undefined"
    if (text === 'undefined') return '';

    // Try parsing JSON strings that wrap the actual content
    try {
        const parsed = JSON.parse(text);
        if (parsed == null) return '';
        if (typeof parsed === 'string') return parsed;
        if (parsed.response) return String(parsed.response);
        if (parsed.text) return String(parsed.text);
        if (Array.isArray(parsed.parts) && parsed.parts[0] && parsed.parts[0].text) return String(parsed.parts[0].text);
        // Fallback to a stable string representation
        return JSON.stringify(parsed);
    } catch (e) {
        // Not JSON — return raw text
        return String(text);
    }
};

const MessageDisplay = ({ text }) => {
    const fullMessage = extractText(text);
    const [displayedMessage, setDisplayedMessage] = useState('');
    const [isTypingComplete, setIsTypingComplete] = useState(false);

    useEffect(() => {
        setDisplayedMessage(''); // Reset when fullMessage changes
        setIsTypingComplete(false);

        if (!fullMessage) return;

        let i = 0;
        const typingInterval = setInterval(() => {
            if (i < fullMessage.length) {
                setDisplayedMessage(prev => prev + fullMessage.charAt(i));
                i++;
            } else {
                clearInterval(typingInterval);
                setIsTypingComplete(true);
            }
        }, 20); // Typing speed: 20ms per character

        return () => clearInterval(typingInterval);
    }, [fullMessage]);

    return (
        <div className="message-display">
            <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
            >
                {displayedMessage}
            </ReactMarkdown>
            {!isTypingComplete && <span className="typing-cursor">|</span>}
        </div>
    );
};

export default MessageDisplay;
