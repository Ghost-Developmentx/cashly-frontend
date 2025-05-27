import { FinAction } from '@/types/financial';

export class ActionDebugger {
    private static actions: Array<{ timestamp: number; action: FinAction }> = [];

    static logAction(action: FinAction) {
        this.actions.push({
            timestamp: Date.now(),
            action: { ...action }
        });

        // Keep only the last 50 actions
        if (this.actions.length > 50) {
            this.actions = this.actions.slice(-50);
        }

        console.group(`🎬 Action: ${action.type}`);
        console.log('Data:', action.data);
        console.log('Message:', action.message);
        console.groupEnd();
    }

    static getActionHistory(): Array<{ timestamp: number; action: FinAction }> {
        return [...this.actions];
    }

    static getActionsByType(type: string): Array<{ timestamp: number; action: FinAction }> {
        return this.actions.filter(item => item.action.type === type);
    }

    static findDuplicateActions(): Array<{ type: string; count: number; timestamps: number[] }> {
        const typeGroups: Record<string, number[]> = {};

        this.actions.forEach(item => {
            if (!typeGroups[item.action.type]) {
                typeGroups[item.action.type] = [];
            }
            typeGroups[item.action.type].push(item.timestamp);
        });

        return Object.entries(typeGroups)
            .filter(([_, timestamps]) => timestamps.length > 1)
            .map(([type, timestamps]) => ({
                type,
                count: timestamps.length,
                timestamps
            }));
    }

    static exportDebugData(): string {
        return JSON.stringify({
            actionHistory: this.actions,
            duplicates: this.findDuplicateActions(),
            exportTime: new Date().toISOString()
        }, null, 2);
    }

    static clear() {
        this.actions = [];
        console.log('🧹 Action debugger cleared');
    }
}

// Add to window for console access
if (typeof window !== 'undefined') {
    (window as any).actionDebugger = ActionDebugger;
}