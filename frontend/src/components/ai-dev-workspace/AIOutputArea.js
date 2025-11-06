import React from 'react';

const AIOutputArea = ({ response, error, isLoading }) => {
    return (
        <div className="ai-output-area-container">
            <h3>AI Output</h3>
            <div style={{ width: '100%', height: '400px', border: '1px solid #ccc', overflowY: 'scroll', padding: '10px' }}>
                {isLoading && <p>Loading AI response...</p>}
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                {response && <p>{response}</p>}
                {!isLoading && !error && !response && <p>No AI response yet.</p>}
            </div>
        </div>
    );
};

export default AIOutputArea;
