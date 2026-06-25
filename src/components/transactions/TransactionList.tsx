'use client';

import * as React from 'react';
import { ArrowUpRight, ArrowDownLeft, Pencil, Trash2, Filter, Search } from 'lucide-react';
import { cn, formatCurrency, formatDate, getCategoryColor } from '@/lib/utils';
import { TransactionWithAccount, CATEGORIES } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface TransactionListProps {
  transactions: TransactionWithAccount[];
  onEdit: (transaction: TransactionWithAccount) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function TransactionList({ transactions, onEdit, onDelete, isLoading }: TransactionListProps) {
  const [filter, setFilter] = React.useState<'all' | 'income' | 'expense'>('all');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [categoryFilter, setCategoryFilter] = React.useState('');

  const filteredTransactions = transactions.filter(t => {
    if (filter !== 'all' && t.type !== filter) return false;
    if (categoryFilter && t.category !== categoryFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        t.description?.toLowerCase().includes(term) ||
        t.category.toLowerCase().includes(term)
      );
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 bg-[#111118] rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#111118] border border-[#1f1f2e] rounded-xl text-sm text-white placeholder-[#52525b] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2.5 bg-[#111118] border border-[#1f1f2e] rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
        >
          <option value="">Toutes catégories</option>
          {[...CATEGORIES.expense, ...CATEGORIES.income].map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div className="flex gap-1 p-1 bg-[#111118] border border-[#1f1f2e] rounded-xl">
          {(['all', 'expense', 'income'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all',
                filter === f ? 'bg-[#8b5cf6] text-white' : 'text-[#a1a1aa] hover:text-white'
              )}
            >
              {f === 'all' ? 'Tout' : f === 'income' ? 'Revenus' : 'Dépenses'}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 rounded-xl bg-[#111118] border border-[#1f1f2e]">
            <Filter className="w-12 h-12 mx-auto mb-4 text-[#52525b]" />
            <p className="text-[#52525b]">Aucune transaction trouvée</p>
          </div>
        ) : (
          filteredTransactions.map((transaction) => {
            const isIncome = transaction.type === 'income';
            const categoryColor = getCategoryColor(transaction.category);

            return (
              <div 
                key={transaction.id}
                className="group flex items-center gap-4 p-4 rounded-xl bg-[#111118] border border-[#1f1f2e] hover:border-[#2a2a3d] transition-all"
              >
                <div className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                  isIncome ? 'bg-[#10b981]/20' : 'bg-[#ef4444]/20'
                )}>
                  {isIncome ? (
                    <ArrowDownLeft className="w-6 h-6 text-[#10b981]" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6 text-[#ef4444]" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white truncate">
                    {transaction.description || transaction.category}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-[#52525b]">
                    <span 
                      className="px-2 py-0.5 rounded-full text-xs font-medium"
                      style={{ backgroundColor: `${categoryColor}20`, color: categoryColor }}
                    >
                      {transaction.category}
                    </span>
                    <span>•</span>
                    <span>{formatDate(transaction.date)}</span>
                    {transaction.is_shared && (
                      <>
                        <span>•</span>
                        <span className="text-[#8b5cf6]">Partagé</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className={cn(
                    'text-lg font-bold',
                    isIncome ? 'text-[#10b981]' : 'text-white'
                  )}>
                    {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onEdit(transaction)}
                    className="p-2 rounded-lg text-[#a1a1aa] hover:text-white hover:bg-[#1f1f2e] transition-all"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDelete(transaction.id)}
                    className="p-2 rounded-lg text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
