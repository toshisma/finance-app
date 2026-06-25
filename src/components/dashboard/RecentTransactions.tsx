'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowUpRight, ArrowDownLeft, MoreHorizontal } from 'lucide-react';
import { cn, formatCurrency, getRelativeTime, getCategoryColor } from '@/lib/utils';
import { TransactionWithAccount } from '@/lib/types';

interface RecentTransactionsProps {
  transactions: TransactionWithAccount[];
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <div className="space-y-3">
      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 rounded-full bg-[#1f1f2e] mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-[#52525b]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-[#52525b] text-sm">Aucune transaction récente</p>
        </div>
      ) : (
        transactions.slice(0, 6).map((transaction) => {
          const isIncome = transaction.type === 'income';
          const categoryColor = getCategoryColor(transaction.category);

          return (
            <div 
              key={transaction.id}
              className="flex items-center gap-4 p-3 rounded-xl bg-[#0a0a0f] hover:bg-[#111118] transition-colors"
            >
              <div className={cn(
                'w-10 h-10 rounded-xl flex items-center justify-center',
                isIncome ? 'bg-[#10b981]/20' : 'bg-[#ef4444]/20'
              )}>
                {isIncome ? (
                  <ArrowDownLeft className="w-5 h-5 text-[#10b981]" />
                ) : (
                  <ArrowUpRight className="w-5 h-5 text-[#ef4444]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {transaction.description || transaction.category}
                </p>
                <p className="text-xs text-[#52525b]">
                  {transaction.category} • {getRelativeTime(transaction.date)}
                </p>
              </div>
              <div className="text-right">
                <p className={cn(
                  'text-sm font-semibold',
                  isIncome ? 'text-[#10b981]' : 'text-white'
                )}>
                  {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
                {transaction.is_shared && (
                  <span className="text-[10px] text-[#8b5cf6]">Partagé</span>
                )}
              </div>
            </div>
          );
        })
      )}
      {transactions.length > 0 && (
        <Link 
          href="/transactions"
          className="block text-center py-3 text-sm font-medium text-[#8b5cf6] hover:text-[#a78bfa] transition-colors"
        >
          Voir toutes les transactions →
        </Link>
      )}
    </div>
  );
}
