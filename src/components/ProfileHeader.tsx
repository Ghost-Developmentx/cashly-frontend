'use client';

import { UserProfile } from '@clerk/nextjs';
import { useState } from 'react';

interface Props {
    user: any;
}

export default function ProfileHeader({ user }: Props) {
    const [activeView, setActiveView] = useState<'overview' | 'profile'>('overview');

    return (
        <div className="p-6 space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 -m-6 mb-6 p-8 text-white">
                <div className="flex items-center space-x-6">
                    <div className="relative">
                        <img
                            className="h-24 w-24 rounded-full border-4 border-white shadow-lg"
                            src={user.imageUrl || '/default-avatar.png'}
                            alt={`${user.firstName} ${user.lastName}`}
                        />
                        <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-3xl font-bold">
                            {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-blue-100 mt-1">
                            {user.primaryEmailAddress?.emailAddress}
                        </p>
                        <div className="flex items-center space-x-4 mt-3">
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/20 backdrop-blur">
                                Pro Plan
                            </span>
                            <span className="text-sm text-blue-100">
                                Member since {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </span>
                        </div>
                    </div>
                    <div>
                        <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                            Edit Profile
                        </button>
                    </div>
                </div>
            </div>

            {/* Toggle View */}
            <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                    onClick={() => setActiveView('overview')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                        activeView === 'overview'
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveView('profile')}
                    className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors ${
                        activeView === 'profile'
                            ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                >
                    Manage Profile
                </button>
            </div>

            {activeView === 'overview' ? (
                <div className="space-y-6">
                    {/* Account Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Balance</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">$124,893</p>
                                </div>
                                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
                                    <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Conversations</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">147</p>
                                </div>
                                <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Invoices Sent</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">28</p>
                                </div>
                                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                                    <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Since</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                        {Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days
                                    </p>
                                </div>
                                <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                                    <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">Quick Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <button className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors text-left">
                                <svg className="w-8 h-8 text-blue-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Export Data</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Download your financial data</p>
                            </button>

                            <button className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors text-left">
                                <svg className="w-8 h-8 text-green-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Invite Team</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Add team members</p>
                            </button>

                            <button className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-blue-500 transition-colors text-left">
                                <svg className="w-8 h-8 text-purple-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">Activity Log</h4>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">View account activity</p>
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-6">
                    <UserProfile
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "shadow-none border-0 bg-transparent p-0",
                                navbar: "hidden",
                                pageScrollBox: "p-0",
                                page: "p-0"
                            }
                        }}
                    />
                </div>
            )}
        </div>
    );
}