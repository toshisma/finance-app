'use client';

import * as React from 'react';
import { Plus, Target } from 'lucide-react';
import { GoalCard } from '@/components/goals/GoalCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input, Textarea } from '@/components/ui/Input';
import { useGoals } from '@/hooks/useGoals';
import { GoalWithProgress, COLORS, GOAL_ICONS } from '@/lib/types';
import { formatCurrency, cn } from '@/lib/utils';

export default function GoalsPage() {
  const { goals, loading, addGoal, updateGoal, contributeToGoal, deleteGoal } = useGoals();
  const [showModal, setShowModal] = React.useState(false);
  const [showContributeModal, setShowContributeModal] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<GoalWithProgress | null>(null);
  const [contributingGoal, setContributingGoal] = React.useState<GoalWithProgress | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    target_amount: '',
    current_amount: '',
    deadline: '',
    color: COLORS[0],
    icon: 'target',
    is_shared: false,
  });
  const [contributionAmount, setContributionAmount] = React.useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        target_amount: parseFloat(formData.target_amount),
        current_amount: parseFloat(formData.current_amount) || 0,
      };
      
      if (editingGoal) {
        await updateGoal(editingGoal.id, data);
      } else {
        await addGoal(data);
      }
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributingGoal) return;
    setIsSubmitting(true);
    try {
      await contributeToGoal(contributingGoal.id, parseFloat(contributionAmount));
      setShowContributeModal(false);
      setContributingGoal(null);
      setContributionAmount('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (goal: GoalWithProgress) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      target_amount: goal.target_amount.toString(),
      current_amount: goal.current_amount.toString(),
      deadline: goal.deadline || '',
      color: goal.color,
      icon: goal.icon,
      is_shared: goal.is_shared,
    });
    setShowModal(true);
  };

  const handleOpenContribute = (goal: GoalWithProgress) => {
    setContributingGoal(goal);
    setShowContributeModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet objectif ?')) {
      await deleteGoal(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingGoal(null);
    setFormData({ title: '', description: '', target_amount: '', current_amount: '', deadline: '', color: COLORS[0], icon: 'target', is_shared: false });
  };

  const totalSaved = goals.reduce((sum, g) => sum + g.current_amount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.target_amount, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Objectifs d'épargne</h1>
          <p className="text-[#a1a1aa]">
            Défiez vos objectifs financiers et suivez votre progression.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Nouvel objectif
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
          <p className="text-sm text-[#a1a1aa] mb-2">Total économisé</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalSaved)}</p>
        </div>
        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
          <p className="text-sm text-[#a1a1aa] mb-2">Objectif total</p>
          <p className="text-2xl font-bold text-white">{formatCurrency(totalTarget)}</p>
        </div>
        <div className="bg-[#111118] border border-[#1f1f2e] rounded-2xl p-6">
          <p className="text-sm text-[#a1a1aa] mb-2">Progression globale</p>
          <p className="text-2xl font-bold text-white">
            {totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Goal cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-56 bg-[#111118] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center py-16 bg-[#111118] border border-[#1f1f2e] rounded-2xl">
          <Target className="w-16 h-16 mx-auto mb-4 text-[#52525b]" />
          <h3 className="text-lg font-semibold text-white mb-2">Aucun objectif défini</h3>
          <p className="text-[#52525b] mb-6">Créez votre premier objectif pour commencer à économiser</p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Créer un objectif
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onContribute={handleOpenContribute}
            />
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingGoal ? 'Modifier l\'objectif' : 'Nouvel objectif'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Titre"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Ex: Vacances en Grèce"
            required
          />

          <Textarea
            label="Description (optionnel)"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Décrivez votre objectif..."
            rows={2}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              label="Montant cible (€)"
              value={formData.target_amount}
              onChange={(e) => setFormData({ ...formData, target_amount: e.target.value })}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
            <Input
              type="number"
              label="Montant actuel (€)"
              value={formData.current_amount}
              onChange={(e) => setFormData({ ...formData, current_amount: e.target.value })}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>

          <Input
            type="date"
            label="Deadline (optionnel)"
            value={formData.deadline}
            onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Couleur</label>
            <div className="flex gap-2">
              {COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setFormData({ ...formData, color })}
                  className={cn(
                    'w-8 h-8 rounded-lg transition-all',
                    formData.color === color ? 'ring-2 ring-offset-2 ring-offset-[#0a0a0f]' : ''
                  )}
                  style={{ backgroundColor: color, ringColor: color }}
                />
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.is_shared}
                onChange={(e) => setFormData({ ...formData, is_shared: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#1f1f2e] rounded-full peer peer-checked:bg-[#8b5cf6] transition-colors" />
              <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5" />
            </div>
            <span className="text-sm font-medium text-white">Objectif partagé avec le couple</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={handleCloseModal} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : editingGoal ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Contribute Modal */}
      <Modal
        isOpen={showContributeModal}
        onClose={() => { setShowContributeModal(false); setContributingGoal(null); }}
        title={`Contribuer à "${contributingGoal?.title}"`}
      >
        <form onSubmit={handleContribute} className="space-y-5">
          <div className="bg-[#0a0a0f] rounded-xl p-4 text-center">
            <p className="text-sm text-[#a1a1aa] mb-2">Montant actuel</p>
            <p className="text-2xl font-bold" style={{ color: contributingGoal?.color }}>
              {formatCurrency(contributingGoal?.current_amount || 0)}
            </p>
            <p className="text-sm text-[#52525b] mt-2">
              Objectif: {formatCurrency(contributingGoal?.target_amount || 0)}
            </p>
          </div>

          <Input
            type="number"
            label="Montant à ajouter (€)"
            value={contributionAmount}
            onChange={(e) => setContributionAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0"
            required
          />

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={() => { setShowContributeModal(false); setContributingGoal(null); }} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Ajout...' : 'Ajouter'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
