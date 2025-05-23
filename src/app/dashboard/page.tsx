'use client';

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import FinConversationDashboard from "@/components/FinConversationDashboard";
import { Conversation } from "@/types/conversation";

export default function DashboardPage() {
    const { user, isSignedIn } = useUser();

    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);

    if (!isSignedIn) return <div>Loading...</div>;

    const handleConversationSelect = (conversation: Conversation) => {
        console.log('Dashboard: Selecting conversation:', conversation);
        setSelectedConversation(conversation);
    };

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                onSelectConversation={handleConversationSelect}
                selectedConversationId={selectedConversation?.id}
            />

            {/* Main Chat Panel */}
            <main className="flex-1 flex flex-col">
                {/* Header - only show when there's a selected conversation */}
                {selectedConversation && (
                    <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-xl font-semibold text-gray-800">
                                    {selectedConversation.title || 'Untitled Conversation'}
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    {selectedConversation.messages.length} messages
                                </p>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Active
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Welcome Header - only show when no conversation is selected */}
                {!selectedConversation && (
                    <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
                        <h1 className="text-2xl font-semibold text-gray-800">
                            Welcome back, {user.firstName}!
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Start a new conversation or select an existing one from the sidebar
                        </p>
                    </div>
                )}

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto">
                    <FinConversationDashboard conversation={selectedConversation} />
                </div>
            </main>
        </div>
    );
}