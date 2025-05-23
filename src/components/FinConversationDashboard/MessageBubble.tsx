import React from 'react';

type Props = {
  message: {
    id: string;
    role: 'user' | 'assistant';
    content: string;
  };
};

export default function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';

  return (
      <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
        <div className={`flex max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Avatar */}
          <div className={`flex-shrink-0 ${isUser ? 'ml-3' : 'mr-3'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                isUser
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700'
            }`}>
              {isUser ? 'U' : 'AI'}
            </div>
          </div>

          {/* Message Content */}
          <div className="flex flex-col min-w-0">
            {/* Role Label */}
            <div className={`text-xs text-gray-500 mb-1 ${isUser ? 'text-right' : 'text-left'}`}>
              {isUser ? 'You' : 'Cashly AI'}
            </div>

            {/* Message Bubble */}
            <div className={`
            px-4 py-3 rounded-2xl shadow-sm
            ${isUser
                ? 'bg-blue-600 text-white rounded-br-md'
                : 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
            }
          `}>
              <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </p>
            </div>

            {/* Timestamp (optional - you can add this if you have timestamp data) */}
            <div className={`text-xs text-gray-400 mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
              {/* You can add timestamp here if available */}
              {/* {formatTime(message.created_at)} */}
            </div>
          </div>
        </div>
      </div>
  );
}
