import React, { useState } from 'react';
import { generateContent } from '../services/generativeApi';

const MainApp = ({ user }) => {
    const [aiResponse, setAiResponse] = useState('');
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');
    const [prompt, setPrompt] = useState('');

    const handleAskAI = async () => {
        if (!prompt.trim()) return;

        setAiLoading(true);
        setAiResponse('');
        setAiError('');

        try {
            const token = user ? await user.getIdToken() : null;
            const result = await generateContent({ prompt, token });
            if (result && result.text) {
                setAiResponse(result.text);
            } else {
                setAiError('No response from AI.');
            }
        } catch (err) {
            setAiError(err.message || 'An error occurred while fetching the AI response.');
        } finally {
            setAiLoading(false);
        }
    };

    return (
        <div
            className="relative flex h-auto min-h-screen w-full flex-col bg-[#111318] dark group/design-root overflow-x-hidden"
            style={{ fontFamily: '"Space Grotesk", "Noto Sans", sans-serif' }}
        >
            <div className="layout-container flex h-full grow flex-col">
                <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#282e39] px-10 py-3">
                    <div className="flex items-center gap-4 text-white">
                        <div className="size-4">
                            <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M13.8261 17.4264C16.7203 18.1174 20.2244 18.5217 24 18.5217C27.7756 18.5217 31.2797 18.1174 34.1739 17.4264C36.9144 16.7722 39.9967 15.2331 41.3563 14.1648L24.8486 40.6391C24.4571 41.267 23.5429 41.267 23.1514 40.6391L6.64374 14.1648C8.00331 15.2331 11.0856 16.7722 13.8261 17.4264Z"
                                    fill="currentColor"
                                ></path>
                                <path
                                    fillRule="evenodd"
                                    clipRule="evenodd"
                                    d="M39.998 12.236C39.9944 12.2537 39.9875 12.2845 39.9748 12.3294C39.9436 12.4399 39.8949 12.5741 39.8346 12.7175C39.8168 12.7597 39.7989 12.8007 39.7813 12.8398C38.5103 13.7113 35.9788 14.9393 33.7095 15.4811C30.9875 16.131 27.6413 16.5217 24 16.5217C20.3587 16.5217 17.0125 16.131 14.2905 15.4811C12.0012 14.9346 9.44505 13.6897 8.18538 12.8168C8.17384 12.7925 8.16216 12.767 8.15052 12.7408C8.09919 12.6249 8.05721 12.5114 8.02977 12.411C8.00356 12.3152 8.00039 12.2667 8.00004 12.2612C8.00004 12.261 8 12.2607 8.00004 12.2612C8.00004 12.2359 8.0104 11.9233 8.68485 11.3686C9.34546 10.8254 10.4222 10.2469 11.9291 9.72276C14.9242 8.68098 19.1919 8 24 8C28.8081 8 33.0758 8.68098 36.0709 9.72276C37.5778 10.2469 38.6545 10.8254 39.3151 11.3686C39.9006 11.8501 39.9857 12.1489 39.998 12.236ZM4.95178 15.2312L21.4543 41.6973C22.6288 43.5809 25.3712 43.5809 26.5457 41.6973L43.0534 15.223C43.0709 15.1948 43.0878 15.1662 43.104 15.1371L41.3563 14.1648C43.104 15.1371 43.1038 15.1374 43.104 15.1371L43.1051 15.135L43.1065 15.1325L43.1101 15.1261L43.1199 15.1082C43.1276 15.094 43.1377 15.0754 43.1497 15.0527C43.1738 15.0075 43.2062 14.9455 43.244 14.8701C43.319 14.7208 43.4196 14.511 43.5217 14.2683C43.6901 13.8679 44 13.0689 44 12.2609C44 10.5573 43.003 9.22254 41.8558 8.2791C40.6947 7.32427 39.1354 6.55361 37.385 5.94477C33.8654 4.72057 29.133 4 24 4C18.867 4 14.1346 4.72057 10.615 5.94478C8.86463 6.55361 7.30529 7.32428 6.14419 8.27911C4.99695 9.22255 3.99999 10.5573 3.99999 12.2609C3.99999 13.1275 4.29264 13.9078 4.49321 14.3607C4.60375 14.6102 4.71348 14.8196 4.79687 14.9689C4.83898 15.0444 4.87547 15.1065 4.9035 15.1529C4.91754 15.1762 4.92954 15.1957 4.93916 15.2111L4.94662 15.223L4.95178 15.2312ZM35.9868 18.996L24 38.22L12.0131 18.996C12.4661 19.1391 12.9179 19.2658 13.3617 19.3718C16.4281 20.1039 20.0901 20.5217 24 20.5217C27.9099 20.5217 31.5719 20.1039 34.6383 19.3718C35.082 19.2658 35.5339 19.1391 35.9868 18.996Z"
                                    fill="currentColor"
                                ></path>
                            </svg>
                        </div>
                        <h2 className="text-white text-lg font-bold leading-tight tracking-[-0.015em]">AppForge</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <div className="flex items-center gap-9">
                            <a className="text-white text-sm font-medium leading-normal" href="#">Home</a>
                            <a className="text-white text-sm font-medium leading-normal" href="#">Templates</a>
                            <a className="text-white text-sm font-medium leading-normal" href="#">Examples</a>
                            <a className="text-white text-sm font-medium leading-normal" href="#">Docs</a>
                        </div>
                        <button
                            className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#135bec] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                        >
                            <span className="truncate">New Project</span>
                        </button>
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                            style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDaF6rW6h7YqAtw62dfhHTKsBMZmpx3n4QIbrxb-h_3Osdhw-FUjxMREJgmxGY8QpvVc2i3OE06TdMJtgl090jGFuRaiwBtnxJ9J-V-uocFzJw196iBd8_Zq6wmQ59ETXaVuFBT5zaGOXuSwEVUwyY-VEEtsRTy8rlXy3sFvRUnak9UdzcstAowkrCpjEqux08JFEOc60PeYsPWd7gljGNQ8F8M8UD9Icq_50pWgUOJR5fQ2EjeuWa90oeClQWpUKvhIvQvEayDqjEs")' }}
                        ></div>
                    </div>
                </header>
                <div className="gap-1 px-6 flex flex-1 justify-center py-5">
                    <div className="layout-content-container flex flex-col max-w-[920px] flex-1">
                        <div className="pb-3">
                            <div className="flex border-b border-[#3b4354] px-4 gap-8">
                                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-white text-white pb-[13px] pt-4" href="#">
                                    <p className="text-white text-sm font-bold leading-normal tracking-[0.015em]">Code</p>
                                </a>
                                <a className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#9da6b9] pb-[13px] pt-4" href="#">
                                    <p className="text-[#9da6b9] text-sm font-bold leading-normal tracking-[0.015em]">Preview</p>
                                </a>
                            </div>
                        </div>
                        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                            <label className="flex flex-col min-w-40 flex-1">
                                <textarea
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3b4354] bg-[#1c1f27] focus:border-[#3b4354] min-h-36 placeholder:text-[#9da6b9] p-[15px] text-base font-normal leading-normal"
                                    value={aiResponse}
                                    readOnly
                                ></textarea>
                            </label>
                        </div>
                        <div className="flex px-4 py-3 justify-end">
                            <button
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#135bec] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                            >
                                <span className="truncate">Save Code</span>
                            </button>
                        </div>
                        <div className="px-4 py-3">
                            <div className="flex flex-col gap-3 rounded-lg bg-[#282e39] px-4 py-3">
                                <div className="flex items-center gap-4 overflow-hidden">
                                    <div
                                        className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-14 shrink-0"
                                        style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBs9az5SXtI19E-M9BPZOfGi3uDpOVUb6LPqwaoEDTtD1oGCo5a8TuvkxALg15YMOf2T5iWFdbBypQpcNPvTwmFXRv8oHeQxRvFDK48TN5QDJDc21pHbjG3hro8-J11cgYn08p7kTDMW7GUgXN3Xcr0MTHlO-EdN-EH0etiX7PgZJ7cfioJxrlYo0WG3zEXjHz5_OmbjykeOLEAebl8g_aB--yo40ZzjDed4veJ65jNoBNrn2jzJIgEh1p3CYnlExRys9IqgLbQNLpj")' }}
                                    ></div>
                                    <div className="flex-1">
                                        <p className="text-white text-base font-bold leading-tight truncate">AI-Generated App</p>
                                        <p className="text-[#9da6b9] text-sm font-normal leading-normal truncate">Live Preview</p>
                                    </div>
                                    <button className="flex shrink-0 items-center justify-center rounded-full size-10 bg-[#135bec] text-white">
                                        <div className="text-inherit" data-icon="Play" data-size="20px" data-weight="fill">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                                                <path
                                                    d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"
                                                ></path>
                                            </svg>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="layout-content-container flex flex-col w-[360px]">
                        <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                            <label className="flex flex-col min-w-40 flex-1">
                                <textarea
                                    placeholder="Enter your prompt here to build apps and games with AI assistance. AI-powered autocomplete suggestions will appear as you type. Use multi-line inputs for complex requests. Your prompt history is saved for easy access."
                                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-white focus:outline-0 focus:ring-0 border border-[#3b4354] bg-[#1c1f27] focus:border-[#3b4354] min-h-36 placeholder:text-[#9da6b9] p-[15px] text-base font-normal leading-normal"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                ></textarea>
                            </label>
                        </div>
                        <div className="flex px-4 py-3 justify-end">
                            <button
                                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#135bec] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                                onClick={handleAskAI}
                                disabled={aiLoading}
                            >
                                <span className="truncate">{aiLoading ? 'Generating...' : 'Generate'}</span>
                            </button>
                        </div>
                        <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">AI Output</h3>
                        {aiError && <p className="text-red-500 text-base font-normal leading-normal pb-3 pt-1 px-4">{aiError}</p>}
                        <p className="text-white text-base font-normal leading-normal pb-3 pt-1 px-4">
                            {aiResponse}
                        </p>
                        {aiLoading && (
                            <div className="flex flex-col gap-3 p-4">
                                <div className="flex gap-6 justify-between"><p className="text-white text-base font-medium leading-normal">Generating...</p></div>
                                <div className="rounded bg-[#3b4354]"><div className="h-2 rounded bg-white" style={{ width: '50%' }}></div></div>
                                <p className="text-[#9da6b9] text-sm font-normal leading-normal">50% complete</p>
                            </div>
                        )}
                        <h3 className="text-white text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">Prompt History</h3>
                        <div className="flex items-center gap-4 bg-[#111318] px-4 min-h-14 justify-between">
                            <p className="text-white text-base font-normal leading-normal flex-1 truncate">Create a simple HTML page</p>
                            <div className="shrink-0"><button className="text-base font-medium leading-normal">View</button></div>
                        </div>
                        <div className="flex items-center gap-4 bg-[#111318] px-4 min-h-14 justify-between">
                            <p className="text-white text-base font-normal leading-normal flex-1 truncate">Add a button to the page</p>
                            <div className="shrink-0"><button className="text-base font-medium leading-normal">View</button></div>
                        </div>
                        <div className="flex items-center gap-4 bg-[#111318] px-4 min-h-14 justify-between">
                            <p className="text-white text-base font-normal leading-normal flex-1 truncate">Style the button with CSS</p>
                            <div className="shrink-0"><button className="text-base font-medium leading-normal">View</button></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainApp;
