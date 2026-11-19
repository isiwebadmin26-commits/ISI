// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseService';
import { UserProfile, UserRole } from '../types/chat';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole;
  isAdmin: boolean;
  loading: boolean;
  isGuest: boolean;
  enableGuestMode: () => void;
  signUpWithEmail: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
  resetPasswordForEmail: (email: string) => Promise<{ error: AuthError | null }>;
  updateUserPassword: (newPassword: string) => Promise<{ error: AuthError | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState<boolean>(() => {
    return localStorage.getItem('isi_chat_guest') === 'true';
  });

  // Fetch or create user profile and role
  const loadUserProfile = async (currentUser: User) => {
    try {
      // 1. Fetch user role
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', currentUser.id)
        .maybeSingle();

      let assignedRole: UserRole = 'user';

      if (!roleError && roleData?.role) {
        assignedRole = roleData.role as UserRole;
      } else {
        // Default role is user (or admin if specified in email domain or metadata)
        const isAdminEmail = 
          currentUser.email?.includes('admin') || 
          currentUser.email === 'isiwebadmin26@gmail.com' ||
          currentUser.app_metadata?.role === 'admin';

        if (isAdminEmail) assignedRole = 'admin';

        // Auto-insert role record
        await supabase
          .from('user_roles')
          .upsert({ user_id: currentUser.id, role: assignedRole }, { onConflict: 'user_id' });
      }

      setRole(assignedRole);
      setProfile({
        id: currentUser.id,
        email: currentUser.email || '',
        fullName: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0],
        role: assignedRole,
        avatarUrl: currentUser.user_metadata?.avatar_url || currentUser.user_metadata?.picture
      });
    } catch (err) {
      console.warn('[AUTH PROFILE LOAD NOTICE]', err);
    }
  };

  useEffect(() => {
    // 1. Check active session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        setIsGuest(false);
        localStorage.removeItem('isi_chat_guest');
        loadUserProfile(currentSession.user);
      }
      setLoading(false);
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          setIsGuest(false);
          localStorage.removeItem('isi_chat_guest');
          await loadUserProfile(newSession.user);
        } else {
          setProfile(null);
          setRole('user');
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const enableGuestMode = () => {
    setIsGuest(true);
    localStorage.setItem('isi_chat_guest', 'true');
  };

  const normalizeLoginIdentifier = (identifier: string): string => {
    const clean = identifier.trim().toLowerCase();
    if (clean.includes('@')) {
      return clean;
    }
    // If entered as plain username (e.g. 'admin' or 'user'), map to standard domain format
    return `${clean}@isisecurity.in`;
  };

  const signUpWithEmail = async (identifier: string, password: string, fullName?: string) => {
    const email = normalizeLoginIdentifier(identifier);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName || identifier.split('@')[0],
          username: identifier.includes('@') ? identifier.split('@')[0] : identifier
        }
      }
    });

    if (!error && data.user) {
      await loadUserProfile(data.user);
    }
    return { error };
  };

  const signInWithEmail = async (identifier: string, password: string) => {
    const email = normalizeLoginIdentifier(identifier);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!error && data.user) {
      await loadUserProfile(data.user);
    }
    return { error };
  };

  const signInWithOAuth = async (provider: 'google' | 'github') => {
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/chat` : undefined;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: redirectUrl
      }
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRole('user');
    setIsGuest(true);
    localStorage.setItem('isi_chat_guest', 'true');
  };

  const resetPasswordForEmail = async (email: string) => {
    const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/chat?action=reset_password` : undefined;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });
    return { error };
  };

  const updateUserPassword = async (newPassword: string) => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });
    return { error };
  };

  const value: AuthContextType = {
    user,
    session,
    profile,
    role,
    isAdmin: role === 'admin',
    loading,
    isGuest,
    enableGuestMode,
    signUpWithEmail,
    signInWithEmail,
    signInWithOAuth,
    signOut,
    resetPasswordForEmail,
    updateUserPassword
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
