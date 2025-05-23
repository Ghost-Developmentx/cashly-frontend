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

      const reply: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: res.data.message || 'Something went wrong, no reply received.',
      };

      setMessages([...updatedMessages, reply]);

      // Check if the response includes account actions or transaction actions
      if (res.data.actions) {
        res.data.actions.forEach((action: FinAction) => {
          if (action.action === 'initiate_plaid_connection' || action.type === 'initiate_plaid_connection') {
            setShowPlaidLink(true);
          } else if (action.type === 'show_accounts' && action.data) {
            const accountsData = action.data as { accounts: Account[] };
            if (accountsData.accounts) {
              setAccountData(accountsData.accounts);
            }
          } else if (action.type === 'show_transactions' && action.data) {
            const transData = action.data as TransactionData;
            if (transData.transactions) {
              setTransactionData(transData);
            }
          } else if (action.type === 'transaction_created' || action.type === 'transaction_updated') {
            // If we're currently showing transactions, we might want to refresh them
            // For now, we'll rely on the user to ask again or the success message
            console.log('Transaction action completed:', action.type);
          } else if (action.type === 'transaction_error' && action.error) {
            // Show an error message for transaction operations
            const errorMessage: Message = {
              id: uuidv4(),
              role: 'assistant',
              content: `❌ ${action.error}`
            };
            setMessages(prev => [...prev, errorMessage]);
          }
        });
      }

    } catch (err: unknown) {
      console.error(err);
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
