'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { Budget, BudgetWithSpending, Transaction } from '@/lib/types';

export function useBudgets() {
  const [budgets, setBudgets] = useState<BudgetWithSpending[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const fetchBudgets = useCallback(async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const [budgetsData, transactionsData] = await Promise.all([
        supabase
          .from('budgets')
          .select('*')
          .or(`user_id.eq.${user.id},is_shared.eq.true`),
        supabase
          .from('transactions')
          .select('*')
          .or(`user_id.eq.${user.id},is_shared.eq.true`)
      ]);

      if (budgetsData.error) throw budgetsData.error;
      if (transactionsData.error) throw transactionsData.error;

      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      
      const monthlyExpenses = (transactionsData.data || []).filter(t => {
        const tDate = new Date(t.date);
        return t.type === 'expense' && tDate >= firstDayOfMonth;
      });

      setTransactions(monthlyExpenses);

      const budgetsWithSpending: BudgetWithSpending[] = (budgetsData.data || []).map(budget => {
        const spent = monthlyExpenses
          .filter(t => t.category === budget.category)
          .reduce((sum, t) => sum + t.amount, 0);
        
        return {
          ...budget,
          spent,
          remaining: Math.max(0, budget.amount_limit - spent),
          percentage: budget.amount_limit > 0 
            ? Math.min(100, Math.round((spent / budget.amount_limit) * 100)) 
            : 0
        };
      });

      setBudgets(budgetsWithSpending);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBudgets();

    const channel = supabase
      .channel('budgets_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'budgets' }, () => {
        fetchBudgets();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchBudgets();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBudgets]);

  const addBudget = async (budget: Partial<Budget>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non connecté');

      const { data, error } = await supabase
        .from('budgets')
        .insert([{ ...budget, user_id: user.id }])
        .select()
        .single();

      if (error) throw error;
      await fetchBudgets();
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de l\'ajout');
      throw err;
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      await fetchBudgets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la mise à jour');
      throw err;
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', id);

      if (error) throw error;
      await fetchBudgets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la suppression');
      throw err;
    }
  };

  return { budgets, loading, error, addBudget, updateBudget, deleteBudget, refetch: fetchBudgets };
}
