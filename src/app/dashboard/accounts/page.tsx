'use client';

import * as React from 'react';
import { Plus, Wallet, CreditCard, PiggyBank, Banknote, TrendingUp, Users, Pencil, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAccounts } from '@/hooks/useAccounts';
import { formatCurrency, cn } from '@/lib/utils';
import { Account, AccountType, COLORS, ACCOUNT_ICONS } from '@/lib/types';

const accountTypeIcons: Record<string, React.ComponentType<{ className?: string; color?: string; style?: React.CSSProperties }>> = {
  checking: Wallet,
  savings: PiggyBank,
  credit: CreditCard,
  cash: Banknote,
  investment: TrendingUp,
};

export default function AccountsPage() {
  const { accounts, loading, addAccount, updateAccount, deleteAccount, totalBalance } = useAccounts();
  const [showModal, setShowModal] = React.useState(false);
  const [editingAccount, setEditingAccount] = React.useState<Account | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    type: 'checking' as AccountType,
    balance: '',
    color: COLORS[0],
    icon: 'wallet',
    is_shared: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        balance: parseFloat(formData.balance) || 0,
      };
      
      if (editingAccount) {
        await updateAccount(editingAccount.id, data);
      } else {
        await addAccount(data);
      }
      handleCloseModal();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setFormData({
      name: account.name,
      type: account.type,
      balance: account.balance.toString(),
      color: account.color,
      icon: account.icon,
      is_shared: account.is_shared,
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce compte ?')) {
      await deleteAccount(id);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAccount(null);
    setFormData({ name: '', type: 'checking', balance: '', color: COLORS[0], icon: 'wallet', is_shared: false });
  };

  const getAccountIcon = (iconName: string, type: string) => {
    const icon = accountTypeIcons[type] || Wallet;
    return icon;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Comptes</h1>
          <p className="text-[#a1a1aa]">
            Gérez vos comptes bancaires et virtuels.
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="w-4 h-4" />
          Nouveau compte
        </Button>
      </div>

      {/* Total balance */}
      <div className="bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/5 border border-[#8b5cf6]/20 rounded-2xl p-8">
        <p className="text-sm text-[#a1a1aa] mb-2">Solde total</p>
        <p className="text-4xl font-bold text-white mb-4">{formatCurrency(totalBalance)}</p>
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10b981]" />
            <span className="text-[#a1a1aa]">
              {accounts.filter(a => a.balance > 0).length} positif(s)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
            <span className="text-[#a1a1aa]">
              {accounts.filter(a => a.balance < 0).length} négatif(s)
            </span>
          </div>
        </div>
      </div>

      {/* Account cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-[#111118] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : accounts.length === 0 ? (
        <div className="text-center py-16 bg-[#111118] border border-[#1f1f2e] rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-[#1f1f2e] mx-auto mb-4 flex items-center justify-center">
            <Wallet className="w-8 h-8 text-[#52525b]" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Aucun compte défini</h3>
          <p className="text-[#52525b] mb-6">Ajoutez votre premier compte pour commencer</p>
          <Button onClick={() => setShowModal(true)}>
            <Plus className="w-4 h-4" />
            Ajouter un compte
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => {
            const IconComponent = getAccountIcon(account.icon, account.type);
            return (
              <div
                key={account.id}
                className="relative overflow-hidden rounded-2xl bg-[#111118] border border-[#1f1f2e] p-6 hover:border-[#2a2a3d] transition-all group"
              >
                {/* Background decoration */}
                <div 
                  className="absolute top-0 right-0 w-32 h-32 opacity-10 blur-2xl"
                  style={{ backgroundColor: account.color }}
                />

                <div className="relative">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ backgroundColor: `${account.color}20` }}
                      >
                        <IconComponent className="w-6 h-6" style={{ color: account.color } as React.CSSProperties} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{account.name}</h3>
                        <p className="text-sm text-[#52525b] capitalize">{account.type}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(account)}
                        className="p-2 rounded-lg text-[#52525b] hover:text-white hover:bg-[#1f1f2e] transition-all"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="p-2 rounded-lg text-[#52525b] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className={cn(
                      'text-2xl font-bold',
                      account.balance >= 0 ? 'text-white' : 'text-[#ef4444]'
                    )}>
                      {formatCurrency(account.balance)}
                    </p>
                  </div>

                  {account.is_shared && (
                    <div className="flex items-center gap-2 pt-4 border-t border-[#1f1f2e]">
                      <Users className="w-4 h-4 text-[#8b5cf6]" />
                      <span className="text-xs text-[#8b5cf6]">Compte partagé</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingAccount ? 'Modifier le compte' : 'Nouveau compte'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input
            label="Nom du compte"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ex: Compte courant"
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#a1a1aa] mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as AccountType })}
              className="w-full px-4 py-2.5 bg-[#0a0a0f] border border-[#1f1f2e] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-[#8b5cf6]"
            >
              <option value="checking">Compte courant</option>
              <option value="savings">Épargne</option>
              <option value="credit">Crédit</option>
              <option value="cash">Espèces</option>
              <option value="investment">Investissement</option>
            </select>
          </div>

          <Input
            type="number"
            label="Solde initial (€)"
            value={formData.balance}
            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
            placeholder="0.00"
            step="0.01"
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
                  style={{ 
                    backgroundColor: color,
                    ringColor: color
                  }}
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
            <span className="text-sm font-medium text-white">Compte partagé avec le couple</span>
          </label>

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="ghost" onClick={handleCloseModal} className="flex-1">
              Annuler
            </Button>
            <Button type="submit" className="flex-1" disabled={isSubmitting}>
              {isSubmitting ? 'Enregistrement...' : editingAccount ? 'Modifier' : 'Créer'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
