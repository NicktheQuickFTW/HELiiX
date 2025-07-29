'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { useRouter } from 'next/navigation';

export interface UserProfile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role: 'admin' | 'finance' | 'operations' | 'marketing' | 'viewer';
  department?: string;
  big12_employee_id?: string;
  phone?: string;
  avatar_url?: string;
  timezone?: string;
  preferences?: Record<string, any>;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (
    email: string,
    password: string,
    userData?: Partial<UserProfile>
  ) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (
    updates: Partial<UserProfile>
  ) => Promise<{ error: Error | null }>;
  resetPassword: (email: string) => Promise<{ error: Error | null }>;
  hasRole: (roles: string | string[]) => boolean;
  hasPermission: (resource: string, action: string) => boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Role-based permissions configuration
const PERMISSIONS = {
  admin: ['*'], // Full access
  finance: [
    'distributions:read',
    'distributions:write',
    'budgets:read',
    'budgets:write',
    'invoices:read',
    'invoices:write',
    'awards:read',
  ],
  operations: [
    'operations:read',
    'operations:write',
    'teams:read',
    'teams:write',
    'scheduling:read',
    'scheduling:write',
    'awards:read',
    'awards:write',
  ],
  marketing: ['marketing:read', 'marketing:write', 'teams:read', 'awards:read'],
  viewer: ['dashboard:read', 'teams:read', 'awards:read'],
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string, userEmail?: string) => {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        // If table doesn't exist or user not found, create a default profile
        if (error.code === 'PGRST116' || error.code === '42P01') {
          console.log(
            'User profiles table not found or user profile missing, using default profile'
          );
          return createDefaultProfile(userId, userEmail);
        }
        console.error('Error fetching user profile:', error);
        return createDefaultProfile(userId, userEmail);
      }

      return data as UserProfile;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return createDefaultProfile(userId, userEmail);
    }
  };

  // Create a default profile for development
  const createDefaultProfile = (
    userId: string,
    userEmail?: string
  ): UserProfile => {
    // Extract user metadata from the session if available
    const metadata = session?.user?.user_metadata || {};

    return {
      id: userId,
      email: userEmail || user?.email || 'admin@big12sports.com',
      first_name: metadata.first_name || 'Admin',
      last_name: metadata.last_name || 'User',
      role: (metadata.role || 'admin') as UserProfile['role'],
      department: metadata.department || 'Big 12 Conference Operations',
      phone: metadata.phone || '+1 (512) 555-0123',
      timezone: metadata.timezone || 'America/Chicago',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  // Update last login timestamp
  const updateLastLogin = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);

      if (error && error.code !== '42P01') {
        console.log(
          'Could not update last login - table may not exist:',
          error.message
        );
      }
    } catch (error) {
      console.log('Could not update last login - skipping:', error);
    }
  };

  useEffect(() => {
    // For development, create a mock session if no real auth is available
    const initAuth = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.log(
            'No Supabase session found, using mock data for development'
          );
          // Create a mock user for development
          const mockUser = {
            id: 'mock-user-id',
            email: 'nick.williams@big12sports.com',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          } as User;

          setUser(mockUser);
          setProfile(createDefaultProfile(mockUser.id));
          setSession(null);
          setLoading(false);
          return;
        }

        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const userProfile = await fetchUserProfile(
            session.user.id,
            session.user.email
          );
          setProfile(userProfile);
          await updateLastLogin(session.user.id);
        }

        setLoading(false);
      } catch (error) {
        console.log('Auth initialization failed, using mock data:', error);
        // Fallback to mock data
        const mockUser = {
          id: 'mock-user-id',
          email: 'nick.williams@big12sports.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        } as User;

        setUser(mockUser);
        setProfile(createDefaultProfile(mockUser.id));
        setSession(null);
        setLoading(false);
      }
    };

    initAuth();

    // Listen for changes on auth state (sign in, sign out, etc.)
    let subscription: any = null;
    try {
      const {
        data: { subscription: authSubscription },
      } = supabase.auth.onAuthStateChange(async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          const userProfile = await fetchUserProfile(
            session.user.id,
            session.user.email
          );
          setProfile(userProfile);
          await updateLastLogin(session.user.id);
        } else {
          setProfile(null);
        }

        setLoading(false);
      });
      subscription = authSubscription;
    } catch (error) {
      console.log('Could not set up auth subscription:', error);
    }

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (!error) {
        // Log the sign-in action
        await logUserAction('user:sign_in', 'auth', email);
        router.push('/dashboard');
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userData?: Partial<UserProfile>
  ) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData || {},
        },
      });

      if (!error) {
        await logUserAction('user:sign_up', 'auth', email);
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    if (user) {
      await logUserAction('user:sign_out', 'auth', user.email);
    }
    await supabase.auth.signOut();
    router.push('/login');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (!user) return { error: new Error('No user logged in') };

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (!error) {
        setProfile((prev) => (prev ? { ...prev, ...updates } : null));
        await logUserAction('user:profile_update', 'user_profiles', user.id, {
          updates,
        });
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (!error) {
        await logUserAction('user:password_reset_request', 'auth', email);
      }

      return { error };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const hasRole = (roles: string | string[]) => {
    if (!profile) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(profile.role);
  };

  const hasPermission = (resource: string, action: string) => {
    if (!profile) return false;

    const userPermissions = PERMISSIONS[profile.role] || [];
    const requiredPermission = `${resource}:${action}`;

    // Admin has all permissions
    if (userPermissions.includes('*')) return true;

    // Check specific permission
    return userPermissions.includes(requiredPermission);
  };

  const logUserAction = async (
    action: string,
    resourceType?: string,
    resourceId?: string,
    details?: any
  ) => {
    try {
      if (!user) return;

      const { error } = await supabase.rpc('log_user_action', {
        p_user_id: user.id,
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_details: details,
      });

      if (error) {
        console.log(
          'Could not log user action - function may not exist:',
          error.message
        );
      }
    } catch (error) {
      console.log('Could not log user action - skipping:', error);
    }
  };

  const value = {
    user,
    profile,
    session,
    signIn,
    signUp,
    signOut,
    updateProfile,
    resetPassword,
    hasRole,
    hasPermission,
    loading,
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
