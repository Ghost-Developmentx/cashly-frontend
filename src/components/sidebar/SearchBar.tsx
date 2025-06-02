type Props = {
    value: string;
    onChange: (v: string) => void;
};

export default function SearchBar({ value, onChange }: Props) {
    return (
        <div className="p-4 border-b border-gray-700">
            <div className="relative">
                <svg
                    className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                >
                    <path
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                <input
                    type="text"
                    placeholder="Search conversations..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full rounded-lg border border-gray-600 bg-gray-800 py-2 pl-10 pr-4 text-white placeholder-gray-400
                     focus:border-transparent focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
            </div>
        </div>
    );
}
