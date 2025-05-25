import { useState } from 'react';
import { Transaction } from '@/types/financial';

export function useTransactionModal() {
    const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
    const [showTransactionModal, setShowTransactionModal] = useState(false);
    const [isNewTransaction, setIsNewTransaction] = useState(false);

    const openEditModal = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsNewTransaction(false);
        setShowTransactionModal(true);
    };

    const openNewModal = () => {
        setEditingTransaction(null);
        setIsNewTransaction(true);
        setShowTransactionModal(true);
    };

    const closeModal = () => {
        setShowTransactionModal(false);
        setEditingTransaction(null);
        setIsNewTransaction(false);
    };

    return {
        editingTransaction,
        showTransactionModal,
        isNewTransaction,
        openEditModal,
        openNewModal,
        closeModal,
    };
}