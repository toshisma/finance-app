'use client';

import * as React from 'react';
import { Plus, Download, Upload } from 'lucide-react';
import { TransactionList } from '@/components/transactions/TransactionList';
import { TransactionForm } from '@/components/transactions/TransactionForm';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useTransactions } from '@/hooks/useTransactions';
import { TransactionWithAccount } from '@/lib/types';

export default function TransactionsPage() {
  const { transactions, loading, addTransaction, updateTransaction, deleteTransaction } = useTransactions();
  const [showAddModal, setShowAddModal] = React.useState(false);
  const [editingTransaction, setEditingTransaction] = React.useState<TransactionWithAccount | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, data);
      } else {
        await addTransaction(data);
      }
      setShowAddModal(false);
      setEditingTransaction(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (transaction: TransactionWithAccount) => {
    setEditingTransaction(transaction);
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette transaction ?')) {
      await deleteTransaction(id);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingTransaction(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-[#a1a1aa]">
            Gérez toutes vos transactions en un seul endroit.
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4" />
            Nouvelle transaction
          </Button>
        </div>
      </div>

      {/* Transaction list */}
      <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
        <TransactionList
          transactions={transactions}
          onEdit={handleEdit}
          onDelete={handleDelete}
          isLoading={loading}
        />
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={handleCloseModal}
        title={editingTransaction ? 'Modifier la transaction' : 'Nouvelle transaction'}
      >
        <TransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          initialData={editingTransaction}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
}
