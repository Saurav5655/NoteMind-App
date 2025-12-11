import React, { useState } from 'react';
import { Code, Play, Terminal, RefreshCw, Loader2 } from 'lucide-react';

const CodePreview = ({ status }) => {
    const [activeView, setActiveView] = useState('preview'); // 'code' or 'preview'

    // Mock generated files structure
    const files = {
        'App.js': `import React from 'react';\n\nfunction App() {\n  return (\n    <div className="min-h-screen bg-gray-50 flex items-center justify-center">\n      <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full">\n        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hello World</h1>\n        <p className="text-gray-600">This is your newly generated app!</p>\n        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">Get Started</button>\n      </div>\n    </div>\n  );\n}\n\nexport default App;`,
        'index.css': `@tailwind base;\n@tailwind components;\n@tailwind utilities;`
    };

    return (
        <div className="flex flex-col h-full bg-[#171717]">
            {/* Toolbar */}
            <div className="h-12 border-b border-white/5 flex items-center justify-between px-4 bg-[#171717]">
                <div className="flex items-center gap-1 bg-black/20 p-1 rounded-lg border border-white/5">
                    <button
                        onClick={() => setActiveView('preview')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeView === 'preview'
                                ? 'bg-[#27272a] text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Play className="w-3 h-3" />
                        Preview
                    </button>
                    <button
                        onClick={() => setActiveView('code')}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeView === 'code'
                                ? 'bg-[#27272a] text-white shadow-sm'
                                : 'text-gray-400 hover:text-white'
                            }`}
                    >
                        <Code className="w-3 h-3" />
                        Code
                    </button>
                </div>

                <div className="flex items-center gap-2 text-gray-500">
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Reload">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-white/5 rounded-lg transition-colors" title="Toggle Terminal">
                        <Terminal className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                {activeView === 'preview' ? (
                    <div className="w-full h-full bg-white relative flex flex-col">
                        {/* Browser Address Bar Mock */}
                        <div className="h-8 bg-gray-100 border-b flex items-center px-4 gap-2 text-xs text-gray-500">
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                                <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                            </div>
                            <div className="flex-1 bg-white border rounded px-2 py-0.5 text-center ml-4">
                                localhost:3000
                            </div>
                        </div>

                        {/* Preview Content */}
                        <div className="flex-1 p-0 flex items-center justify-center bg-gray-50 text-gray-400 overflow-hidden relative">
                            {status === 'idle' && (
                                <div className="text-center">
                                    <p>Ready to build...</p>
                                </div>
                            )}

                            {status === 'building' && (
                                <div className="text-center flex flex-col items-center">
                                    <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
                                    <p className="animate-pulse font-medium text-gray-500">Building your application...</p>
                                </div>
                            )}

                            {/* Mock Live Preview when 'ready' */}
                            {status === 'ready' && (
                                <div className="w-full h-full p-8 flex items-center justify-center animate-in fade-in zoom-in duration-500">
                                    {/* This mimics the content of App.js */}
                                    <div className="bg-white p-8 rounded-xl shadow-xl max-w-md w-full border border-gray-100">
                                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Hello World</h1>
                                        <p className="text-gray-600 mb-6">This is your newly generated app! It was built based on your prompt.</p>
                                        <button className="w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 font-medium transition-colors">
                                            Get Started
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full h-full bg-[#1e1e1e] p-0 overflow-auto">
                        {/* Simple Code View Mock */}
                        <div className="flex h-full">
                            {/* File Tree */}
                            <div className="w-48 border-r border-white/10 p-2 text-xs font-mono text-gray-400">
                                <div className="px-2 py-1 hover:bg-white/5 cursor-pointer text-blue-400">src/</div>
                                <div className="px-4 py-1 hover:bg-white/5 cursor-pointer text-white bg-white/5">App.js</div>
                                <div className="px-4 py-1 hover:bg-white/5 cursor-pointer">index.css</div>
                                <div className="px-2 py-1 hover:bg-white/5 cursor-pointer text-yellow-400">package.json</div>
                            </div>
                            {/* Editor */}
                            <div className="flex-1 p-4 font-mono text-sm text-gray-300">
                                <pre>{files['App.js']}</pre>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CodePreview;
