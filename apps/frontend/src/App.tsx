import { useState } from 'react';
import { useSocket } from './hooks/useSocket';
import './App.css';

function App() {
  const [newMessage, setNewMessage] = useState('');
  const { messages, sendMessage } = useSocket();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage('');
    }
  };

  return (
    <>
      <div className="header">
        <img src="/exlabs_logo.svg" alt="Exlabs Logo" className="logo" />
        <h1>Exlabs AI Chat</h1>
      </div>
      <div className="chat-container">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message-container">
              {!msg.isUser && (
                <img src="/openai-2.svg" alt="AI Logo" className="message-logo" />
              )}
              <div
                className={`message ${msg.isUser ? 'user-message' : 'ai-message'}`}
              >
                {msg.content}
              </div>
              {msg.isUser && (
                <img src="/exlabs_logo.svg" alt="Exlabs Logo" className="message-logo" />
              )}
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </>
  );
}

export default App;
