// sidebar/ConversationList.tsx
import { Conversation } from './types';
import { formatDate } from './utils';
import ConversationItem from './ConversationItem';

type Props = {
    conversations: Conversation[];
    activeId?: string;
    onSelect: (id: number) => void;
};

export default function ConversationList({
                                             conversations,
                                             activeId,
                                             onSelect,
                                         }: Props) {
    // group by formatted date
    const groups = conversations.reduce<Record<string, Conversation[]>>((acc, c) => {
        const key = formatDate(c.created_at);
        (acc[key] ||= []).push(c);
        return acc;
    }, {});

    if (conversations.length === 0)
        return (
            <div className="p-4 text-center text-gray-400">
                No conversations yet
            </div>
        );

    return (
        <div className="flex-1 overflow-y-auto py-2">
            {Object.entries(groups).map(([date, list]) => (
                <div key={date} className="mb-4">
                    <h3 className="px-4 py-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                        {date}
                    </h3>
                    <div className="space-y-1 px-2">
                        {list.map((c) => (
                            <ConversationItem
                                key={c.id}
                                conv={c}
                                isActive={activeId === String(c.id)}
                                onClick={onSelect}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
