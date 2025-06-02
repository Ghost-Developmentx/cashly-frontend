import { Conversation } from './types';
import { truncateTitle } from './utils';

/**
 * One‑line, enterprise‑style row for the conversation list.
 * – Icon → title/subtitle block (left)
 * – Timestamp (right, subdued)
 */

type Props = {
    conv: Conversation;
    isActive: boolean;
    onClick: (id: number) => void;
};

export default function ConversationItem({ conv, isActive, onClick }: Props) {
    const time = new Date(conv.created_at).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <button
            onClick={() => onClick(conv.id)}
            className={`
        group flex w-full items-center gap-3 rounded-lg px-3 py-2
        transition-colors duration-150
        ${isActive ? 'bg-gray-800 border-l-4 border-emerald-500' : 'hover:bg-gray-800'}
      `}
        >
            {/* Thread icon */}
            <span
                className={`flex h-6 w-6 items-center justify-center rounded-md
          ${isActive ? 'bg-emerald-600 text-white' : 'bg-gray-700 text-gray-400 group-hover:text-white'}`}
            >
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3.5 w-3.5"
        >
          <path d="M8 12h.01M12 12h.01M16 12h.01" />
          <path d="M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </span>

            {/* Title + timestamp */}
            <div className="flex min-w-0 flex-1 items-center justify-between">
                <h4 className="truncate text-sm font-medium text-white">
                    {truncateTitle(conv.title)}
                </h4>
                <time className="shrink-0 text-xs text-gray-400 group-hover:text-gray-300">
                    {time}
                </time>
            </div>
        </button>
    );
}
