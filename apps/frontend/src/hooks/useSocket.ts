import { useEffect, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import {useAuth} from './useAuth.tsx';

interface ChatMessage {
  content: string;
  isUser: boolean;
}

export function useSocket(reportId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [initialMessageSent, setInitialMessageSent] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [report, setReport] = useState<string>('');
  const [lastUserMessage, setLastUserMessage] = useState<string>('');

  const { user } = useAuth();

  useEffect(() => {
    console.log('Connecting to socket', user.token);
    const socketInstance = io('http://localhost:3000', {
      query: { reportId },
      extraHeaders: {
        Authorization: `Bearer ${user.token}`
      }
    });

    if (!initialMessageSent) {
      setInitialMessageSent(true);
      socketInstance.emit('start');
    }
    setReport('');

    setSocket(socketInstance);

    socketInstance.on('message', (message: string) => {
      if (message !== lastUserMessage) {
        setMessages((prev) => [...prev, { content: message, isUser: false }]);
      }
    });

    let currentAiConversationMessage = '';

    socketInstance.on('conversation', ({ token, isComplete }) => {
      if (isComplete) {
        currentAiConversationMessage = '';
      } else {
        currentAiConversationMessage += token;
        setMessages((prev) => {
          const newMessages = [...prev];
          if (
            newMessages.length > 0 &&
            !newMessages[newMessages.length - 1].isUser
          ) {
            newMessages[newMessages.length - 1].content =
              currentAiConversationMessage;
          } else {
            newMessages.push({
              content: currentAiConversationMessage,
              isUser: false,
            });
          }
          return newMessages;
        });
      }
    });

    socketInstance.on('report', ({ token, isComplete }) => {
      if (isComplete) {
        //
      } else {
        setReport((prev) => prev + token);
      }
    });

    return () => {
      socketInstance.disconnect();
    };
  }, [lastUserMessage, user]);

  const sendMessage = useCallback(
    (message: string) => {
      if (socket) {
        setLastUserMessage(message);
        socket.emit('message', message);
        setMessages((prev) => [
          ...prev,
          { content: message, isUser: true, isReport: false },
        ]);
      }
    },
    [socket]
  );

  return { messages, sendMessage, report };
}