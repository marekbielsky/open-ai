import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useSocket() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const socketInstance = io('http://localhost:3000');
    setSocket(socketInstance);

    socketInstance.on('message', (message: string) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = useCallback((message: string) => {
    if (socket) {
      socket.emit('message', message);
    }
  }, [socket]);

  return { messages, sendMessage };
} 