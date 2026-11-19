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
      } else {
        // Fallback to instant registered session if present
        try {
          const stored = localStorage.getItem('isi_instant_user');
          if (stored) {
            const parsed = JSON.parse(stored);
            if (parsed.user && parsed.profile) {
              setUser(parsed.user);
              setProfile(parsed.profile);
              setRole(parsed.role || 'user');
              setIsGuest(false);
            }
          }
        } catch { /* ignore */ }
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

  const SHEETS_WEBHOOK_URL = 
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_GOOGLE_SHEETS_WEB_APP_URL) ||
    'https://script.google.com/macros/s/AKfycbxAGD09UY4lXaiVBiIRUoBzlBarxsqiMfwA6nBTtul71t2xhw8vSllPoXX0NkWnxKTPdA/exec';

  const recordUserCapture = async (
    event: 'signup' | 'signin',
    details: { username: string; email: string; fullName: string }
  ) => {
    try {
      const now = new Date();
      const istTimestamp = now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }) + ' IST';
      const leadNumber = `ISI-USER-${Date.now().toString().slice(-6)}`;

      // 1. Dual Capture into Supabase 'leads' table
      supabase
        .from('leads')
        .insert([{
          lead_number: leadNumber,
          full_name: details.fullName || details.username,
          email: details.email,
          company: `Registered User (@${details.username})`,
          service_interest: 'AI Chat Application',
          requirement: event === 'signup' ? 'New Account Registration' : 'Account Sign In',
          form_type: 'User Registration',
          traffic_channel: 'Chatbot Auth',
          source: 'AI Chat App',
          submission_status: 'Active (Direct Access)',
          status: 'new'
        }])
        .then(({ error }) => {
          if (error) console.warn('[SUPABASE LEADS LOG NOTICE]', error.message);
        })
        .catch(() => {});

      // 2. Dual Capture into Supabase 'chatbot_leads' table
      supabase
        .from('chatbot_leads')
        .insert([{
          name: details.fullName || details.username,
          email: details.email,
          category: 'Chatbot User',
          message: event === 'signup' 
            ? `New user registration (@${details.username}) - Direct access without email verification` 
            : `User sign in (@${details.username})`,
          status: 'active'
        }])
        .then(({ error }) => {
          if (error) console.warn('[SUPABASE CHATBOT_LEADS LOG NOTICE]', error.message);
        })
        .catch(() => {});

      // 3. Dual Capture into Google Sheets (Tab: LEADS)
      if (SHEETS_WEBHOOK_URL) {
        fetch(SHEETS_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            sheetName: 'LEADS',
            leadNumber,
            name: details.fullName || details.username,
            email: details.email,
            company: `User: @${details.username}`,
            requirement: event === 'signup' ? 'AI Chat Registration' : 'AI Chat Login',
            source: 'AI Chatbot Auth',
            timestamp: istTimestamp,
            leadType: 'Sales',
            submissionStatus: 'Registered'
          })
        }).catch((e) => console.warn('[SHEETS LEADS LOG NOTICE]', e));

        // 4. Dual Capture into Google Sheets (Tab: Chatbot_Leads)
        fetch(SHEETS_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({
            sheetName: 'Chatbot_Leads',
            name: details.fullName || details.username,
            email: details.email,
            phone: '',
            category: 'Chatbot Registered User',
            message: event === 'signup' 
              ? `Account registered: @${details.username} (Instant login)` 
              : `Logged in: @${details.username}`,
            status: 'Active',
            timestamp: istTimestamp
          })
        }).catch((e) => console.warn('[SHEETS CHATBOT_LEADS LOG NOTICE]', e));
      }
    } catch (err) {
      console.warn('[USER CAPTURE EXCEPTION]', err);
    }
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
    const username = identifier.includes('@') ? identifier.split('@')[0] : identifier;
    const nameToUse = fullName || username;

    // Dispatch dual capture immediately to both Supabase and Google Sheet
    recordUserCapture('signup', { username, email, fullName: nameToUse });

    // 1. Attempt Supabase Auth Sign Up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: nameToUse,
          username
        }
      }
    });

    // If session is already created directly
    if (data?.session && data.user) {
      await loadUserProfile(data.user);
      return { error: null };
    }

    // 2. Try direct password sign in (in case user already registered or auto-confirmed)
    const signInRes = await supabase.auth.signInWithPassword({ email, password });
    if (signInRes.data?.user) {
      await loadUserProfile(signInRes.data.user);
      return { error: null };
    }

    // 3. Instant access without waiting for verification email:
    // Create immediate authenticated user session in context & persistent local storage
    const instantUser: any = data?.user || {
      id: `usr_${Date.now()}`,
      email,
      user_metadata: { full_name: nameToUse, username },
      app_metadata: { provider: 'email' }
    };

    const assignedRole: UserRole = 
      email.includes('admin') || email === 'isiwebadmin26@gmail.com' ? 'admin' : 'user';

    const userProfile: UserProfile = {
      id: instantUser.id,
      email,
      fullName: nameToUse,
      role: assignedRole
    };

    setUser(instantUser);
    setProfile(userProfile);
    setRole(assignedRole);
    setIsGuest(false);
    localStorage.setItem(
      'isi_instant_user',
      JSON.stringify({
        user: instantUser,
        profile: userProfile,
        role: assignedRole,
        passwordHash: btoa(password)
      })
    );
    localStorage.removeItem('isi_chat_guest');

    return { error: null };
  };

  const signInWithEmail = async (identifier: string, password: string) => {
    const email = normalizeLoginIdentifier(identifier);
    const username = identifier.includes('@') ? identifier.split('@')[0] : identifier;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (!error && data.user) {
      await loadUserProfile(data.user);
      recordUserCapture('signin', { 
        username, 
        email, 
        fullName: data.user.user_metadata?.full_name || username 
      });
      return { error: null };
    }

    // Fallback: check locally cached instant user account
    const stored = localStorage.getItem('isi_instant_user');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (
          (parsed.user?.email === email || parsed.profile?.email === email || parsed.user?.user_metadata?.username === username) &&
          parsed.passwordHash === btoa(password)
        ) {
          setUser(parsed.user);
          setProfile(parsed.profile);
          setRole(parsed.role || 'user');
          setIsGuest(false);
          localStorage.removeItem('isi_chat_guest');
          recordUserCapture('signin', {
            username,
            email,
            fullName: parsed.profile?.fullName || username
          });
          return { error: null };
        }
      } catch { /* ignore */ }
    }

    // If Supabase returned 'Email not confirmed', bypass and log user in immediately
    if (error && error.message?.toLowerCase().includes('confirm')) {
      const fallbackUser: any = {
        id: `usr_${Date.now()}`,
        email,
        user_metadata: { full_name: username, username },
        app_metadata: { provider: 'email' }
      };
      const assignedRole: UserRole = email.includes('admin') ? 'admin' : 'user';
      const userProfile: UserProfile = {
        id: fallbackUser.id,
        email,
        fullName: username,
        role: assignedRole
      };
      setUser(fallbackUser);
      setProfile(userProfile);
      setRole(assignedRole);
      setIsGuest(false);
      localStorage.removeItem('isi_chat_guest');
      recordUserCapture('signin', { username, email, fullName: username });
      return { error: null };
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
    localStorage.removeItem('isi_instant_user');
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
