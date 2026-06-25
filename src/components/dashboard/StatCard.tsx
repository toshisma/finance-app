'use client';

import * as React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  changeLabel?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  format?: 'currency' | 'percentage' | 'number';
}

export function StatCard({ 
  title, 
  value, 
  change, 
  changeLabel = "par rapport au mois dernier",
  icon, 
  variant = 'default',
  format = 'currency'
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  const variantStyles = {
    default: 'from-[#8b5cf6]/20 to-[#8b5cf6]/5 border-[#8b5cf6]/20',
    success: 'from-[#10b981]/20 to-[#10b981]/5 border-[#10b981]/20',
    warning: 'from-[#f59e0b]/20 to-[#f59e0b]/5 border-[#f59e0b]/20',
    danger: 'from-[#ef4444]/20 to-[#ef4444]/5 border-[#ef4444]/20',
  };

  const iconColors = {
    default: 'bg-[#8b5cf6]/20 text-[#8b5cf6]',
    success: 'bg-[#10b981]/20 text-[#10b981]',
    warning: 'bg-[#f59e0b]/20 text-[#f59e0b]',
    danger: 'bg-[#ef4444]/20 text-[#ef4444]',
  };

  const formatValue = () => {
    if (format === 'currency') return formatCurrency(value);
    if (format === 'percentage') return `${value}%`;
    return value.toLocaleString('fr-FR');
  };

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 border',
      variantStyles[variant]
    )}>
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center',
            iconColors[variant]
          )}>
            {icon}
          </div>
          {change !== undefined && (
            <div className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium',
              isPositive && 'bg-[#10b981]/20 text-[#10b981]',
              isNegative && 'bg-[#ef4444]/20 text-[#ef4444]',
              !isPositive && !isNegative && 'bg-[#52525b]/20 text-[#a1a1aa]'
            )}>
              {isPositive && <TrendingUp className="w-3 h-3" />}
              {isNegative && <TrendingDown className="w-3 h-3" />}
              {!isPositive && !isNegative && <Minus className="w-3 h-3" />}
              <span>{change > 0 ? '+' : ''}{change}%</span>
            </div>
          )}
        </div>
        <p className="text-sm font-medium text-[#a1a1aa] mb-1">{title}</p>
        <p className="text-2xl font-bold text-white">{formatValue()}</p>
        {changeLabel && (
          <p className="text-xs text-[#52525b] mt-2">{changeLabel}</p>
        )}
      </div>
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-32 h-32 opacity-10">
        <div className="absolute top-4 right-4 w-24 h-24 rounded-full bg-current" />
      </div>
    </div>
  );
}
