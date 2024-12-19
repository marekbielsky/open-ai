import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface ChatMessage {
  content: string;
  isUser: boolean;
}

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [lastUserMessage, setLastUserMessage] = useState<string>('');

  useEffect(() => {
    const socketInstance = io('http://localhost:3000');
    setSocket(socketInstance);

    socketInstance.on('message', (message: string) => {
      if (message !== lastUserMessage) {
        setMessages((prev) => [...prev, { content: message, isUser: false }]);
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [lastUserMessage]);

  const sendMessage = useCallback((message: string) => {
    if (socket) {
      setLastUserMessage(message);
      socket.emit('message', message);
      setMessages((prev) => [...prev, { content: message, isUser: true }]);
    }
  }, [socket]);

  return { messages, sendMessage };
} 