import React, { useState } from 'react';
import ForecastChart from './ForecastChart';
import { ForecastData, ScenarioAdjustment } from '@/types/forecast';
import { formatCurrency } from '@/utils/formatters';

interface ForecastDisplayProps {
    forecast: ForecastData;
    onRunScenario?: (adjustments: ScenarioAdjustment[]) => void;
    onExport?: () => void;
}

export default function ForecastDisplay({
                                            forecast,
                                            onRunScenario,
                                            onExport
                                        }: ForecastDisplayProps) {
    const [showScenarios, setShowScenarios] = useState(false);
    const [activeTab, setActiveTab] = useState<'chart' | 'insights'>('chart');

    const getTrendIcon = (trend: string) => {
        switch (trend) {
            case 'up':
                return '📈';
            case 'down':
                return '📉';
            default:
                return '➡️';
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                            {forecast.title}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {forecast.summary.periodDays}-day forecast •
                            Generated {new Date(forecast.generatedAt).toLocaleTimeString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {forecast.scenarios && (
                            <button
                                onClick={() => setShowScenarios(!showScenarios)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                                    showScenarios
                                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                                        : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                                } hover:bg-blue-200 dark:hover:bg-blue-800`}
                            >
                                {showScenarios ? 'Hide' : 'Show'} Scenarios
                            </button>
                        )}
                        {onExport && (
                            <button
                                onClick={onExport}
                                className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                title="Export forecast"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex">
                    <button
                        onClick={() => setActiveTab('chart')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'chart'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                    >
                        Visualization
                    </button>
                    <button
                        onClick={() => setActiveTab('insights')}
                        className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
                            activeTab === 'insights'
                                ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'
                        }`}
                    >
                        Key Insights
                    </button>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'chart' ? (
                    <ForecastChart
                        data={forecast}
                        showScenarios={showScenarios}
                        height={350}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Summary Stats */}
                        <div className="space-y-4">
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Total Projected
                  </span>
                                    <span className="text-lg">{getTrendIcon(forecast.summary.trend)}</span>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                    {formatCurrency(forecast.summary.totalProjected)}
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    Daily Average
                                </p>
                                <p className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                    {formatCurrency(forecast.summary.averageDaily)}
                                </p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        Confidence Score
                                    </p>
                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        {(forecast.summary.confidenceScore * 100).toFixed(0)}%
                                    </p>
                                </div>
                                <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-600 h-2 rounded-full transition-all"
                                        style={{ width: `${forecast.summary.confidenceScore * 100}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Adjustments */}
                        {forecast.adjustments && forecast.adjustments.length > 0 && (
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                    Scenario Adjustments Applied
                                </h4>
                                {forecast.adjustments.map((adj, idx) => (
                                    <div key={idx} className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
                                        <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                            {adj.description}
                                        </p>
                                        <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">
                                            {adj.type} • {adj.percentage ? `${adj.percentage}%` : formatCurrency(adj.amount || 0)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Actions */}
            {onRunScenario && (
                <div className="px-6 py-4 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Want to explore different scenarios? Try asking Fin:
                        <span className="block mt-1 italic">
              &#34;What if my income increases by 20%?&#34; or &#34;Show me a conservative forecast&#34;
            </span>
                    </p>
                </div>
            )}
        </div>
    );
}