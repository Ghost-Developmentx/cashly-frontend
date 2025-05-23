'use client';

import { UserProfile } from '@clerk/nextjs';

interface Props {
    user: any;
}

export default function ProfileHeader({ user }: Props) {
    return (
        <div className="space-y-6">
            {/* User Info Summary */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                        <img
                            className="h-20 w-20 rounded-full border-4 border-white shadow-lg"
                            src={user.imageUrl || '/default-avatar.png'}
                            alt={`${user.firstName} ${user.lastName}`}
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-2xl font-bold">
                            {user.firstName} {user.lastName}
                        </h2>
                        <p className="text-blue-100">
                            {user.primaryEmailAddress?.emailAddress}
                        </p>
                        <p className="text-blue-100 text-sm mt-1">
                            Member since {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Account Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Account Status</p>
                            <p className="text-lg font-semibold text-gray-900">Active</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Conversations</p>
                            <p className="text-lg font-semibold text-gray-900">12</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center">
                        <div className="flex-shrink-0">
                            <svg className="h-8 w-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                            </svg>
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Plan</p>
                            <p className="text-lg font-semibold text-gray-900">Pro</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clerk User Profile Component */}
            <div className="bg-white rounded-lg border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Profile Management</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Update your personal information, change your password, and manage your account security.
                    </p>
                </div>
                <div className="p-6">
                    <UserProfile
                        routing="hash"
                        appearance={{
                            elements: {
                                rootBox: "w-full",
                                card: "shadow-none border-0",
                                navbar: "hidden",
                                pageScrollBox: "p-0",
                                page: "p-0"
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}