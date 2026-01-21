'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

export type UserRole = 'super_admin' | 'admin' | 'kontributor';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  hasPermission: (requiredRoles: UserRole[]) => boolean;
  canManageUsers: () => boolean;
  canManageMembers: () => boolean;
  canManageLeadership: () => boolean;
  canPublishArticles: () => boolean;
  canEditOwnContent: (authorId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Safety timeout: force loading to false after 10 seconds
    const safetyTimeout = setTimeout(() => {
      if (mounted && loading) {
        console.warn('[AuthContext] Loading timeout - forcing loading to false');
        setLoading(false);
      }
    }, 10000);

    async function initAuth() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[AuthContext] Error getting session:', error);
          }
          setLoading(false);
          return;
        }

        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[AuthContext] Auth initialization error:', error);
        }
        setLoading(false);
      }
    }

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Only fetch profile on SIGNED_IN event to avoid unnecessary fetches
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          await fetchProfile(session.user.id);
        }
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchProfile(userId: string) {
    // Skip if already fetched for this user (prevent re-fetching on navigation)
    if (profile?.id === userId) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If profile not found (PGRST116), try to create one
        if (error.code === 'PGRST116') {
          if (process.env.NODE_ENV === 'development') {
            console.log('[AuthContext] Profile not found, creating new profile...');
          }
          // Don't use finally here - createProfileForUser handles loading state
          return await createProfileForUser(userId);
        }
        throw error;
      }

      setProfile(data);
      setLoading(false);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[AuthContext] Error fetching profile:', error);
      }
      setProfile(null);
      setLoading(false);
    }
  }

  async function createProfileForUser(userId: string) {
    try {
      // Get user email from auth
      const { data: { user: authUser } } = await supabase.auth.getUser();

      if (!authUser) {
        throw new Error('User not found in auth');
      }

      // Create profile with default role
      const newProfile = {
        id: userId,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || authUser.email?.split('@')[0] || '',
        role: 'kontributor' as const, // Default role
      };

      const { data, error } = await supabase
        .from('profiles')
        .insert(newProfile as any) // Type assertion to bypass Supabase type inference issue
        .select()
        .single();

      if (error) throw error;

      if (process.env.NODE_ENV === 'development') {
        console.log('[AuthContext] Profile created successfully:', data);
      }

      setProfile(data);
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[AuthContext] Error creating profile:', error);
      }
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }

  // Permission helpers
  function hasPermission(requiredRoles: UserRole[]): boolean {
    if (!profile) return false;
    return requiredRoles.includes(profile.role);
  }

  function canManageUsers(): boolean {
    return hasPermission(['super_admin']);
  }

  function canManageMembers(): boolean {
    return hasPermission(['super_admin', 'admin']);
  }

  function canManageLeadership(): boolean {
    return hasPermission(['super_admin', 'admin']);
  }

  function canPublishArticles(): boolean {
    return hasPermission(['super_admin', 'admin']);
  }

  function canEditOwnContent(authorId: string): boolean {
    if (!user) return false;
    return user.id === authorId;
  }

  const value = {
    user,
    profile,
    session,
    loading,
    signIn,
    signOut,
    hasPermission,
    canManageUsers,
    canManageMembers,
    canManageLeadership,
    canPublishArticles,
    canEditOwnContent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
