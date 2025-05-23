import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Conversation {
  id: number;
  title: string;
  created_at: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface FullConversation {
  id: string;
  title: string;
  messages: Message[];
}

type SidebarProps = {
  onSelectConversation: (conversation: FullConversation) => void;
  selectedConversationId?: string;
};

export default function Sidebar({ onSelectConversation, selectedConversationId }: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fin/conversations/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setConversations(res.data);
      } catch (error) {
        console.error('Failed to fetch conversations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConversations();
  }, [getToken]);

  const startNewConversation = async () => {
    setIsLoading(true);
    try {
      const token = await getToken();
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/fin/conversations/clear`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });

      console.log('New conversation started:', response.data);

      // Clear selected conversation
      onSelectConversation({
        id: '',
        title: '',
        messages: []
      });

      // Refresh conversations list
      const conversationsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fin/conversations/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConversations(conversationsResponse.data);

    } catch (error) {
      console.error('Failed to start new conversation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationClick = async (id: number) => {
    const token = await getToken();
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fin/conversations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      });

      const conversation = res.data;
      console.log('Sidebar: Fetched conversation:', conversation);

      const messagesWithIds: Message[] = (conversation.messages || []).map((msg: any, index: number) => ({
        id: msg.id || `msg-${index}-${Date.now()}`,
        role: msg.role,
        content: msg.content
      }));

      onSelectConversation({
        id: conversation.id.toString(),
        title: conversation.title || 'Untitled',
        messages: messagesWithIds,
      });
    } catch (err) {
      console.error("Failed to activate conversation:", err);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  const truncateTitle = (title: string, maxLength: number = 35) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const filtered = conversations.filter((conv) =>
      conv.title.toLowerCase().includes(search.toLowerCase())
  );

  // Group conversations by date
  const groupedConversations = filtered.reduce((groups: { [key: string]: Conversation[] }, conv) => {
    const date = formatDate(conv.created_at);
    if (!groups[date]) groups[date] = [];
    groups[date].push(conv);
    return groups;
  }, {});

  return (
      <aside className="w-80 bg-gray-900 text-white flex flex-col h-full">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold">Cashly AI</h1>
                <p className="text-xs text-gray-400">Financial Assistant</p>
              </div>
            </div>
          </div>

          {/* New Chat Button */}
          <button
              onClick={startNewConversation}
              disabled={isLoading}
              className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600 text-white py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-medium">New conversation</span>
                </>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-gray-700">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
                type="text"
                placeholder="Search conversations..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-800 border border-gray-600 text-white placeholder-gray-400 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && conversations.length === 0 ? (
              <div className="p-4 text-center">
                <div className="animate-pulse space-y-3">
                  {[...Array(5)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-800 rounded-lg"></div>
                  ))}
                </div>
              </div>
          ) : Object.keys(groupedConversations).length === 0 ? (
              <div className="p-4 text-center">
                <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="text-gray-400 text-sm">No conversations yet</p>
                <p className="text-gray-500 text-xs mt-1">Start a new conversation to get began</p>
              </div>
          ) : (
              <div className="py-2">
                {Object.entries(groupedConversations).map(([date, convs]) => (
                    <div key={date} className="mb-4">
                      {/* Date Header */}
                      <div className="px-4 py-2">
                        <h3 className="text-xs font-medium text-gray-400 uppercase tracking-wide">
                          {date}
                        </h3>
                      </div>

                      {/* Conversations */}
                      <div className="space-y-1 px-2">
                        {convs.map((conv) => (
                            <div
                                key={conv.id}
                                className={`
                        relative group rounded-lg transition-all duration-200
                        hover:bg-gray-800 
                        ${selectedConversationId === conv.id.toString()
                                    ? 'bg-gray-800 border-l-2 border-blue-500'
                                    : 'hover:border-l-2 hover:border-gray-600'
                                }
                      `}
                            >
                              {/* Main conversation clickable area */}
                              <button
                                  onClick={() => handleConversationClick(conv.id)}
                                  className="w-full text-left px-3 py-3 rounded-lg"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0 pr-2">
                                    <div className="flex items-center space-x-2 mb-1">
                                      <svg className="w-3 h-3 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                      </svg>
                                      <h4 className="text-sm font-medium text-white truncate">
                                        {truncateTitle(conv.title || 'Untitled')}
                                      </h4>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                      {new Date(conv.created_at).toLocaleTimeString([], {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                      })}
                                    </p>
                                  </div>
                                </div>
                              </button>

                              {/* More options button - positioned absolutely */}
                              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                      e.stopPropagation(); // Prevent triggering conversation click
                                      // Add your options menu logic here
                                      console.log('Options clicked for conversation:', conv.id);
                                    }}
                                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors"
                                    title="More options"
                                >
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                        ))}
                      </div>
                    </div>
                ))}
              </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">User Account</p>
              <p className="text-xs text-gray-400">Financial Dashboard</p>
            </div>
            <div className="flex space-x-1">
              <a
                  href="/profile"
                  className="p-1 text-gray-400 hover:text-white rounded transition-colors"
                  title="Profile Settings"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </a>
              <button className="p-1 text-gray-400 hover:text-white rounded transition-colors" title="Settings">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </aside>
  );
}