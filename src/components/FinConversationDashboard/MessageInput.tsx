import React, { useState } from 'react';

type Props = {
  onSend: (content: string) => void;
  disabled?: boolean;
};

export default function MessageInput({ onSend, disabled }: Props) {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onSend(text.trim());
    setText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSubmit(e);
      }
  };

    return (
        <div className="bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto px-4 py-4">
                <form onSubmit={handleSubmit} className="flex items-end space-x-3">
                    <div className="flex-1 relative">
            <textarea
                className={`
                w-full resize-none rounded-lg border border-gray-300 
                px-4 py-3 pr-12 text-sm
                focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none
                placeholder-gray-400
                ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
              `}
                placeholder="Ask me anything about your finances..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
                rows={1}
                style={{
                    minHeight: '44px',
                    maxHeight: '120px',
                    height: 'auto'
                }}
                onInput={(e) => {
                    const target = e.target as HTMLTextAreaElement;
                    target.style.height = 'auto';
                    target.style.height = Math.min(target.scrollHeight, 120) + 'px';
                }}
            />

                        {/* Send button inside textarea */}
                        <button
                            type="submit"
                            disabled={disabled || !text.trim()}
                            className={`
                absolute right-2 bottom-2 p-2 rounded-md transition-colors
                ${disabled || !text.trim()
                                ? 'text-gray-400 cursor-not-allowed'
                                : 'text-blue-600 hover:bg-blue-50 active:bg-blue-100'
                            }
              `}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </div>

                    {/* Optional: External send button */}
                    <button
                        type="submit"
                        disabled={disabled || !text.trim()}
                        className={`
              px-4 py-2 rounded-lg font-medium text-sm transition-colors
              ${disabled || !text.trim()
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800'
                        }
            `}
                    >
                        {disabled ? 'Sending...' : 'Send'}
                    </button>
                </form>

                {/* Helpful hint */}
                <div className="mt-2 text-xs text-gray-500 text-center">
                    Press Enter to send, Shift + Enter for new line
                </div>
            </div>
        </div>
    );
}
