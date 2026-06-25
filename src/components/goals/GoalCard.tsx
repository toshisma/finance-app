'use client';

import * as React from 'react';
import { Edit2, Trash2, Plus, Gift, Plane, Car, Home, Heart, Star, Target } from 'lucide-react';
import { cn, formatCurrency, calculateDaysLeft } from '@/lib/utils';
import { GoalWithProgress } from '@/lib/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'plane': Plane,
  'car': Car,
  'home': Home,
  'gift': Gift,
  'heart': Heart,
  'star': Star,
  'shield': Target,
};

interface GoalCardProps {
  goal: GoalWithProgress;
  onContribute: (goal: GoalWithProgress) => void;
  onEdit: (goal: GoalWithProgress) => void;
  onDelete: (id: string) => void;
}

export function GoalCard({ goal, onContribute, onEdit, onDelete }: GoalCardProps) {
  const IconComponent = iconMap[goal.icon] || Target;
  const daysLeft = goal.daysLeft;
  const isCompleted = goal.progress >= 100;

  return (
    <div className={cn(
      'relative overflow-hidden rounded-2xl bg-[#111118] border p-5 transition-all duration-200 hover:border-[#2a2a3d]',
      isCompleted ? 'border-[#10b981]/30' : 'border-[#1f1f2e]'
    )}>
      {/* Decorative gradient */}
      <div 
        className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl"
        style={{ backgroundColor: goal.color }}
      />

      {/* Header */}
      <div className="flex items-start justify-between mb-4 relative">
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${goal.color}20` }}
          >
            <IconComponent className="w-6 h-6" style={{ color: goal.color }} />
          </div>
          <div>
            <h3 className="font-semibold text-white">{goal.title}</h3>
            {goal.description && (
              <p className="text-sm text-[#52525b] line-clamp-1">{goal.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(goal)}
            className="p-2 rounded-lg text-[#52525b] hover:text-white hover:bg-[#1f1f2e] transition-all"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            className="p-2 rounded-lg text-[#52525b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="mb-4 relative">
        <div className="flex items-baseline justify-between mb-2">
          <span className="text-3xl font-bold text-white">
            {formatCurrency(goal.current_amount)}
          </span>
          <span className="text-sm text-[#52525b]">
            sur {formatCurrency(goal.target_amount)}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4 relative">
        <div className="h-4 bg-[#1f1f2e] rounded-full overflow-hidden">
          <div 
            className="h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2"
            style={{ 
              width: `${goal.progress}%`,
              backgroundColor: goal.color
            }}
          >
            {goal.progress > 15 && (
              <span className="text-[10px] font-bold text-white">
                {goal.progress}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {daysLeft !== undefined ? (
          <span className={cn(
            'text-sm font-medium',
            daysLeft < 30 ? 'text-[#f59e0b]' : 'text-[#a1a1aa]'
          )}>
            {isCompleted ? 'Objectif atteint ! 🎉' : `${daysLeft} jours restants`}
          </span>
        ) : (
          <span className="text-sm text-[#a1a1aa]">Sans deadline</span>
        )}
        {!isCompleted && (
          <button
            onClick={() => onContribute(goal)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={{ 
              backgroundColor: `${goal.color}20`,
              color: goal.color
            }}
          >
            <Plus className="w-4 h-4" />
            Contribuer
          </button>
        )}
      </div>

      {/* Shared indicator */}
      {goal.is_shared && (
        <div className="mt-3 pt-3 border-t border-[#1f1f2e]">
          <span className="text-xs text-[#8b5cf6]">Partagé avec Annelyse</span>
        </div>
      )}
    </div>
  );
}
