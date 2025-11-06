import React, { useState } from 'react';

const AIPromptBox = ({ onAskAI, isLoading }) => {
    const [currentPrompt, setCurrentPrompt] = useState('');

    const handlePromptChange = (e) => {
        setCurrentPrompt(e.target.value);
    };

    const handleSubmit = () => {
        onAskAI(currentPrompt);
        setCurrentPrompt('');
    };

    return (
        <div className="ai-prompt-box-container">
            <h3>AI Prompt</h3>
            <textarea
                style={{ width: '100%', height: '100px' }}
                placeholder="Enter your prompt here..."
                value={currentPrompt}
                onChange={handlePromptChange}
                disabled={isLoading}
            ></textarea>
            <button onClick={handleSubmit} disabled={isLoading || !currentPrompt.trim()}>
                {isLoading ? 'Asking...' : 'Ask AI'}
            </button>
        </div>
    );
};

export default AIPromptBox;
