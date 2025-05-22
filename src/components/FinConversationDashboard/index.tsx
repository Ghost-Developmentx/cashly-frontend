'use client';

import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import { useUser, useAuth } from '@clerk/nextjs';



interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type Props = {
  conversation: {
    id: string;
    title: string;
    messages: Message[];
  } | null;
};

export default function FinConversationDashboard({ conversation }: Props) {
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>(conversation?.messages || []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const conversationId = conversation?.id ?? null;

  useEffect(() => {
    if (conversation?.messages) {
      setMessages(conversation.messages);
    }
  }, [conversationId]);



  const sendMessage = async (content: string) => {
    const newMessage: Message = { id: uuidv4(), role: 'user', content };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/fin/query`, {
        user_id: 'me',
        query: content,
        conversation_history: updatedMessages.map(({ role, content }) => ({ role, content })),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const reply: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: res.data.message || 'Something went wrong, no reply received.',
      };

      setMessages([...updatedMessages, reply]);
    } catch (err: any) {
      console.error(err);
      setError('Failed to fetch response. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!isSignedIn) return <div>Loading...</div>;

  return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 && (
              <p className="text-center text-gray-400 mt-10">
                Ask me anything about your finances to get started 💬
              </p>
          )}
          {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
          ))}
          <div ref={bottomRef} />
        </div>

        <div className="border-t p-4">
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <MessageInput onSend={sendMessage} disabled={loading} />
        </div>
      </div>
  );
}
