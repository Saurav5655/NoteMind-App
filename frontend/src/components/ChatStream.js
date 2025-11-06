import React, { useState, useEffect } from 'react';

const ChatStream = ({ prompt }) => {
  const [response, setResponse] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!prompt) return;

    setResponse('');
    setError(null);

    // Corrected URL to match backend port 3002
    const eventSource = new EventSource(`http://localhost:3002/chat?prompt=${encodeURIComponent(prompt)}`);

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      if (parsedData.response) {
        setResponse((prevResponse) => prevResponse + parsedData.response);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      setError("Failed to connect to the server. Please try again later.");
      eventSource.close();
    };

    // Cleanup the event source when the component unmounts or the prompt changes
    return () => {
      eventSource.close();
    };
  }, [prompt]); // Re-run the effect if the prompt changes

  return (
    <div>
      <h2>Live Response:</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <p>{response}</p>
    </div>
  );
};

export default ChatStream;