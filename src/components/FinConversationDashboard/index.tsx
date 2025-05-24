'use client';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import PlaidChatLink from '../PlaidChatLink';
import AccountDisplay from '../AccountDisplay';
import TransactionDisplay from '../TransactionDisplay';
import TransactionEditModal from '../TransactionEditModal';
import StripeConnectSetup from '../StripeConnectSetup';
import InvoiceDisplay, { Invoice } from '../InvoiceDisplay';
import { useUser, useAuth } from '@clerk/nextjs';
import {
  Message,
  Account,
  Transaction,
  TransactionData,
  FinAction,
  ApiResponse
} from '@/types/financial';

type Props = {
  conversation: {
    id: string;
    title: string;
    messages: Message[];
  } | null;
};

export default function FinConversationDashboard({ conversation }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPlaidLink, setShowPlaidLink] = useState(false);
  const [accountData, setAccountData] = useState<Account[]>([]);
  const [transactionData, setTransactionData] = useState<TransactionData | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [showTransactionModal, setShowTransactionModal] = useState(false);
  const [isNewTransaction, setIsNewTransaction] = useState(false);
  const [invoiceData, setInvoiceData] = useState<Invoice[]>([]);
  const [showStripeConnectSetup, setShowStripeConnectSetup] = useState(false);
  const [stripeConnectStatus, setStripeConnectStatus] = useState<any>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('Conversation changed:', conversation);

    if (conversation?.messages) {
      // Map the messages to ensure they have proper IDs
      const formattedMessages = conversation.messages.map((msg, index) => ({
        id: msg.id || `msg-${index}-${Date.now()}`, // Ensure each message has an ID
        role: msg.role,
        content: msg.content
      }));

      console.log('Setting messages:', formattedMessages);
      setMessages(formattedMessages);
    } else {
      // Clear messages when no conversation is selected
      setMessages([]);
    }

    // Clear any previous errors when switching conversations
    setError(null);
  }, [conversation]); // Watch the entire conversation object

  const handleStripeConnectSuccess = (status: any) => {
    console.log('Stripe Connect setup successful:', status);
    setStripeConnectStatus(status);
    setShowStripeConnectSetup(false);

    const successMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: `🎉 Excellent! Your Stripe Connect account is now ${status.can_accept_payments ? 'active and ready to accept payments' : 'set up'}! ${
          status.can_accept_payments
              ? 'You can now send invoices and receive payments directly through Cashly.'
              : 'Please complete the onboarding process to start accepting payments.'
      }`
    };
    setMessages(prev => [...prev, successMessage]);
  };

  const handleStripeConnectError = (error: string) => {
    console.error('Stripe Connect setup error:', error);
    setShowStripeConnectSetup(false);

    const errorMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: `❌ ${error}`
    };
    setMessages(prev => [...prev, errorMessage]);
  };

  const handleInvoiceEdit = (invoice: Invoice) => {
    // TODO: Implement invoice edit modal
    console.log('Edit invoice:', invoice);
  };

  const handleSendReminder = async (invoice: Invoice) => {
    const confirmMessage = `Send payment reminder to ${invoice.client_name} for invoice ${invoice.invoice_number}?`;
    if (!confirm(confirmMessage)) return;

    // Send it through Fin
    await sendMessage(`Send payment reminder for invoice ${invoice.id}`);
  };

  const handleMarkPaid = async (invoice: Invoice) => {
    const confirmMessage = `Mark invoice ${invoice.invoice_number} as paid?`;
    if (!confirm(confirmMessage)) return;

    // Send it through Fin
    await sendMessage(`Mark invoice ${invoice.id} as paid`);
  };

  const handleCreateInvoice = () => {
    // Trigger invoice creation flow through Fin
    sendMessage("I want to create a new invoice").then(r => r);
  };

  const handlePlaidSuccess = (accounts: Account[]) => {
    console.log('Plaid connection successful:', accounts);
    setAccountData(accounts);
    setShowPlaidLink(false);

    // Add a success message to the chat
    const successMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: `🎉 Great! I've successfully connected ${accounts.length} bank account${accounts.length !== 1 ? 's' : ''} for you. I can now provide personalized financial insights based on your real transaction data!`
    };
    setMessages(prev => [...prev, successMessage]);
  };

  const handlePlaidError = (errorMessage: string) => {
    console.error('Plaid connection error:', errorMessage);
    setShowPlaidLink(false);
    setError(errorMessage);

    // Add an error message to the chat
    const errorMsg: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: `I'm sorry, there was an issue connecting your bank account: ${errorMessage}. Please try again or contact support if the problem persists.`
    };
    setMessages(prev => [...prev, errorMsg]);
  };


  const handlePlaidExit = () => {
    console.log('Plaid connection cancelled');
    setShowPlaidLink(false);

    // Add a cancellation message to the chat
    const cancelMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: `No problem! You can connect your bank account anytime by asking me to "connect my bank account" or "link my accounts". I'm here whenever you're ready! 👍`
    };
    setMessages(prev => [...prev, cancelMessage]);
  };

  const handleAccountDisconnect = async (accountId: string) => {
    try {
      const token = await getToken();
      const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/fin/accounts/disconnect_account`,
          {
            data: { account_id: accountId },
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
      );

      if (response.data.success) {
        // Remove the account from the local state
        setAccountData(prev => prev.filter(account => account.id !== accountId));

        // Add a success message
        const successMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: response.data.message
        };
        setMessages(prev => [...prev, successMessage]);
      }
    } catch (error) {
      console.error('Error disconnecting account:', error);
      setError('Failed to disconnect account');
    }
  };

  const handleTransactionEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsNewTransaction(false);
    setShowTransactionModal(true);
  };

  const handleTransactionDelete = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return;

    try {
      const token = await getToken();
      const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/fin/transactions/${transactionId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );

      if (response.data.success) {
        // Remove transaction from current data
        if (transactionData) {
          const updatedTransactions = transactionData.transactions.filter((t: Transaction) => t.id !== transactionId);

          // Recalculate summary
          const totalIncome = updatedTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
          const totalExpenses = updatedTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

          setTransactionData({
            ...transactionData,
            transactions: updatedTransactions,
            summary: {
              ...transactionData.summary,
              count: updatedTransactions.length,
              total_income: totalIncome,
              total_expenses: totalExpenses,
              net_change: totalIncome - totalExpenses
            }
          });
        }

        // Add a success message
        const successMessage: Message = {
          id: uuidv4(),
          role: 'assistant',
          content: `✅ Transaction deleted successfully!`
        };
        setMessages(prev => [...prev, successMessage]);
      }
    } catch (error: unknown) {
      console.error('Error deleting transaction:', error);
      const errorMessage = axios.isAxiosError(error)
          ? error.response?.data?.error || 'Failed to delete transaction'
          : 'Failed to delete transaction';

      const errorMsg: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: `❌ ${errorMessage}`
      };
      setMessages(prev => [...prev, errorMsg]);
    }
  };

  const handleAddTransaction = () => {
    setEditingTransaction(null);
    setIsNewTransaction(true);
    setShowTransactionModal(true);
  };

  const handleTransactionSave = (savedTransaction: Transaction) => {
    if (transactionData) {
      let updatedTransactions: Transaction[];

      if (isNewTransaction) {
        // Add new transaction to the list
        updatedTransactions = [savedTransaction, ...transactionData.transactions];
      } else {
        // Update existing transaction in the list
        updatedTransactions = transactionData.transactions.map((t: Transaction) =>
            t.id === savedTransaction.id ? savedTransaction : t
        );
      }

      // Recalculate summary
      const totalIncome = updatedTransactions.filter(t => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
      const totalExpenses = updatedTransactions.filter(t => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0);

      setTransactionData({
        ...transactionData,
        transactions: updatedTransactions,
        summary: {
          ...transactionData.summary,
          count: updatedTransactions.length,
          total_income: totalIncome,
          total_expenses: totalExpenses,
          net_change: totalIncome - totalExpenses
        }
      });
    }

    // Add a success message
    const successMessage: Message = {
      id: uuidv4(),
      role: 'assistant',
      content: `✅ Transaction ${isNewTransaction ? 'added' : 'updated'} successfully!`
    };
    setMessages(prev => [...prev, successMessage]);

    setShowTransactionModal(false);
    setEditingTransaction(null);
    setIsNewTransaction(false);
  };

  const sendMessage = async (content: string) => {
    const newMessage: Message = { id: uuidv4(), role: 'user', content };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setLoading(true);
    setError(null);

    console.log('🚀 [Frontend] Sending message:', content);

    try {
      const token = await getToken();
      const res = await axios.post<ApiResponse>(`${process.env.NEXT_PUBLIC_API_URL}/fin/conversations/query`, {
        user_id: 'me',
        query: content,
        conversation_history: updatedMessages.map(({ role, content }) => ({ role, content })),
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📥 [Frontend] Full API Response:', res.data);
      console.log('📥 [Frontend] Response keys:', Object.keys(res.data));
      console.log('📥 [Frontend] Actions:', res.data.actions);
      console.log('📥 [Frontend] Actions length:', res.data.actions?.length || 0);
      console.log('📥 [Frontend] Actions type:', typeof res.data.actions);
      console.log('📥 [Frontend] Is actions array?:', Array.isArray(res.data.actions));

      const reply: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: res.data.message || 'Something went wrong, no reply received.',
      };

      setMessages([...updatedMessages, reply]);

      // Check if the response includes actions
      if (res.data.actions && Array.isArray(res.data.actions) && res.data.actions.length > 0) {
        console.log('🎯 [Frontend] Processing', res.data.actions.length, 'actions');

        res.data.actions.forEach((action: FinAction, index: number) => {
          console.log(`🎯 [Frontend] Action ${index}:`, {
            type: action.type,
            hasData: !!action.data,
            action: action.action,
            dataKeys: action.data ? Object.keys(action.data) : [],
            fullAction: action
          });

          if (action.action === 'initiate_plaid_connection' || action.type === 'initiate_plaid_connection') {
            console.log('🔗 [Frontend] Showing Plaid link');
            setShowPlaidLink(true);
          } else if (action.type === 'show_accounts' && action.data) {
            console.log('🏦 [Frontend] Setting account data');
            const accountsData = action.data as { accounts: Account[] };
            console.log('🏦 [Frontend] Account data structure:', accountsData);
            console.log('🏦 [Frontend] Accounts array:', accountsData.accounts);
            console.log('🏦 [Frontend] Account count:', accountsData.accounts?.length);

            if (accountsData.accounts) {
              setAccountData(accountsData.accounts);
              console.log('✅ [Frontend] Account data set successfully');
            } else {
              console.log('❌ [Frontend] No accounts array in data');
            }
          } else if (action.type === 'show_transactions' && action.data) {
            console.log('💰 [Frontend] Setting transaction data');
            const transData = action.data as TransactionData;
            console.log('💰 [Frontend] Transaction data structure:', transData);
            console.log('💰 [Frontend] Transactions array:', transData.transactions);
            console.log('💰 [Frontend] Transaction count:', transData.transactions?.length);
            console.log('💰 [Frontend] Summary:', transData.summary);

            if (transData.transactions) {
              setTransactionData(transData);
              console.log('✅ [Frontend] Transaction data set successfully');
            } else {
              console.log('❌ [Frontend] No transactions array in data');
            }
          } else if (action.type === 'transaction_created' || action.type === 'transaction_updated') {
            console.log('📝 [Frontend] Transaction action completed:', action.type);
          } else if (action.type === 'transaction_error' && action.error) {
            console.log('❌ [Frontend] Transaction error:', action.error);
            const errorMessage: Message = {
              id: uuidv4(),
              role: 'assistant',
              content: `❌ ${action.error}`
            };
            setMessages(prev => [...prev, errorMessage]);
          } else if (action.type === 'setup_stripe_connect') {
            console.log('💳 [Frontend] Showing Stripe Connect setup');
            setStripeConnectStatus(action.data);
            setShowStripeConnectSetup(true);
          } else if (action.type === 'show_stripe_connect_status') {
            console.log('💳 [Frontend] Setting Stripe Connect status');
            setStripeConnectStatus(action.data);
          } else if (action.type === 'open_stripe_dashboard') {
            console.log('💳 [Frontend] Opening Stripe dashboard');
            // Add type safety for dashboard_url
            const dashboardData = action.data as { dashboard_url?: string };
            if (dashboardData?.dashboard_url) {
              window.open(dashboardData.dashboard_url, '_blank');
            }
          } else if (action.type === 'stripe_connect_already_setup') {
            console.log('💳 [Frontend] Stripe Connect already set up');
            setStripeConnectStatus(action.data);

            const notificationMessage: Message = {
              id: uuidv4(),
              role: 'assistant',
              content: action.message || 'Your Stripe Connect account is already set up!'
            };
            setMessages(prev => [...prev, notificationMessage]);
          } else if (action.type === 'show_invoices' && action.data) {
            console.log('📄 [Frontend] Setting invoice data');
            const invoicesData = action.data as { invoices: Invoice[] };
            if (invoicesData.invoices) {
              setInvoiceData(invoicesData.invoices);
              console.log('✅ [Frontend] Invoice data set successfully');
            }
          } else if (action.type === 'invoice_created' || action.type === 'invoice_marked_paid') {
            console.log('📄 [Frontend] Invoice action completed:', action.type);
            if (action.message) {
              const notificationMessage: Message = {
                id: uuidv4(),
                role: 'assistant',
                content: `✅ ${action.message}`
              };
              setMessages(prev => [...prev, notificationMessage]);
            }
          } else {
            console.log('❓ [Frontend] Unhandled action type:', action.type);
          }
        });
      } else {
        console.log('⚠️ [Frontend] No actions in response or actions is not an array');
        console.log('⚠️ [Frontend] Actions value:', res.data.actions);
        console.log('⚠️ [Frontend] Actions type:', typeof res.data.actions);
        console.log('⚠️ [Frontend] Full response for debugging:', JSON.stringify(res.data, null, 2));
      }

    } catch (err: unknown) {
      console.error('❌ [Frontend] Error in sendMessage:', err);
      if (axios.isAxiosError(err)) {
        console.error('❌ [Frontend] Response status:', err.response?.status);
        console.error('❌ [Frontend] Response data:', err.response?.data);
        console.error('❌ [Frontend] Response headers:', err.response?.headers);
      }
      setError('Failed to fetch response. Please try again.');

      // Add an error message to chat
      const errorMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: 'I apologize, but I encountered an error processing your request. Please try again.'
      };
      setMessages([...updatedMessages, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, showPlaidLink, accountData, transactionData]);

  useEffect(() => {
    console.log('🔄 [Frontend] Account data changed:', accountData.length, 'accounts');
  }, [accountData]);

  useEffect(() => {
    console.log('🔄 [Frontend] Transaction data changed:', transactionData?.transactions?.length || 0, 'transactions');
  }, [transactionData]);

  useEffect(() => {
    console.log('🔄 [Frontend] Plaid link visibility changed:', showPlaidLink);
  }, [showPlaidLink]);

  if (!isSignedIn) return <div>Loading...</div>;

  return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-64">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {conversation ? 'Start the conversation' : 'Welcome to Cashly AI'}
                  </h3>
                  <p className="text-gray-500 text-center max-w-md">
                    {conversation ?
                        'No messages in this conversation yet. Ask me anything about your finances!' :
                        'Ask me anything about your finances to get started. I can help with budgets, forecasts, insights, and more.'
                    }
                  </p>
                </div>
            )}

            {/* Messages */}
            <div className="space-y-1">
              {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
              ))}
            </div>

            {/* Plaid Link Component */}
            {showPlaidLink && (
                <PlaidChatLink
                    onSuccess={handlePlaidSuccess}
                    onError={handlePlaidError}
                    onExit={handlePlaidExit}
                />
            )}

            {/* Account Display */}
            {accountData.length > 0 && (
                <AccountDisplay
                    accounts={accountData}
                    onDisconnect={handleAccountDisconnect}
                />
            )}

            {/* Transaction Display */}
            {transactionData && (
                <TransactionDisplay
                    transactions={transactionData.transactions}
                    summary={transactionData.summary}
                    onEditTransaction={handleTransactionEdit}
                    onDeleteTransaction={handleTransactionDelete}
                    onAddTransaction={handleAddTransaction}
                />
            )}

            {showStripeConnectSetup && (
                <StripeConnectSetup
                    onSuccess={handleStripeConnectSuccess}
                    onError={handleStripeConnectError}
                    currentStatus={stripeConnectStatus}
                />
            )}


            {invoiceData.length > 0 && (
                <InvoiceDisplay
                    invoices={invoiceData}
                    onEdit={handleInvoiceEdit}
                    onSendReminder={handleSendReminder}
                    onMarkPaid={handleMarkPaid}
                    onCreateNew={handleCreateInvoice}
                />
            )}

            {/* Stripe Connect Status Display */}
            {stripeConnectStatus && !showStripeConnectSetup && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 my-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-medium text-gray-900">Stripe Connect Status</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        stripeConnectStatus.can_accept_payments
                            ? 'bg-green-100 text-green-800'
                            : stripeConnectStatus.connected
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-gray-100 text-gray-800'
                    }`}>
        {stripeConnectStatus.can_accept_payments
            ? 'Active'
            : stripeConnectStatus.connected
                ? 'Setup Required'
                : 'Not Connected'
        }
      </span>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Charges Enabled:</span>
                      <span className={stripeConnectStatus.charges_enabled ? 'text-green-600' : 'text-red-600'}>
          {stripeConnectStatus.charges_enabled ? '✓' : '✗'}
        </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Payouts Enabled:</span>
                      <span className={stripeConnectStatus.payouts_enabled ? 'text-green-600' : 'text-red-600'}>
          {stripeConnectStatus.payouts_enabled ? '✓' : '✗'}
        </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Platform Fee:</span>
                      <span>{stripeConnectStatus.platform_fee_percentage || 2.9}%</span>
                    </div>
                  </div>

                  {stripeConnectStatus.can_accept_payments && (
                      <div className="mt-4">
                        <button
                            onClick={() => sendMessage('Open my Stripe dashboard')}
                            className="bg-purple-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-purple-700"
                        >
                          Open Dashboard
                        </button>
                      </div>
                  )}
                </div>
            )}

            {/* Loading indicator */}
            {loading && (
                <div className="flex justify-start mb-6">
                  <div className="flex items-center space-x-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm text-gray-500">Cashly is thinking...</span>
                  </div>
                </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        <div className="flex-shrink-0">
          {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 mx-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
          )}
          <MessageInput onSend={sendMessage} disabled={loading} />
        </div>

        {/* Transaction Edit Modal */}
        <TransactionEditModal
            transaction={editingTransaction}
            isOpen={showTransactionModal}
            onClose={() => {
              setShowTransactionModal(false);
              setEditingTransaction(null);
              setIsNewTransaction(false);
            }}
            onSave={handleTransactionSave}
            onDelete={handleTransactionDelete}
            accounts={accountData}
            isNewTransaction={isNewTransaction}
        />
      </div>
  );
}
