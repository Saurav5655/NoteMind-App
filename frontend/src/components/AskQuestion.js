import React, { useState } from 'react';
import { generateContent } from '../services/generativeApi';
import './AskQuestion.css';

const AskQuestion = () => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleQuestionChange = (e) => {
        setQuestion(e.target.value);
    };

    const handleAskQuestion = async () => {
        if (!question.trim()) return;

        setIsLoading(true);
        setResponse('');
        setError('');

        try {
            const result = await generateContent({ prompt: question });
            if (result && result.text) {
                setResponse(result.text);
            } else {
                setError('No response from AI.');
            }
        } catch (err) {
            setError(err.message || 'An error occurred while fetching the AI response.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="ask-question-container">
            <div className="ask-question-box">
                <input
                    type="text"
                    className="ask-question-input"
                    placeholder="Ask me anything..."
                    value={question}
                    onChange={handleQuestionChange}
                    onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                    disabled={isLoading}
                />
                <button
                    className="ask-question-button"
                    onClick={handleAskQuestion}
                    disabled={!question.trim() || isLoading}
                >
                    {isLoading ? (
                        <div className="loader"></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
                            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                        </svg>
                    )}
                </button>
            </div>
            {error && <div className="error-message">{error}</div>}
            {response && (
                <div className="ai-response">
                    <p>{response}</p>
                </div>
            )}
        </div>
    );
};

export default AskQuestion;