import { useEffect, useState } from 'react';
import { useSocket } from './hooks/useSocket';
import markdownit from 'markdown-it';
import parse from 'html-react-parser'
import './App.css';

function App() {
  const md = markdownit({breaks: true});
  const [newMessage, setNewMessage] = useState('');
  const { messages, sendMessage, report } = useSocket();

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
      <div className="wrapper">
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
        <div className="report-container">
          {report === '' ? 'Your report will appear here...' : parse(md.render(report))}
        </div>
      </div>
    </>
  );
}

export default App;
