import { useState } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

/**
 * Enterprise‑style user menu.
 * ‑ Avatar toggle (always visible)
 * ‑ Hover/focus reveals dropdown with invisible "bridge" to prevent accidental close.
 */

export default function UserMenu() {
    const [open, setOpen] = useState(false);
    const { signOut } = useAuth();
    const { user } = useUser();
    const router = useRouter();

    const initials =
        user?.firstName?.[0] ??
        user?.primaryEmailAddress?.emailAddress?.[0]?.toUpperCase() ??
        'U';

    const fullName = user?.firstName && user?.lastName
        ? `${user.firstName} ${user.lastName}`
        : user?.primaryEmailAddress?.emailAddress ?? 'User Account';

    const handleSignOut = async () => {
        await signOut();
        router.push('/');
    };

    const show = () => setOpen(true);
    const hide = () => setOpen(false);

    return (
        <div
            className="relative border-t border-gray-700 p-4"
            onMouseEnter={show}
            onMouseLeave={hide}
        >
            {/* Toggle */}
            <div className="flex cursor-pointer items-center gap-3 rounded-lg p-2 hover:bg-gray-800">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-medium text-white">
                    {initials}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">{fullName}</p>
                    <p className="text-xs text-gray-400">Financial Dashboard</p>
                </div>
            </div>

            {/* Dropdown */}
            {open && (
                <div
                    className="absolute bottom-full left-0 right-0 translate-y-[-8px] overflow-hidden rounded-lg border border-gray-700 bg-gray-800 shadow-lg"
                    onMouseEnter={show}
                    onMouseLeave={hide}
                >
                    {/* Invisible bridge to keep hover alive */}
                    <div className="pointer-events-none absolute inset-x-0 -bottom-2 h-3" />

                    <header className="border-b border-gray-700 px-4 py-3">
                        <p className="text-sm font-medium text-white">{fullName}</p>
                        <p className="mt-0.5 text-xs text-gray-400">
                            {user?.primaryEmailAddress?.emailAddress}
                        </p>
                    </header>

                    <nav className="py-1 text-sm text-gray-300">
                        <a href="/profile" className="flex items-center px-4 py-2 hover:bg-gray-700 hover:text-white">
                            <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                <path d="M12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Profile
                        </a>
                        <a href="/profile?tab=settings" className="flex items-center px-4 py-2 hover:bg-gray-700 hover:text-white">
                            <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="3" />
                                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 110-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06a1.65 1.65 0 001.82.33h.09a1.65 1.65 0 001-1.51V3a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82v.09a1.65 1.65 0 001.51 1H21a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z" />
                            </svg>
                            Settings
                        </a>
                        <a href="/profile?tab=billing" className="flex items-center px-4 py-2 hover:bg-gray-700 hover:text-white">
                            <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <rect x="2" y="4" width="20" height="16" rx="2" ry="2" />
                                <line x1="2" y1="10" x2="22" y2="10" />
                            </svg>
                            Billing & Plans
                        </a>
                        <button onClick={handleSignOut} className="flex w-full items-center px-4 py-2 text-left hover:bg-gray-700 hover:text-white">
                            <svg className="mr-3 h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M17 16l4-4-4-4" />
                                <path d="M7 12h14" />
                                <path d="M7 12V3m0 18v-9" />
                            </svg>
                            Sign out
                        </button>
                    </nav>
                </div>
            )}
        </div>
    );
}