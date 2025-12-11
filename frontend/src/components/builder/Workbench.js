import React, { useState } from 'react';
import ChatInterface from './ChatInterface';
import CodePreview from './CodePreview';

const Workbench = ({ user, initialPrompt, onBack }) => {
    // State for the split layout
    const [leftWidth, setLeftWidth] = useState(35);

    // State for the build process
    const [steps, setSteps] = useState([]); // Array of 'status' messages or code updates
    const [status, setStatus] = useState('idle'); // idle, building, ready, error

    // Callback when Chat updates the build progress
    const handleBuildUpdate = (newStatus, stepMessage) => {
        setStatus(newStatus);
        if (stepMessage) {
            setSteps(prev => [...prev, stepMessage]);
        }
    };

    return (
        <div className="flex w-full h-screen bg-[#0a0a0a] text-white overflow-hidden font-sans">
            {/* Left Panel: Chat & Prompt */}
            <div
                style={{ width: `${leftWidth}%` }}
                className="h-full border-r border-white/5 flex flex-col transition-all duration-75 relative bg-[#0a0a0a]"
            >
                <ChatInterface
                    user={user}
                    initialPrompt={initialPrompt}
                    onBuildUpdate={handleBuildUpdate}
                    onBack={onBack}
                />
            </div>

            {/* Resizer Handle */}
            <div className="w-1 h-full bg-transparent hover:bg-primary/50 cursor-col-resize absolute z-50 transition-colors"
                style={{ left: `${leftWidth}%` }}
            />

            {/* Right Panel: Code & Preview */}
            <div className="flex-1 h-full flex flex-col bg-[#171717]">
                <CodePreview status={status} steps={steps} />
            </div>
        </div>
    );
};

export default Workbench;
