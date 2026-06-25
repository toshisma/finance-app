'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowRight, Wallet, TrendingUp, TrendingDown, PiggyBank, Target } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { BudgetOverview } from '@/components/dashboard/BudgetOverview';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';
import { useAccounts } from '@/hooks/useAccounts';
import { useGoals } from '@/hooks/useGoals';
import { formatCurrency, getCategoryColor } from '@/lib/utils';

export default function DashboardPage() {
  const { transactions, getMonthlyStats } = useTransactions();
  const { budgets } = useBudgets();
  const { accounts, totalBalance } = useAccounts();
  const { goals } = useGoals();

  const stats = getMonthlyStats();
  const savingsRate = stats.income > 0 ? Math.round(((stats.income - stats.expenses) / stats.income) * 100) : 0;

  // Prepare chart data
  const categorySpending = React.useMemo(() => {
    const categories: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        categories[t.category] = (categories[t.category] || 0) + t.amount;
      });
    
    return Object.entries(categories)
      .map(([name, value]) => ({
        name,
        value,
        color: getCategoryColor(name)
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Tableau de bord</h1>
          <p className="text-[#a1a1aa]">
            Bienvenue ! Voici un aperçu de vos finances ce mois-ci.
          </p>
        </div>
        <Link
          href="/transactions"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#7c3aed] text-sm font-semibold text-white hover:from-[#7c3aed] hover:to-[#6d28d9] transition-all shadow-lg shadow-purple-500/25"
        >
          Nouvelle transaction
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Solde total"
          value={totalBalance}
          icon={<Wallet className="w-6 h-6" />}
          variant="default"
        />
        <StatCard
          title="Revenus du mois"
          value={stats.income}
          icon={<TrendingUp className="w-6 h-6" />}
          variant="success"
        />
        <StatCard
          title="Dépenses du mois"
          value={stats.expenses}
          icon={<TrendingDown className="w-6 h-6" />}
          variant="danger"
        />
        <StatCard
          title="Taux d'épargne"
          value={savingsRate}
          icon={<PiggyBank className="w-6 h-6" />}
          variant={savingsRate >= 20 ? 'success' : savingsRate >= 10 ? 'warning' : 'danger'}
          format="percentage"
        />
      </div>

      {/* Charts and details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Spending chart */}
        <div className="lg:col-span-2 bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Répartition des dépenses</h2>
            <Link href="/reports" className="text-sm text-[#8b5cf6] hover:text-[#a78bfa] transition-colors">
              Voir détails →
            </Link>
          </div>
          {categorySpending.length > 0 ? (
            <SpendingChart data={categorySpending} type="pie" />
          ) : (
            <div className="h-64 flex items-center justify-center text-[#52525b]">
              <p>Aucune donnée de dépense</p>
            </div>
          )}
        </div>

        {/* Budget overview */}
        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Budgets</h2>
            <Link href="/budgets" className="text-sm text-[#8b5cf6] hover:text-[#a78bfa] transition-colors">
              Gérer →
            </Link>
          </div>
          <BudgetOverview budgets={budgets} />
        </div>
      </div>

      {/* Recent transactions and Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent transactions */}
        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Transactions récentes</h2>
            <Link href="/transactions" className="text-sm text-[#8b5cf6] hover:text-[#a78bfa] transition-colors">
              Voir tout →
            </Link>
          </div>
          <RecentTransactions transactions={transactions} />
        </div>

        {/* Goals */}
        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Objectifs d'épargne</h2>
            <Link href="/goals" className="text-sm text-[#8b5cf6] hover:text-[#a78bfa] transition-colors">
              Voir tout →
            </Link>
          </div>
          <div className="space-y-4">
            {goals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 mx-auto mb-4 text-[#52525b]" />
                <p className="text-[#52525b]">Aucun objectif défini</p>
                <Link href="/goals" className="text-sm text-[#8b5cf6] hover:text-[#a78bfa]">
                  Créer un objectif →
                </Link>
              </div>
            ) : (
              goals.slice(0, 3).map((goal) => (
                <div key={goal.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#0a0a0f]">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${goal.color}20` }}
                  >
                    <Target className="w-5 h-5" style={{ color: goal.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{goal.title}</p>
                    <div className="mt-2 h-2 bg-[#1f1f2e] rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${goal.progress}%`,
                          backgroundColor: goal.color
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-white">{goal.progress}%</p>
                    <p className="text-xs text-[#52525b]">{formatCurrency(goal.current_amount)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
