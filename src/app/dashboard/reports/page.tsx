'use client';

import * as React from 'react';
import { BarChart3, TrendingUp, Calendar, Download } from 'lucide-react';
import { SpendingChart } from '@/components/dashboard/SpendingChart';
import { useTransactions } from '@/hooks/useTransactions';
import { useBudgets } from '@/hooks/useBudgets';
import { formatCurrency, getCategoryColor, formatDate } from '@/lib/utils';

export default function ReportsPage() {
  const { transactions } = useTransactions();
  const { budgets } = useBudgets();

  const now = new Date();
  const currentMonth = now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  // Calculate monthly stats
  const monthlyStats = React.useMemo(() => {
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthlyTransactions = transactions.filter(t => new Date(t.date) >= firstDayOfMonth);

    const income = monthlyTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = monthlyTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

    const categoryTotals: Record<string, number> = {};
    monthlyTransactions.filter(t => t.type === 'expense').forEach(t => {
      categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
    });

    const topCategories = Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value, color: getCategoryColor(name) }))
      .sort((a, b) => b.value - a.value);

    return { income, expenses, balance: income - expenses, topCategories };
  }, [transactions, now]);

  // Weekly data for bar chart
  const weeklyData = React.useMemo(() => {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay() + 1);
    
    return days.map((day, index) => {
      const date = new Date(startOfWeek);
      date.setDate(date.getDate() + index);
      const dayExpenses = transactions
        .filter(t => new Date(t.date).toDateString() === date.toDateString() && t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      return { name: day, value: dayExpenses };
    });
  }, [transactions, now]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Rapports</h1>
          <p className="text-[#a1a1aa]">
            Analyse détaillée de vos finances - {currentMonth}
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#111118] border border-[#1f1f2e] text-sm font-medium text-white hover:border-[#2a2a3d] transition-all">
          <Download className="w-4 h-4" />
          Exporter PDF
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#10b981]/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#10b981]" />
            </div>
            <span className="text-sm text-[#a1a1aa]">Revenus</span>
          </div>
          <p className="text-2xl font-bold text-[#10b981]">{formatCurrency(monthlyStats.income)}</p>
        </div>

        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#ef4444]/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-[#ef4444]" />
            </div>
            <span className="text-sm text-[#a1a1aa]">Dépenses</span>
          </div>
          <p className="text-2xl font-bold text-[#ef4444]">{formatCurrency(monthlyStats.expenses)}</p>
        </div>

        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#8b5cf6]/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[#8b5cf6]" />
            </div>
            <span className="text-sm text-[#a1a1aa]">Épargne</span>
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(monthlyStats.balance)}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending by category */}
        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Dépenses par catégorie</h2>
          {monthlyStats.topCategories.length > 0 ? (
            <SpendingChart data={monthlyStats.topCategories} type="pie" />
          ) : (
            <div className="h-64 flex items-center justify-center text-[#52525b]">
              Aucune donnée disponible
            </div>
          )}
        </div>

        {/* Weekly spending */}
        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Dépenses de la semaine</h2>
          <SpendingChart data={weeklyData} type="bar" />
        </div>
      </div>

      {/* Top expenses table */}
      <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-6">Top 5 dépenses du mois</h2>
        <div className="space-y-3">
          {monthlyStats.topCategories.slice(0, 5).map((category, index) => (
            <div key={category.name} className="flex items-center gap-4 p-3 rounded-xl bg-[#0a0a0f]">
              <span className="w-8 h-8 rounded-full bg-[#1f1f2e] flex items-center justify-center text-sm font-bold text-white">
                {index + 1}
              </span>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="flex-1 font-medium text-white">{category.name}</span>
              <span className="text-[#ef4444] font-semibold">{formatCurrency(category.value)}</span>
            </div>
          ))}
          {monthlyStats.topCategories.length === 0 && (
            <div className="text-center py-8 text-[#52525b]">
              Aucune dépense enregistrée ce mois
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
