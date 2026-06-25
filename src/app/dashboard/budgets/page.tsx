'use client';

import * as React from 'react';
import { Plus } from 'lucide-react';
import { BudgetCard } from '@/components/budgets/BudgetCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useBudgets } from '@/hooks/useBudgets';
import { CATEGORIES, BudgetWithSpending } from '@/lib/types';

export default function BudgetsPage() {
  const { budgets, loading, addBudget, updateBudget, deleteBudget } = useBudgets();
  const [showModal, setShowModal] = React.useState(false);
  const [editingBudget, setEditingBudget] = React.useState<BudgetWithSpending | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    category: '',
    amount_limit: '',
    period: 'monthly' as const,
    is_shared: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        amount_limit: parseFloat(formData.amount_limit),
      };
      
      if (editingBudget) {
        await updateBudget(editingBudget.id, data);
      } else {
        await addBudget(data);
      }
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (budget: BudgetWithSpending) => {
    setEditingBudget(budget);
    setFormData({
      category: budget.category,
      amount_limit: budget.amount_limit.toString(),
      period: budget.period,
      is_shared: budget.is_shared,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce budget ?')) {
      await deleteBudget(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingBudget(null);
    setFormData({ category: '', amount_limit: '', period: 'monthly', is_shared: false });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Budgets</h1>
          <p className="text-[#a1a1aa]">
            Définissez et suivez vos budgets mensuels par catégorie.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Nouveau budget
        </Button>
      </div>

      {/* Budget cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-[#111118] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : budgets.length === 0 ? (
        <div className="text-center py-16 bg-[#111118] border border-[#1f1f2e] rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-[#1f1f2e] mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#52525b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Aucun budget défini</h3>
          <p className="text-[#52525b] mb-6">Créez votre premier budget pour commencer à suivre vos dépenses</p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Créer un budget
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {budgets.map((budget) => (
            <BudgetCard
              key={budget.id}
              budget={budget}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingBudget ? 'Modifier le budget' : 'Nouveau budget'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Catégorie</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-[#0a0a0f] border border-[#1f1f2e] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
              required
            >
              <option value="">Sélectionner une catégorie</option>
              {CATEGORIES.expense.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <Input
            type="number"
            label="Limite mensuelle (€)"
            value={formData.amount_limit}
            onChange={(e) => setFormData({ ...formData, amount_limit: e.target.value })}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.is_shared}
                onChange={(e) => setFormData({ ...formData, is_shared: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1f1f2e] rounded-full peer peer-checked:bg-[#8b5cf6] transition-colors" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
            </div>
            <span className="text-sm font-medium text-white">Budget partagé avec le couple</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={handleCloseModal} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : editingBudget ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
