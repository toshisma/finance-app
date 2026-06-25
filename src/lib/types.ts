export type UserId = string;

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  partner_id?: string;
  created_at: string;
  updated_at: string;
}

export type AccountType = 'checking' | 'savings' | 'credit' | 'cash' | 'investment';

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  color: string;
  icon: string;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  user_id: string;
  account_id?: string;
  amount: number;
  type: TransactionType;
  category: string;
  subcategory?: string;
  description?: string;
  date: string;
  is_shared: boolean;
  is_recurring: boolean;
  recurrence_interval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  created_at: string;
  updated_at: string;
}

export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount_limit: number;
  period: BudgetPeriod;
  is_shared: boolean;
  created_at: string;
  updated_at: string;
}

export interface Goal {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  target_amount: number;
  current_amount: number;
  deadline?: string;
  is_shared: boolean;
  color: string;
  icon: string;
  created_at: string;
  updated_at: string;
}

export type NotificationType = 'info' | 'success' | 'warning' | 'danger';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message?: string;
  type: NotificationType;
  is_read: boolean;
  created_at: string;
}

export const CATEGORIES = {
  expense: [
    'Alimentation',
    'Logement',
    'Transport',
    'Loisirs',
    'Shopping',
    'Santé',
    'Éducation',
    'Assurances',
    'Services',
    'Autre'
  ],
  income: [
    'Salaire',
    'Freelance',
    'Investissements',
    'Cadeaux',
    'Remboursements',
    'Autre'
  ]
} as const;

export const ACCOUNT_ICONS = [
  'wallet',
  'credit-card',
  'piggy-bank',
  'banknote',
  'trending-up',
  'users'
] as const;

export const GOAL_ICONS = [
  'plane',
  'car',
  'home',
  'gift',
  'graduation-cap',
  'shield',
  'heart',
  'star'
] as const;

export const COLORS: string[] = [
  '#8b5cf6',
  '#3b82f6',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#ec4899',
  '#6366f1',
  '#14b8a6'
];

export interface DashboardStats {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  savingsRate: number;
  monthlyChange: number;
}

export interface TransactionWithAccount extends Transaction {
  account?: Account;
}

export interface BudgetWithSpending extends Budget {
  spent: number;
  remaining: number;
  percentage: number;
}

export interface GoalWithProgress extends Goal {
  progress: number;
  daysLeft?: number;
}
