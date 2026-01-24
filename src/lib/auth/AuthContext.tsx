'use client';

/**
 * Authentication Context
 *
 * Provides centralized authentication state management with Supabase.
 * Handles JWT-based authentication, role-based access control, and profile management.
 *
 * @remarks
 * Key Features:
 * - Automatic session detection and refresh
 * - Race condition prevention with request queueing
 * - Profile fetch with retry logic for database triggers
 * - Role-based permission helpers
 * - Error resilience (keeps existing profile on network errors)
 *
 * Authentication Flow:
 * 1. Component mounts → `initAuth()` checks for existing session
 * 2. If session exists → fetch user profile from database
 * 3. Listen for auth state changes (signin, signout, token refresh)
 * 4. On SIGNED_IN → fetch new profile
 * 5. On TOKEN_REFRESHED → keep existing profile (prevents random logouts)
 * 6. On SIGNED_OUT → clear all state
 *
 * Race Condition Handling:
 * - Uses `isFetchingRef` to prevent concurrent profile fetches
 * - Queues pending requests in `pendingFetchRef`
 * - Processes queue after current fetch completes
 *
 * Profile Creation:
 * - Profiles are auto-created via database trigger on user signup
 * - If profile not found (PGRST116), retries once after 1 second
 * - This handles the delay between user creation and trigger execution
 *
 * @example
 * ```tsx
 * function ProtectedPage() {
 *   const { user, profile, hasPermission, loading } = useAuth();
 *
 *   if (loading) return <LoadingSpinner />;
 *   if (!user) return <LoginPrompt />;
 *   if (!hasPermission(['admin', 'super_admin'])) return <Unauthorized />;
 *
 *   return <AdminPanel profile={profile} />;
 * }
 * ```
 *
 * @see {@link https://supabase.com/docs/guides/auth} Supabase Auth Docs
 */

import { createContext, useContext, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase/client';

/**
 * Available user roles in the system
 * @remarks Roles are stored in user.raw_app_meta_data.role in JWT
 */
export type UserRole = 'super_admin' | 'admin' | 'kontributor';

/**
 * User profile from the profiles table
 * @remarks Automatically created via trigger when user signs up
 */
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Authentication context shape
 * @remarks All auth-related state and functions available throughout the app
 */
export interface AuthContextType {
  /** Current authenticated user from Supabase Auth */
  user: User | null;
  /** User profile from profiles table (includes role) */
  profile: Profile | null;
  /** Current session with JWT token */
  session: Session | null;
  /** Loading state during initial auth check and profile fetch */
  loading: boolean;
  /** Error state (e.g., profile fetch failures) */
  error: Error | null;

  /** Sign in with email and password */
  signIn: (email: string, password: string) => Promise<void>;
  /** Sign out and clear all state */
  signOut: () => Promise<void>;

  /**
   * Check if user has one of the required roles
   * @param requiredRoles - Array of roles, user needs at least one
   * @returns true if user has permission, false otherwise
   * @example hasPermission(['admin', 'super_admin'])
   */
  hasPermission: (requiredRoles: UserRole[]) => boolean;

  /** Can manage users (create, edit, delete) - super_admin only */
  canManageUsers: () => boolean;
  /** Can manage members - super_admin and admin */
  canManageMembers: () => boolean;
  /** Can manage leadership - super_admin and admin */
  canManageLeadership: () => boolean;
  /** Can publish articles - super_admin and admin */
  canPublishArticles: () => boolean;
  /**
   * Check if user can edit their own content (kontributor rule)
   * @param authorId - The author_id of the content to check
   * @returns true if current user is the author
   */
  canEditOwnContent: (authorId: string) => boolean;

  /** Manually refresh user profile from database */
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }): React.ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Track if we're currently fetching to prevent race conditions
  const isFetchingRef = useRef(false);
  const pendingFetchRef = useRef<string | null>(null);
  const initializedRef = useRef(false);
  const hasSetLoadingFalseRef = useRef(false); // Prevent loading from bouncing

  useEffect(() => {
    let mounted = true;

    // Safety timeout: force loading to false after 10 seconds
    const safetyTimeout = setTimeout(() => {
      if (mounted && !hasSetLoadingFalseRef.current) {
        console.warn('[AuthContext] Loading timeout - forcing loading to false');
        setLoading(false);
        hasSetLoadingFalseRef.current = true;
        initializedRef.current = true;
      }
    }, 10000);

    async function initAuth(): Promise<void> {
      // Prevent multiple initializations
      if (initializedRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AuthContext] Already initialized, skipping');
        }
        return;
      }

      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          if (process.env.NODE_ENV === 'development') {
            console.error('[AuthContext] Error getting session:', error);
          }
          if (mounted) {
            setLoading(false);
            initializedRef.current = true;
          }
          return;
        }

        if (!mounted) {
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setLoading(false);
          initializedRef.current = true;
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[AuthContext] Auth initialization error:', error);
        }
        if (mounted) {
          setLoading(false);
          initializedRef.current = true;
        }
      }
    }

    initAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) {
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.warn('[AuthContext] Auth state change event:', event, 'session:', !!session);
      }

      // Don't process ANY events during initial load - let initAuth handle everything
      if (!initializedRef.current) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AuthContext] Skipping event during initialization:', event);
        }
        return;
      }

      // Only update session state, don't trigger profile refetch unless necessary
      setSession(session);
      setUser(session?.user ?? null);

      if (session?.user) {
        // Only fetch profile on SIGNED_IN event (user just logged in)
        if (event === 'SIGNED_IN') {
          await fetchProfile(session.user.id);
        }
        // For TOKEN_REFRESHED, keep existing profile - don't refetch
        // This prevents random logouts from failed profile refetch during token refresh
        else if (event === 'TOKEN_REFRESHED') {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[AuthContext] Token refreshed, keeping existing profile');
          }
        }
        else if (event === 'SIGNED_OUT') {
          setProfile(null);
          if (mounted) {
            setLoading(false);
            initializedRef.current = false;
          }
        }
      } else {
        // Only clear profile on explicit SIGNED_OUT event
        if (event === 'SIGNED_OUT') {
          setProfile(null);
          if (mounted) {
            setLoading(false);
            initializedRef.current = false;
          }
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimeout);
      subscription.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once on mount. fetchProfile is stable.

  async function fetchProfile(userId: string, silent = false): Promise<void> {
    const isMounted = { current: true };

    // Prevent concurrent fetches - queue the request instead of ignoring it
    if (isFetchingRef.current) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AuthContext] Fetch already in progress, queuing for later');
      }
      // Queue this request to run after current fetch completes
      pendingFetchRef.current = userId;
      return;
    }

    // Skip if already fetched for this user AND we're doing a silent refresh
    if (silent && profile?.id === userId) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AuthContext] Profile already loaded, skipping silent refresh');
      }
      return;
    }

    isFetchingRef.current = true;

    try {
      if (process.env.NODE_ENV === 'development') {
        console.warn('[AuthContext] Fetching profile for user:', userId);
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('[AuthContext] Error fetching profile:', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint,
          });
        }

        // If profile not found (PGRST116), it might be creating via trigger.
        // Wait a bit and retry once.
        if (error.code === 'PGRST116') {
          if (process.env.NODE_ENV === 'development') {
            console.warn('[AuthContext] Profile not found (PGRST116), waiting for trigger...');
          }

          if (!silent) {
            // Wait 1 second and try again
            await new Promise(resolve => setTimeout(resolve, 1000));

            const { data: retryData, error: retryError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', userId)
              .single();

            if (!retryError && retryData) {
              setProfile(retryData);
              return;
            }
          }

          throw error;
        }

        // For other errors, log and continue
        console.error('[AuthContext] Profile fetch failed with error:', error);
        throw error;
      }

      if (process.env.NODE_ENV === 'development') {
        const fetchedProfile = data as Profile;
        console.warn('[AuthContext] Profile fetched successfully:', {
          id: fetchedProfile.id,
          email: fetchedProfile.email,
          role: fetchedProfile.role,
        });
      }

      setProfile(data);
    } catch (error: unknown) {
      if (process.env.NODE_ENV === 'development') {
        console.error('[AuthContext] Error in fetchProfile:', error);
      }

      // Only clear profile on PGRST116 (profile not found) during initial creation
      // For ALL other errors (network, timeout, permission), keep existing profile to prevent random logouts
      const err = error as { code?: string };
      if (err.code === 'PGRST116' && !profile) {
        // Only set null if profile doesn't exist yet (initial load/creation)
        setProfile(null);
        setError(error as Error);
      } else {
        // Keep existing profile for all other errors - prevents random logouts
        console.warn('[AuthContext] Fetch failed but keeping existing profile to prevent logout:', error);
        // Clear error after 5 seconds to avoid persistent error states
        setError(error as Error);
        setTimeout(() => {
          if (isMounted.current) {
            setError(null);
          }
        }, 5000);
      }

      // Don't throw - we want to complete initialization even if profile fetch fails
    } finally {
      isFetchingRef.current = false;

      // CRITICAL: Only set loading=false ONCE during initialization
      // After that, loading state is permanent (never bounces back to true)
      if (!hasSetLoadingFalseRef.current) {
        setLoading(false);
        hasSetLoadingFalseRef.current = true;
        initializedRef.current = true;
      }

      // Process pending fetch if any
      if (pendingFetchRef.current) {
        const pendingUserId = pendingFetchRef.current;
        pendingFetchRef.current = null;
        if (process.env.NODE_ENV === 'development') {
          console.warn('[AuthContext] Processing pending fetch for:', pendingUserId);
        }
        // Use setTimeout to avoid potential stack overflow with recursive calls
        setTimeout(() => fetchProfile(pendingUserId, true), 0);
      }
    }
  }

  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw error;
    }

    // Reset all state on sign out
    setUser(null);
    setProfile(null);
    setSession(null);
    isFetchingRef.current = false;
    initializedRef.current = false;
  }, []);

  // Permission helpers - memoized with useCallback to prevent re-renders
  const hasPermission = useCallback((requiredRoles: UserRole[]): boolean => {
    if (!profile) {
      return false;
    }
    return requiredRoles.includes(profile.role);
  }, [profile]);

  const canManageUsers = useCallback((): boolean => {
    return hasPermission(['super_admin']);
  }, [hasPermission]);

  const canManageMembers = useCallback((): boolean => {
    return hasPermission(['super_admin', 'admin']);
  }, [hasPermission]);

  const canManageLeadership = useCallback((): boolean => {
    return hasPermission(['super_admin', 'admin']);
  }, [hasPermission]);

  const canPublishArticles = useCallback((): boolean => {
    return hasPermission(['super_admin', 'admin']);
  }, [hasPermission]);

  const canEditOwnContent = useCallback((authorId: string): boolean => {
    if (!user) {
      return false;
    }
    return user.id === authorId;
  }, [user]);

  const refreshProfile = useCallback(async (): Promise<void> => {
    if (user) {
      await fetchProfile(user.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]); // fetchProfile is stable, no need to include

  // Memoize context value to prevent unnecessary re-renders
  const value = useMemo(() => ({
    user,
    profile,
    session,
    loading,
    error,
    signIn,
    signOut,
    hasPermission,
    canManageUsers,
    canManageMembers,
    canManageLeadership,
    canPublishArticles,
    canEditOwnContent,
    refreshProfile,
  }), [
    user,
    profile,
    session,
    loading,
    error, // Add to dependency array
    signIn,
    signOut,
    hasPermission,
    canManageUsers,
    canManageMembers,
    canManageLeadership,
    canPublishArticles,
    canEditOwnContent,
    refreshProfile,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
