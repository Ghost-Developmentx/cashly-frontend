export interface Conversation {
    id: number;
    title: string | null;
    created_at: string;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export interface FullConversation {
    id: string;
    title: string;
    messages: Message[];
}
