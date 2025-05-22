import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface Conversation {
  id: number;
  title: string;
  created_at: string;
}


type SidebarProps = {
  onSelectConversation: (conversation: {
    id: string;
    title: string;
    messages: { role: 'user' | 'assistant'; content: string }[];
  }) => void;
};


export default function Sidebar({ onSelectConversation }: SidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState('');
  const { getToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const fetchConversations = async () => {
      const token = await getToken();
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/fin/conversations/history`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setConversations(res.data);
    };

    fetchConversations().then(r => r);
  }, [getToken]);

  const startNewConversation = async () => {
    const token = await getToken();
    await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/fin/clear`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    router.refresh(); // triggers page reload and resets conversation
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
      onSelectConversation({
        id: conversation.id.toString(),
        title: conversation.title || 'Untitled',
        messages: conversation.conversation_history || [],
      });
    } catch (err) {
      console.error("Failed to activate conversation:", err);
    }
  };


  const filtered = conversations.filter((conv) =>
      conv.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
      <aside className="w-64 bg-gray-100 p-4 border-r border-gray-200 overflow-y-auto">
        <div className="mb-4">
          <input
              type="text"
              placeholder="Search chats..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
            onClick={startNewConversation}
            className="mb-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          + New Chat
        </button>

        <div className="space-y-2 mt-4">
          {filtered.map((conv) => (
              <button
                  key={conv.id}
                  onClick={() => handleConversationClick(conv.id)}
                  className="block w-full text-left px-2 py-1 rounded hover:bg-gray-200 text-sm"
              >
                {conv.title || "Untitled"}
              </button>
          ))}
        </div>
      </aside>
  );
}
