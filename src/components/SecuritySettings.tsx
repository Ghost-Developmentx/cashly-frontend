'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';

interface Props {
    user: any;
}

export default function SecuritySettings({ user }: Props) {
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [sessions, setSessions] = useState([
        {
            id: 1,
            device: 'MacBook Pro - Chrome',
            location: 'San Francisco, CA',
            lastActive: 'Active now',
            current: true,
        },
        {
            id: 2,
            device: 'iPhone 13 - Safari',
            location: 'San Francisco, CA',
            lastActive: '2 hours ago',
            current: false,
        },
    ]);

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">Security Settings</h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Manage your account security and authentication methods
                </p>
            </div>

            {/* Two-Factor Authentication */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                Two-Factor Authentication
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Add an extra layer of security to your account
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                        className={`
                            px-4 py-2 text-sm font-medium rounded-md transition-colors
                            ${twoFactorEnabled
                            ? 'bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }
                        `}
                    >
                        {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                    </button>
                </div>
                {twoFactorEnabled && (
                    <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-md">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-green-700 dark:text-green-300">
                                    Two-factor authentication is enabled
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Password */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Password</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Current Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            placeholder="Enter current password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            New Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            placeholder="Enter new password"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
                            placeholder="Confirm new password"
                        />
                    </div>
                    <button className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700">
                        Update Password
                    </button>
                </div>
            </div>

            {/* Active Sessions */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Active Sessions</h3>
                <div className="space-y-3">
                    {sessions.map((session) => (
                        <div
                            key={session.id}
                            className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {session.device}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {session.location} • {session.lastActive}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                {session.current && (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                                        Current
                                    </span>
                                )}
                                {!session.current && (
                                    <button className="text-sm text-red-600 hover:text-red-700 dark:text-red-400">
                                        End Session
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <button className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 font-medium">
                        End All Other Sessions
                    </button>
                </div>
            </div>

            {/* Login Activity */}
            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Recent Login Activity</h3>
                <div className="space-y-3">
                    {[
                        { date: 'Today at 2:34 PM', location: 'San Francisco, CA', device: 'Chrome on MacOS' },
                        { date: 'Yesterday at 9:12 AM', location: 'San Francisco, CA', device: 'Safari on iOS' },
                        { date: 'Jan 15 at 3:45 PM', location: 'New York, NY', device: 'Chrome on Windows' },
                    ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                            <div>
                                <p className="text-sm text-gray-900 dark:text-white">{activity.date}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {activity.location} • {activity.device}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-4">
                    <a href="#" className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
                        View All Activity →
                    </a>
                </div>
            </div>
        </div>
    );
}