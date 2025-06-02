import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    ReferenceLine
} from 'recharts';
import { ForecastData } from '@/types/forecast';
import { formatCurrency } from '@/utils/formatters';

interface ForecastChartProps {
    data: ForecastData;
    height?: number;
    showScenarios?: boolean;
}

export default function ForecastChart({
                                          data,
                                          height = 300,
                                          showScenarios = false
                                      }: ForecastChartProps) {
    const chartData = data.dataPoints;
    const hasActualData = chartData.some(point => point.actual !== undefined);

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (!active || !payload) return null;

        return (
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
                    {new Date(label).toLocaleDateString()}
                </p>
                {payload.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                        <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-gray-600 dark:text-gray-400">
              {entry.name}:
            </span>
                        <span className="font-medium text-gray-900 dark:text-gray-100">
              {formatCurrency(entry.value)}
            </span>
                    </div>
                ))}
            </div>
        );
    };

    // Find today's date index for the reference line
    const todayIndex = chartData.findIndex(point =>
        new Date(point.date).toDateString() === new Date().toDateString()
    );

    return (
        <div className="w-full">
            <ResponsiveContainer width="100%" height={height}>
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="predictedGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="optimisticGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>

                    <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200 dark:stroke-gray-700" />

                    <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric'
                        })}
                        className="text-gray-600 dark:text-gray-400"
                    />

                    <YAxis
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => formatCurrency(value, 'USD')}
                        className="text-gray-600 dark:text-gray-400"
                    />

                    <Tooltip content={<CustomTooltip />} />

                    {todayIndex > -1 && (
                        <ReferenceLine
                            x={chartData[todayIndex]?.date}
                            stroke="#6b7280"
                            strokeDasharray="5 5"
                            label={{ value: "Today", position: "top" }}
                        />
                    )}

                    {hasActualData && (
                        <Area
                            type="monotone"
                            dataKey="actual"
                            stroke="#10b981"
                            fillOpacity={1}
                            fill="url(#actualGradient)"
                            strokeWidth={2}
                            name="Actual"
                        />
                    )}

                    <Area
                        type="monotone"
                        dataKey="predicted"
                        stroke="#3b82f6"
                        fillOpacity={1}
                        fill="url(#predictedGradient)"
                        strokeWidth={2}
                        strokeDasharray={hasActualData ? "5 5" : "0"}
                        name="Predicted"
                    />

                    {showScenarios && chartData[0]?.optimistic && (
                        <Area
                            type="monotone"
                            dataKey="optimistic"
                            stroke="#8b5cf6"
                            fillOpacity={1}
                            fill="url(#optimisticGradient)"
                            strokeWidth={1}
                            strokeDasharray="3 3"
                            name="Best Case"
                        />
                    )}

                    {showScenarios && chartData[0]?.pessimistic && (
                        <Area
                            type="monotone"
                            dataKey="pessimistic"
                            stroke="#ef4444"
                            fillOpacity={0}
                            strokeWidth={1}
                            strokeDasharray="3 3"
                            name="Worst Case"
                        />
                    )}

                    <Legend
                        wrapperStyle={{ paddingTop: '20px' }}
                        iconType="line"
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}