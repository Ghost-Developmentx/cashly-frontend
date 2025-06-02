'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProfileHeader from '@/components/ProfileHeader';
import ProfileSettings from '@/components/ProfileSettings';
import BillingSettings from '@/components/BillingSettings';
import NotificationSettings from '@/components/NotificationSettings';
import SecuritySettings from '@/components/SecuritySettings';
import IntegrationsSettings from '@/components/IntegrationsSettings';

export default function ProfilePage() {
    const { user, isLoaded, isSignedIn } = useUser();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState('profile');
    const [darkMode, setDarkMode] = useState(false);

    // Set active tab from URL params
    useEffect(() => {
        const tab = searchParams.get('tab');
        if (tab && ['profile', 'settings', 'billing', 'notifications', 'security', 'integrations'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [searchParams]);

    // Check for system dark mode preference
    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        setDarkMode(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
        mediaQuery.addEventListener('change', handler);
        return () => mediaQuery.removeEventListener('change', handler);
    }, []);

    if (!isLoaded) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isSignedIn) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Access Denied</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">Please sign in to access your profile.</p>
                </div>
            </div>
        );
    }

    const tabs = [
        {
            id: 'profile',
            label: 'Profile',
            icon: 'user',
            description: 'Manage your personal information'
        },
        {
            id: 'settings',
            label: 'Preferences',
            icon: 'settings',
            description: 'Customize your experience'
        },
        {
            id: 'billing',
            label: 'Billing',
            icon: 'credit-card',
            description: 'Manage subscription and payments'
        },
        {
            id: 'notifications',
            label: 'Notifications',
            icon: 'bell',
            description: 'Control how we contact you'
        },
        {
            id: 'security',
            label: 'Security',
            icon: 'shield',
            description: 'Protect your account'
        },
        {
            id: 'integrations',
            label: 'Integrations',
            icon: 'puzzle',
            description: 'Connected services'
        },
    ];

    const renderTabIcon = (iconType: string) => {
        const iconClass = "w-5 h-5";
        switch (iconType) {
            case 'user':
                return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                );
            case 'settings':
                return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
            case 'credit-card':
                return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                );
            case 'bell':
                return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                );
            case 'shield':
                return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                );
            case 'puzzle':
                return (
                    <svg className={iconClass} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                    </svg>
                );
            default:
                return null;
        }
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <ProfileHeader user={user} />;
            case 'settings':
                return <ProfileSettings user={user} />;
            case 'billing':
                return <BillingSettings user={user} />;
            case 'notifications':
                return <NotificationSettings user={user} />;
            case 'security':
                return <SecuritySettings user={user} />;
            case 'integrations':
                return <IntegrationsSettings user={user} />;
            default:
                return <ProfileHeader user={user} />;
        }
    };

    return (
        <div className={`min-h-screen transition-colors ${darkMode ? 'dark' : ''}`}>
            <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
                {/* Header */}
                <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => window.history.back()}
                                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                        </svg>
                                    </button>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            Account Settings
                                        </h1>
                                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                            Manage your account settings and preferences
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                    >
                                        {darkMode ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                            </svg>
                                        )}
                                    </button>
                                    <a
                                        href="/dashboard"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Back to Dashboard
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-3 mb-8 lg:mb-0">
                            <nav className="space-y-1">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            w-full group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                                            ${activeTab === tab.id
                                            ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400'
                                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                                        }
                                        `}
                                    >
                                        <div className={`
                                            mr-3 flex-shrink-0
                                            ${activeTab === tab.id ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}
                                        `}>
                                            {renderTabIcon(tab.icon)}
                                        </div>
                                        <div className="text-left">
                                            <div>{tab.label}</div>
                                            <div className={`text-xs ${activeTab === tab.id ? 'text-blue-600 dark:text-blue-300' : 'text-gray-500 dark:text-gray-400'}`}>
                                                {tab.description}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </nav>

                            {/* Help Section */}
                            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">Need help?</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            Check our docs or contact support
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-4 flex space-x-2">
                                    <a href="/docs" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                        View Docs
                                    </a>
                                    <span className="text-gray-300 dark:text-gray-600">•</span>
                                    <a href="/support" className="text-xs text-blue-600 dark:text-blue-400 hover:underline">
                                        Contact Support
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-9">
                            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}