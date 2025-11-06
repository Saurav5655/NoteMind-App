import React from 'react';

const CodeEditor = () => {
    return (
        <div className="code-editor-container">
            <h3>Code Editor</h3>
            <textarea style={{ width: '100%', height: '300px' }} defaultValue="// Your code here..."></textarea>
        </div>
    );
};

export default CodeEditor;
