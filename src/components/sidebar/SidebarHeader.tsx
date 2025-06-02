import { MouseEventHandler } from 'react';

type Props = {
    isLoading: boolean;
    onNewConversation: MouseEventHandler<HTMLButtonElement>;
};

export default function SidebarHeader({ isLoading, onNewConversation }: Props) {
    return (
        <div className="p-4 border-b border-gray-700">
            {/* Logo + title */}
            <div className="mb-4 flex items-center space-x-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
                    <svg
                        className="h-5 w-5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                    >
                        <path
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4 12h16M4 6h16M4 18h16"
                        />
                    </svg>
                </div>
                <div>
                    <h1 className="text-lg font-semibold">Cashly AI</h1>
                    <p className="text-xs text-gray-400">Financial Assistant</p>
                </div>
            </div>

            {/* New chat */}
            <button
                onClick={onNewConversation}
                disabled={isLoading}
                className="flex w-full items-center justify-center space-x-2 rounded-lg
                   border border-gray-600 bg-gray-800 py-3 text-white transition
                   hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
                {isLoading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                    <>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        <span className="font-medium">New conversation</span>
                    </>
                )}
            </button>
        </div>
    );
}
