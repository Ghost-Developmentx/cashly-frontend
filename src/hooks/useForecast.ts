import { useState, useCallback } from 'react';
import { ForecastData, ForecastAction, ScenarioAdjustment } from '@/types/forecast';
import { FinAction } from '@/types/financial';

export function useForecast() {
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);

    const handleForecastAction = useCallback((action: FinAction) => {
        if (action.type === 'show_forecast' || action.type === 'show_scenario_forecast') {
            const forecastAction = action as ForecastAction;
            setForecastData(forecastAction.data);
            return true;
        }
        return false;
    }, []);

    const runScenario = useCallback(async (adjustments: ScenarioAdjustment[]) => {
        // This would send a request to run a new scenario
        console.log('Running scenario with adjustments:', adjustments);
        // You would implement the actual API call here
    }, []);

    const exportForecast = useCallback(() => {
        if (!forecastData) return;

        // Convert to CSV or other format
        const csv = convertForecastToCSV(forecastData);
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `forecast-${new Date().toISOString()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, [forecastData]);

    const clearForecast = useCallback(() => {
        setForecastData(null);
    }, []);

    return {
        forecastData,
        handleForecastAction,
        runScenario,
        exportForecast,
        clearForecast
    };
}

// Helper function to convert forecast to CSV
function convertForecastToCSV(forecast: ForecastData): string {
    const headers = ['Date', 'Predicted', 'Actual', 'Optimistic', 'Pessimistic'];
    const rows = forecast.dataPoints.map(point => [
        point.date,
        point.predicted,
        point.actual || '',
        point.optimistic || '',
        point.pessimistic || ''
    ]);

    return [
        headers.join(','),
        ...rows.map(row => row.join(','))
    ].join('\n');
}