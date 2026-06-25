'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export function useRealtimeSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('sync_channel')
      .on('broadcast', { event: 'sync' }, (payload) => {
        setLastSync(new Date());
        router.refresh();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  const triggerSync = useCallback(async () => {
    const channel = supabase.channel('sync_channel');
    await channel.send({
      type: 'broadcast',
      event: 'sync',
      payload: { timestamp: new Date().toISOString() }
    });
    setLastSync(new Date());
  }, []);

  return { isOnline, lastSync, triggerSync };
}
