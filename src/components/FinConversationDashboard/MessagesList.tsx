import { Message } from '@/types/financial';
import MessageBubble from './MessageBubble';

interface MessagesListProps {
    messages: Message[];
    loading: boolean;
}

export function MessagesList({ messages, loading }: MessagesListProps) {
    if (messages.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Welcome to Cashly AI</h3>
                <p className="text-gray-500 text-center max-w-md">
                    Ask me anything about your finances to get started. I can help with budgets, forecasts, insights, and more.
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-1">
                {messages.map((msg) => (
                    <MessageBubble key={msg.id} message={msg} />
                ))}
            </div>

            {loading && (
                <div className="flex justify-start mb-6">
                    <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                        <div className="flex space-x-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                        </div>
                        <span className="text-sm text-gray-500">Cashly is thinking...</span>
                    </div>
                </div>
            )}
        </>
    );
}