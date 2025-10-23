import { useState, useEffect } from 'react';
import {
  supabase,
  getUserCompleteProfile,
  type CompleteProfile,
} from '@/lib/supabase';

export function useUser() {
  const [profile, setProfile] = useState<CompleteProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          await loadUserProfile();
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getUserCompleteProfile();
      setProfile(data);
    } catch (err: any) {
      console.error('Erro ao carregar perfil:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = async () => {
    await loadUserProfile();
  };

  return {
    profile,
    loading,
    error,
    refreshProfile,
    isAuthenticated: !!profile,
  };
}
