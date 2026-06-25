'use client';

import * as React from 'react';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { CATEGORIES } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';

interface TransactionFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
  isLoading?: boolean;
}

export function TransactionForm({ onSubmit, onCancel, initialData, isLoading }: TransactionFormProps) {
  const [formData, setFormData] = React.useState({
    type: initialData?.type || 'expense',
    amount: initialData?.amount?.toString() || '',
    category: initialData?.category || '',
    description: initialData?.description || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    is_shared: initialData?.is_shared || false,
    is_recurring: initialData?.is_recurring || false,
    recurrence_interval: initialData?.recurrence_interval || 'monthly',
    account_id: initialData?.account_id || '',
  });

  const categories = formData.type === 'income' ? CATEGORIES.income : CATEGORIES.expense;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Type selector */}
      <div className="flex gap-2 p-1 bg-[#0a0a0f] rounded-xl">
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            formData.type === 'expense'
              ? 'bg-[#ef4444] text-white shadow-lg'
              : 'text-[#a1a1aa] hover:text-white'
          }`}
        >
          Dépense
        </button>
        <button
          type="button"
          onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
            formData.type === 'income'
              ? 'bg-[#10b981] text-white shadow-lg'
              : 'text-[#a1a1aa] hover:text-white'
          }`}
        >
          Revenu
        </button>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Montant</label>
        <div className="relative">
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            className="w-full pl-6 pr-20 py-3 bg-[#0a0a0f] border border-[#1f1f2e] rounded-xl text-2xl font-bold text-white placeholder-[#52525b] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all"
            placeholder="0.00"
            required
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-[#52525b]">EUR</span>
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Catégorie</label>
        <select
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          className="w-full px-4 py-2.5 bg-[#0a0a0f] border border-[#1f1f2e] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all"
          required
        >
          <option value="">Sélectionner une catégorie</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Description optionnelle..."
        rows={2}
      />

      {/* Date */}
      <Input
        type="date"
        label="Date"
        value={formData.date}
        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
        required
      />

      {/* Shared toggle */}
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
        <span className="text-sm font-medium text-white">Transaction partagée avec le couple</span>
      </label>

      {/* Recurring toggle */}
      <label className="flex items-center gap-3 cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            checked={formData.is_recurring}
            onChange={(e) => setFormData({ ...formData, is_recurring: e.target.checked })}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-[#1f1f2e] rounded-full peer peer-checked:bg-[#8b5cf6] transition-colors" />
          <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
        </div>
        <span className="text-sm font-medium text-white">Transaction récurrente</span>
      </label>

      {formData.is_recurring && (
        <div>
          <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Fréquence</label>
          <select
            value={formData.recurrence_interval}
            onChange={(e) => setFormData({ ...formData, recurrence_interval: e.target.value })}
            className="w-full px-4 py-2.5 bg-[#0a0a0f] border border-[#1f1f2e] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
          >
            <option value="daily">Quotidien</option>
            <option value="weekly">Hebdomadaire</option>
            <option value="monthly">Mensuel</option>
            <option value="yearly">Annuel</option>
          </select>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel} className="flex-1">
          Annuler
        </Button>
        <Button type="submit" variant={formData.type === 'income' ? 'success' : 'primary'} className="flex-1" disabled={isLoading}>
          {isLoading ? 'Enregistrement...' : initialData ? 'Modifier' : 'Ajouter'}
        </Button>
      </div>
    </form>
  );
}
