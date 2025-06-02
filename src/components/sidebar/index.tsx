'use client';

import axios from 'axios';
import { useAuth } from '@clerk/nextjs';
import { useEffect, useState } from 'react';

import SidebarHeader from './SidebarHeader';
import SearchBar from './SearchBar';
import ConversationList from './ConversationList';
import UserMenu from './UserMenu';
import { Conversation, FullConversation } from './types';

type Props = {
    onSelectConversation: (c: FullConversation) => void;
    selectedConversationId?: string;
};

export default function Sidebar({ onSelectConversation, selectedConversationId }: Props) {
    const { getToken } = useAuth();

    const [convs, setConvs] = useState<Conversation[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    // ───────── Fetch history
    const fetchHistory = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            const res = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/fin/conversations/history`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setConvs(res.data);
        } catch (e) {
            console.error('Failed to fetch conversations', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // ───────── Start new conversation
    const handleNewConversation = async () => {
        setLoading(true);
        try {
            const token = await getToken();
            await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/fin/conversations/clear`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            onSelectConversation({ id: '', title: '', messages: [] });
            await fetchHistory();
        } finally {
            setLoading(false);
        }
    };

    // ───────── Activate conversation
    const activateConversation = async (id: number) => {
        const token = await getToken();
        const res = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/fin/conversations/${id}`,
            { headers: { Authorization: `Bearer ${token}` } }
        );
        const { messages = [] } = res.data;
        onSelectConversation({
            id: String(res.data.id),
            title: res.data.title ?? 'Untitled',
            messages,
        });
    };

    // ───────── Filter
    const filtered = convs.filter((c) =>
        (c.title || 'Untitled').toLowerCase().includes(search.toLowerCase())
    );

    return (
        <aside className="flex h-full w-80 flex-col bg-gray-900 text-white">
            <SidebarHeader isLoading={loading} onNewConversation={handleNewConversation} />
            <SearchBar value={search} onChange={setSearch} />
            <ConversationList
                conversations={filtered}
                activeId={selectedConversationId}
                onSelect={activateConversation}
            />
            <UserMenu />
        </aside>
    );
}