'use client';

import * as React from 'react';
import { Progress } from '@radix-ui/react-progress';
import { cn, formatCurrency, getCategoryColor } from '@/lib/utils';
import { BudgetWithSpending } from '@/lib/types';

interface BudgetOverviewProps {
  budgets: BudgetWithSpending[];
}

export function BudgetOverview({ budgets }: BudgetOverviewProps) {
  const totalBudget = budgets.reduce((sum, b) => sum + b.amount_limit, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);
  const overallPercentage = totalBudget > 0 ? Math.min(100, Math.round((totalSpent / totalBudget) * 100)) : 0;

  return (
    <div className="space-y-4">
      {/* Overall progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-[#a1a1aa]">Budget total utilisé</span>
          <span className="text-sm font-medium text-white">{overallPercentage}%</span>
        </div>
        <div className="h-3 bg-[#1f1f2e] rounded-full overflow-hidden">
          <div 
            className={cn(
              'h-full rounded-full transition-all duration-500',
              overallPercentage > 90 ? 'bg-[#ef4444]' :
              overallPercentage > 75 ? 'bg-[#f59e0b]' :
              'bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed]'
            )}
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-[#52525b]">
          <span>{formatCurrency(totalSpent)} dépensé</span>
          <span>{formatCurrency(totalBudget - totalSpent)} restant</span>
        </div>
      </div>

      {/* Category breakdown */}
      <div className="space-y-3">
        {budgets.slice(0, 5).map((budget) => {
          const isOverBudget = budget.percentage >= 100;
          const isWarning = budget.percentage >= 75 && budget.percentage < 100;
          const color = getCategoryColor(budget.category);

          return (
            <div key={budget.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm font-medium text-white">{budget.category}</span>
                </div>
                <div className="text-right">
                  <span className={cn(
                    'text-sm font-medium',
                    isOverBudget ? 'text-[#ef4444]' : 'text-[#a1a1aa]'
                  )}>
                    {formatCurrency(budget.spent)}
                  </span>
                  <span className="text-xs text-[#52525b]"> / {formatCurrency(budget.amount_limit)}</span>
                </div>
              </div>
              <div className="h-2 bg-[#1f1f2e] rounded-full overflow-hidden">
                <div 
                  className={cn(
                    'h-full rounded-full transition-all duration-500',
                    isOverBudget ? 'bg-[#ef4444]' :
                    isWarning ? 'bg-[#f59e0b]' :
                    'bg-[#8b5cf6]'
                  )}
                  style={{ width: `${Math.min(100, budget.percentage)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
