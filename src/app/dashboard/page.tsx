'use client';

import { useUser } from "@clerk/nextjs";
import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import FinConversationDashboard from "@/components/FinConversationDashboard";

export default function DashboardPage() {
    const { user, isSignedIn } = useUser();
    const [selectedConversation, setSelectedConversation] = useState<{
        id: string;
        title: string;
        messages: never[];
    } | null>(null);


  if (!isSignedIn) return <div>Loading...</div>;

    return (
        <div className="flex h-screen bg-gray-50">
            {/* Sidebar */}
            <Sidebar onSelectConversation={(conversation) => setSelectedConversation(conversation)} />

            {/* Main Chat Panel */}
            <main className="flex-1 flex flex-col">
                <div className="flex-shrink-0 px-6 py-4 border-b border-gray-200">
                    <h1 className="text-2xl font-semibold text-gray-800">
                        Welcome back, {user.firstName}!
                    </h1>
                </div>

                {/* Chat Area */}
                <div className="flex-1 overflow-y-auto">
                    <FinConversationDashboard conversation={selectedConversation} />
                </div>
            </main>
        </div>
    );
}
