import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date, locale: string = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date, locale: string = 'fr-FR'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function getRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffInMs = now.getTime() - target.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return "Aujourd'hui";
  if (diffInDays === 1) return "Hier";
  if (diffInDays < 7) return `Il y a ${diffInDays} jours`;
  if (diffInDays < 30) return `Il y a ${Math.floor(diffInDays / 7)} semaines`;
  return formatDateShort(date);
}

export function getPercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

export function getCategoryIcon(category: string): string {
  const icons: Record<string, string> = {
    'Alimentation': 'shopping-cart',
    'Logement': 'home',
    'Transport': 'car',
    'Loisirs': 'gamepad-2',
    'Shopping': 'shopping-bag',
    'Santé': 'heart-pulse',
    'Éducation': 'graduation-cap',
    'Assurances': 'shield',
    'Services': 'wrench',
    'Salaire': 'banknote',
    'Freelance': 'laptop',
    'Investissements': 'trending-up',
    'Cadeaux': 'gift',
    'Remboursements': 'refresh-ccw',
  };
  return icons[category] || 'circle';
}

export function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'Alimentation': '#10b981',
    'Logement': '#3b82f6',
    'Transport': '#f59e0b',
    'Loisirs': '#ec4899',
    'Shopping': '#8b5cf6',
    'Santé': '#ef4444',
    'Éducation': '#6366f1',
    'Assurances': '#14b8a6',
    'Services': '#64748b',
    'Salaire': '#10b981',
    'Freelance': '#22c55e',
    'Investissements': '#eab308',
    'Cadeaux': '#f472b6',
    'Remboursements': '#06b6d4',
  };
  return colors[category] || '#8b5cf6';
}

export function calculateDaysLeft(deadline: string): number {
  const now = new Date();
  const deadlineDate = new Date(deadline);
  const diffInMs = deadlineDate.getTime() - now.getTime();
  return Math.ceil(diffInMs / (1000 * 60 * 60 * 24));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
