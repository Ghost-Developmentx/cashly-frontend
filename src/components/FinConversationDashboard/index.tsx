'use client';
import { useRef, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import MessageInput from './MessageInput';
import TransactionEditModal from '../TransactionEditModal';
import { MessagesList } from './MessagesList';
import { FinDataDisplays } from './FinDataDisplays';
import { useFinConversation } from '@/hooks/useFinConversation';
import { useTransactionModal } from '@/hooks/useTransactionModal';
import { useFinEventHandlers } from '@/hooks/useFinEventHandlers';
import { Message } from '@/types/financial';

type Props = {
  conversation: {
    id: string;
    title: string;
    messages: Message[];
  } | null;
};

export default function FinConversationDashboard({ conversation }: Props) {
  const { isSignedIn } = useUser();
  const bottomRef = useRef<HTMLDivElement>(null);
  const { state, sendMessage, addMessage, setState } = useFinConversation(conversation);
  const transactionModal = useTransactionModal();

  const eventHandlers = useFinEventHandlers({
    state,
    setState,
    addMessage,
    sendMessage,
    transactionModal,
  });

  // Auto-scroll to the bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.messages, state.showPlaidLink, state.accountData, state.transactionData]);

  if (!isSignedIn) return <div>Loading...</div>;

  return (
      <div className="flex flex-col h-full bg-gray-50">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <MessagesList messages={state.messages} loading={state.loading} />

            <FinDataDisplays
                showPlaidLink={state.showPlaidLink}
                accountData={state.accountData}
                transactionData={state.transactionData}
                showStripeConnectSetup={state.showStripeConnectSetup}
                stripeConnectStatus={state.stripeConnectStatus}
                invoiceData={state.invoiceData}
                invoicePreview={state.invoicePreview}
                onPlaidSuccess={eventHandlers.handlePlaidSuccess}
                onPlaidError={eventHandlers.handlePlaidError}
                onPlaidExit={eventHandlers.handlePlaidExit}
                onAccountDisconnect={eventHandlers.handleAccountDisconnect}
                onTransactionEdit={transactionModal.openEditModal}
                onTransactionDelete={eventHandlers.handleTransactionDelete}
                onAddTransaction={transactionModal.openNewModal}
                onStripeConnectSuccess={eventHandlers.handleStripeConnectSuccess}
                onStripeConnectError={eventHandlers.handleStripeConnectError}
                onInvoiceEdit={eventHandlers.handleInvoiceEdit}
                onSendReminder={eventHandlers.handleSendReminder}
                onMarkPaid={eventHandlers.handleMarkPaid}
                onCreateInvoice={eventHandlers.handleCreateInvoice}
                onSendInvoice={eventHandlers.handleSendInvoice}
                sendMessage={sendMessage}
            />

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex-shrink-0">
          {state.error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4 mx-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{state.error}</p>
                  </div>
                </div>
              </div>
          )}
          <MessageInput onSend={sendMessage} disabled={state.loading} />
        </div>

        {/* Transaction Modal */}
        <TransactionEditModal
            transaction={transactionModal.editingTransaction}
            isOpen={transactionModal.showTransactionModal}
            onClose={transactionModal.closeModal}
            onSave={(transaction, isNew) => eventHandlers.handleTransactionSave(transaction, isNew)}
            onDelete={eventHandlers.handleTransactionDelete}
            accounts={state.accountData}
            isNewTransaction={transactionModal.isNewTransaction}
        />
      </div>
  );
}
