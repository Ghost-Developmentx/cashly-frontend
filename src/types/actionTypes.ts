export const ACTION_TYPES = {
    // Bank Connection Actions
    PLAID_CONNECTION_INITIATED: 'plaid_connection_initiated',
    PLAID_CONNECTION_SUCCESS: 'plaid_connection_success',
    PLAID_CONNECTION_ERROR: 'plaid_connection_error',
    INITIATE_PLAID_CONNECTION: 'initiate_plaid_connection',

    // Account Actions
    ACCOUNTS_SHOW: 'show_accounts',
    ACCOUNT_DISCONNECT_SUCCESS: 'account_disconnect_success',
    ACCOUNT_DISCONNECT_ERROR: 'account_disconnect_error',

    // Transaction Actions
    TRANSACTIONS_SHOW: 'show_transactions',
    TRANSACTION_CREATE_SUCCESS: 'transaction_create_success',
    TRANSACTION_CREATE_ERROR: 'transaction_create_error',
    TRANSACTION_UPDATE_SUCCESS: 'transaction_update_success',
    TRANSACTION_UPDATE_ERROR: 'transaction_update_error',
    TRANSACTION_DELETE_SUCCESS: 'transaction_delete_success',
    TRANSACTION_DELETE_ERROR: 'transaction_delete_error',
    TRANSACTIONS_CATEGORIZE_SUCCESS: 'transactions_categorize_success',

    // Invoice Actions
    INVOICE_CREATE_INITIATED: 'invoice_create_initiated',
    INVOICE_CREATE_SUCCESS: 'invoice_create_success',
    INVOICE_CREATE_ERROR: 'invoice_create_error',
    INVOICE_CREATED: 'invoice_created',
    SEND_INVOICE: 'send_invoice',
    INVOICE_DELETE_SUCCESS: 'invoice_delete_success',
    INVOICE_DELETE_ERROR: 'invoice_delete_error',


    INVOICE_SEND_INITIATED: 'invoice_send_initiated',
    INVOICE_SEND_SUCCESS: 'invoice_send_success',
    INVOICE_SEND_ERROR: 'invoice_send_error',

    INVOICES_SHOW: 'show_invoices',
    INVOICE_REMINDER_SUCCESS: 'invoice_reminder_success',
    INVOICE_MARK_PAID_SUCCESS: 'invoice_mark_paid_success',

    // Stripe Connect Actions
    STRIPE_CONNECT_SETUP_INITIATED: 'stripe_connect_setup_initiated',
    STRIPE_CONNECT_STATUS_SHOW: 'show_stripe_connect_status',
    STRIPE_DASHBOARD_OPEN: 'open_stripe_dashboard',
    STRIPE_CONNECT_ERROR: 'stripe_connect_error',

    // Forecasting & Analysis Actions
    FORECAST_SHOW: 'show_forecast',
    BUDGET_SHOW: 'show_budget',
    TRENDS_SHOW: 'show_trends',
    ANOMALIES_SHOW: 'show_anomalies',

    // Error Actions
    GENERAL_ERROR: 'general_error',
} as const;

export type ActionType = typeof ACTION_TYPES[keyof typeof ACTION_TYPES];

// Helper to check if the action type is valid
export const isValidActionType = (type: string): type is ActionType => {
    return Object.values(ACTION_TYPES).includes(type as ActionType);
};