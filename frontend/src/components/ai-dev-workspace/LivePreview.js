import React from 'react';

const LivePreview = () => {
    return (
        <div className="live-preview-container">
            <h3>Live Preview</h3>
            <iframe style={{ width: '100%', height: '300px', border: '1px solid #ccc' }} title="Live Preview"></iframe>
        </div>
    );
};

export default LivePreview;
