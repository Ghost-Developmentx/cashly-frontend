export interface Account {
    id: string;
    name: string;
    type: string;
    account_type?: string; // For compatibility with backend
    balance: number;
    institution: string;
    transaction_count?: number;
    last_synced?: string;
    plaid_account_id?: string;
}

export interface Transaction {
    id: string;
    amount: number;
    description: string;
    date: string;
    category: string;
    category_id?: string;
    account?: {
        id: string;
        name: string;
        type?: string;
    };
    account_id?: string;
    account_name?: string;
    recurring: boolean;
    editable: boolean;
    plaid_synced?: boolean;
    ai_categorized?: boolean;
    created_at?: string;
    plaid_transaction_id?: string;
}

export interface TransactionSummary {
    count: number;
    total_income: number;
    total_expenses: number;
    net_change: number;
    date_range: string;
    category_breakdown: Record<string, number>;
    filters_applied?: Record<string, unknown>;
}

export interface TransactionData {
    transactions: Transaction[];
    summary: TransactionSummary;
}

export interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

export interface Conversation {
    id: string;
    title: string;
    messages: Message[];
}

export interface FinAction {
    type: string;
    action?: string;
    data?: unknown;
    count?: number;
    user_id?: string;
    error?: string;
    message?: string;
    links?: Array<{
        text: string;
        url: string;
    }>;
}

export interface ApiResponse {
    message: string;
    actions?: FinAction[];
    conversation_history?: Array<{ role: string; content: string }>;
}

// Form data interfaces
export interface TransactionFormData {
    amount: string;
    description: string;
    date: string;
    category: string;
    account_id: string;
    recurring: boolean;
    transaction_type: 'income' | 'expense';
}

// API response interfaces
export interface TransactionApiResponse {
    success: boolean;
    transaction?: Transaction;
    error?: string;
    message?: string;
    changes?: Record<string, { from: unknown; to: unknown }>;
}

export interface AccountApiResponse {
    success: boolean;
    accounts?: Account[];
    message?: string;
    error?: string;
}