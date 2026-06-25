'use client';

import * as React from 'react';
import { Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { cn, formatCurrency, getCategoryColor } from '@/lib/utils';
import { BudgetWithSpending } from '@/lib/types';

interface BudgetCardProps {
  budget: BudgetWithSpending;
  onEdit: (budget: BudgetWithSpending) => void;
  onDelete: (id: string) => void;
}

export function BudgetCard({ budget, onEdit, onDelete }: BudgetCardProps) {
  const isOverBudget = budget.percentage >= 100;
  const isWarning = budget.percentage >= 75 && budget.percentage < 100;
  const categoryColor = getCategoryColor(budget.category);

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl bg-[#111118] border p-5 transition-all duration-200 hover:border-[#2a2a3d]',
      isOverBudget ? 'border-[#ef4444]/30' : 'border-[#1f1f2e]'
    )}>
      {/* Alert indicator */}
      {isOverBudget && (
        <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#ef4444]/20 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-[#ef4444]" />
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${categoryColor}20` }}
          >
            <span 
              className="text-lg font-bold"
              style={{ color: categoryColor }}
            >
              {budget.category.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-white">{budget.category}</h3>
            <p className="text-sm text-[#52525b] capitalize">{budget.period}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(budget)}
            className="p-2 rounded-lg text-[#52525b] hover:text-white hover:bg-[#1f1f2e] transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(budget.id)}
            className="p-2 rounded-lg text-[#52525b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Amounts */}
      <div className="mb-4">
        <div className="flex items-baseline justify-between mb-1">
          <span className={cn(
            'text-2xl font-bold',
            isOverBudget ? 'text-[#ef4444]' : 'text-white'
          )}>
            {formatCurrency(budget.spent)}
          </span>
          <span className="text-sm text-[#52525b]">
            sur {formatCurrency(budget.amount_limit)}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="mb-3">
        <div className="h-3 bg-[#1f1f2e] rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full rounded-full transition-all duration-500',
              isOverBudget ? 'bg-[#ef4444]' :
              isWarning ? 'bg-[#f59e0b]' :
              'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed]'
            )}
            style={{ width: `${Math.min(100, budget.percentage)}%` }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-[#a1a1aa]">
          {budget.percentage}%
        </span>
        <span className={cn(
          'text-sm font-medium',
          isOverBudget ? 'text-[#ef4444]' : 'text-[#10b981]'
        )}>
          {isOverBudget 
            ? `Dépassé de ${formatCurrency(budget.spent - budget.amount_limit)}`
            : `${formatCurrency(budget.remaining)} restant`
          }
        </span>
      </div>

      {/* Shared indicator */}
      {budget.is_shared && (
        <div className="mt-3 pt-3 border-t border-[#1f1f2e]">
          <span className="text-xs text-[#8b5cf6]">Partagé avec Annelyse</span>
        </div>
      )}
    </div>
  );
}
