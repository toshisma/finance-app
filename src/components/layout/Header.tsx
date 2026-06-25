'use client';

import * as React from 'react';
import { Moon, Sun, Bell, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

export function Header() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [notifications, setNotifications] = React.useState<number>(0);
  const [showNotifications, setShowNotifications] = React.useState(false);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { count } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      setNotifications(count || 0);
    };

    fetchNotifications();
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('light');
  };

  return (
    <header className="sticky top-0 z-30 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-[#1f1f2e]">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Search */}
        <div className="hidden md:flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#52525b]" />
            <input
              type="text"
              placeholder="Rechercher une transaction..."
              className="w-full pl-10 pr-4 py-2 bg-[#111118] border border-[#1f1f2e] rounded-xl text-sm text-white placeholder-[#52525b] focus:outline-none focus:ring-2 focus:ring-[#8b5cf6] focus:border-[#8b5cf6] transition-all"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-[#111118] border border-[#1f1f2e] text-[#a1a1aa] hover:text-white hover:border-[#2a2a3d] transition-all duration-200"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2.5 rounded-xl bg-[#111118] border border-[#1f1f2e] text-[#a1a1aa] hover:text-white hover:border-[#2a2a3d] transition-all duration-200"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#ef4444] text-[10px] font-bold text-white flex items-center justify-center">
                  {notifications > 9 ? '9+' : notifications}
                </span>
              )}
            </button>

            {/* Notifications dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-[#111118] border border-[#1f1f2e] rounded-xl shadow-xl overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-[#1f1f2e]">
                  <h3 className="font-semibold">Notifications</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications === 0 ? (
                    <div className="p-8 text-center text-[#52525b]">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Aucune notification</p>
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-[#a1a1aa]">
                      {notifications} notification{notifications > 1 ? 's' : ''} non lue{notifications > 1 ? 's' : ''}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Online status indicator */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" />
            <span className="text-xs font-medium text-[#10b981]">Synchronisé</span>
          </div>
        </div>
      </div>
    </header>
  );
}
