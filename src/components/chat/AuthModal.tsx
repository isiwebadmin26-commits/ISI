// src/components/chat/AuthModal.tsx
import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Shield, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'sonner';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'signin' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'signin'
}) => {
  const { signInWithEmail, signUpWithEmail, signInWithOAuth, resetPasswordForEmail, enableGuestMode } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>(defaultTab);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    try {
      if (tab === 'signin') {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setErrorMessage(error.message);
        } else {
          toast.success('Signed in successfully!');
          onClose();
        }
      } else if (tab === 'signup') {
        const { error } = await signUpWithEmail(email, password, fullName);
        if (error) {
          setErrorMessage(error.message);
        } else {
          toast.success('Account created! Please check your email to verify if required.');
          onClose();
        }
      } else if (tab === 'forgot') {
        const { error } = await resetPasswordForEmail(email);
        if (error) {
          setErrorMessage(error.message);
        } else {
          toast.success('Password reset link sent to your email.');
          setTab('signin');
        }
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setErrorMessage(null);
    const { error } = await signInWithOAuth(provider);
    if (error) {
      setErrorMessage(error.message);
      setIsLoading(false);
    }
  };

  const handleContinueAsGuest = () => {
    enableGuestMode();
    toast.info('Continuing in Guest Mode. Chat history will be saved to this device.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 border border-primary/20">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            {tab === 'signin' && 'Welcome to ISI AI'}
            {tab === 'signup' && 'Create Your Account'}
            {tab === 'forgot' && 'Reset Password'}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {tab === 'signin' && 'Sign in to access your chat history and files.'}
            {tab === 'signup' && 'Join ISI Security to save conversations and attachments.'}
            {tab === 'forgot' && 'Enter your email to receive a password reset link.'}
          </p>
        </div>

        {/* Tab Switcher */}
        {tab !== 'forgot' && (
          <div className="flex p-1 bg-muted/60 rounded-xl mb-5 border border-border/50">
            <button
              type="button"
              onClick={() => { setTab('signin'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === 'signin'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setTab('signup'); setErrorMessage(null); }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                tab === 'signup'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Sign Up
            </button>
          </div>
        )}

        {/* OAuth Buttons */}
        {tab !== 'forgot' && (
          <div className="space-y-2.5 mb-5">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-muted/50 hover:bg-muted dark:bg-slate-900 border border-border/80 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuth('github')}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 py-2.5 px-4 bg-muted/50 hover:bg-muted dark:bg-slate-900 border border-border/80 rounded-xl text-xs sm:text-sm font-medium transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              <span>Continue with GitHub</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/60" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or with email</span>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Email & Password Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-foreground mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {tab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-foreground">Password</label>
                {tab === 'signin' && (
                  <button
                    type="button"
                    onClick={() => { setTab('forgot'); setErrorMessage(null); }}
                    className="text-[11px] text-primary hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {tab === 'signin' && 'Sign In'}
                  {tab === 'signup' && 'Create Account'}
                  {tab === 'forgot' && 'Send Reset Link'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back to sign in if in forgot tab */}
        {tab === 'forgot' && (
          <button
            type="button"
            onClick={() => setTab('signin')}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground mt-4 cursor-pointer"
          >
            Back to Sign In
          </button>
        )}

        {/* Footer: Guest mode button */}
        <div className="mt-6 pt-4 border-t border-border/50 text-center">
          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="text-xs text-muted-foreground hover:text-primary transition-colors cursor-pointer"
          >
            Continue as Guest without signing in →
          </button>
        </div>
      </div>
    </div>
  );
};
