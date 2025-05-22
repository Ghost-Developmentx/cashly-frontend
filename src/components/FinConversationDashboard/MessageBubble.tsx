import React from 'react';

type Props = {
  message: {
    role: 'user' | 'assistant';
    content: string;
  };
};

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  return (
    <div className={`p-3 rounded-lg max-w-[80%] ${isUser ? 'bg-blue-100 ml-auto' : 'bg-gray-100 mr-auto'}`}>
      <p className="text-sm whitespace-pre-line">{message.content}</p>
    </div>
  );
}
