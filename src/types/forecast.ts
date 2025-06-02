import {FinAction} from "@/types/financial";

export interface ForecastDataPoint {
    date: string;
    actual?: number;
    predicted: number;
    optimistic?: number;
    pessimistic?: number;
    confidence?: number;
}

export interface ForecastSummary {
    totalProjected: number;
    averageDaily: number;
    trend: 'up' | 'down' | 'stable';
    confidenceScore: number;
    periodDays: number;
}

export interface ScenarioAdjustment {
    type: 'income' | 'expense' | 'both';
    percentage?: number;
    amount?: number;
    category?: string;
    description: string;
}

export interface ForecastData {
    id: string;
    title: string;
    dataPoints: ForecastDataPoint[];
    summary: ForecastSummary;
    scenarios?: {
        base: ForecastDataPoint[];
        adjusted?: ForecastDataPoint[];
    };
    adjustments?: ScenarioAdjustment[];
    generatedAt: string;
}

export interface ForecastAction extends FinAction {
    type: 'show_forecast' | 'show_scenario_forecast';
    data: ForecastData;
}