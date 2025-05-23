'use client';

import { useState } from 'react';

interface Props {
    user: any;
}

interface NotificationSettings {
    emailNotifications: boolean;
    pushNotifications: boolean;
    weeklyReports: boolean;
    budgetAlerts: boolean;
    unusualActivity: boolean;
    marketingEmails: boolean;
    productUpdates: boolean;
    securityAlerts: boolean;
}

export default function NotificationSettings({ user }: Props) {
    const [settings, setSettings] = useState<NotificationSettings>({
        emailNotifications: true,
        pushNotifications: true,
        weeklyReports: true,
        budgetAlerts: true,
        unusualActivity: true,
        marketingEmails: false,
        productUpdates: true,
        securityAlerts: true,
    });

    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const handleToggle = (key: keyof NotificationSettings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setMessage(null);

        // Simulate API call
        setTimeout(() => {
            setIsSaving(false);
            setMessage('Notification settings saved successfully!');
            setTimeout(() => setMessage(null), 3000);
        }, 1000);
    };

    const ToggleSwitch = ({
                              enabled,
                              onChange,
                              label,
                              description
                          }: {
        enabled: boolean;
        onChange: () => void;
        label: string;
        description: string;
    }) => (
        <div className="flex items-center justify-between py-4">
            <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{label}</h4>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button
                onClick={onChange}
                className={`
          relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
          transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${enabled ? 'bg-blue-600' : 'bg-gray-200'}
        `}
            >
        <span
            className={`
            pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 
            transition duration-200 ease-in-out
            ${enabled ? 'translate-x-5' : 'translate-x-0'}
          `}
        />
            </button>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Success Message */}
            {message && (
                <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <div className="flex">
                        <div className="flex-shrink-0">
                            <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <div className="ml-3">
                            <p className="text-sm text-green-700">{message}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Email Notifications */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-1">
                    <ToggleSwitch
                        enabled={settings.emailNotifications}
                        onChange={() => handleToggle('emailNotifications')}
                        label="Email Notifications"
                        description="Receive notifications via email"
                    />
                    <ToggleSwitch
                        enabled={settings.weeklyReports}
                        onChange={() => handleToggle('weeklyReports')}
                        label="Weekly Financial Reports"
                        description="Get a summary of your financial activity each week"
                    />
                    <ToggleSwitch
                        enabled={settings.budgetAlerts}
                        onChange={() => handleToggle('budgetAlerts')}
                        label="Budget Alerts"
                        description="Get notified when you're approaching budget limits"
                    />
                    <ToggleSwitch
                        enabled={settings.unusualActivity}
                        onChange={() => handleToggle('unusualActivity')}
                        label="Unusual Activity Alerts"
                        description="Get notified about unusual spending patterns or transactions"
                    />
                </div>
            </div>

            {/* Push Notifications */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Push Notifications</h3>
                <div className="space-y-1">
                    <ToggleSwitch
                        enabled={settings.pushNotifications}
                        onChange={() => handleToggle('pushNotifications')}
                        label="Push Notifications"
                        description="Receive push notifications on your devices"
                    />
                </div>
            </div>

            {/* Security & Updates */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security & Updates</h3>
                <div className="space-y-1">
                    <ToggleSwitch
                        enabled={settings.securityAlerts}
                        onChange={() => handleToggle('securityAlerts')}
                        label="Security Alerts"
                        description="Get notified about important security updates and login attempts"
                    />
                    <ToggleSwitch
                        enabled={settings.productUpdates}
                        onChange={() => handleToggle('productUpdates')}
                        label="Product Updates"
                        description="Receive notifications about new features and improvements"
                    />
                </div>
            </div>

            {/* Marketing */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Marketing & Promotions</h3>
                <div className="space-y-1">
                    <ToggleSwitch
                        enabled={settings.marketingEmails}
                        onChange={() => handleToggle('marketingEmails')}
                        label="Marketing Emails"
                        description="Receive promotional emails and special offers"
                    />
                </div>
            </div>

            {/* Notification Schedule */}
            <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Schedule</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quiet Hours Start
                        </label>
                        <input
                            type="time"
                            defaultValue="22:00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Quiet Hours End
                        </label>
                        <input
                            type="time"
                            defaultValue="08:00"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                    No notifications will be sent during quiet hours, except for security alerts.
                </p>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isSaving ? 'Saving...' : 'Save Notification Settings'}
                </button>
            </div>
        </div>
    );
}