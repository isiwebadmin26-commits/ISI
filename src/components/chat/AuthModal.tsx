// src/components/chat/AuthModal.tsx
import React, { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight, Shield, AlertCircle } from 'lucide-react';
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
  const { signInWithEmail, signUpWithEmail, resetPasswordForEmail, enableGuestMode } = useAuth();
  const [tab, setTab] = useState<'signin' | 'signup' | 'forgot'>(defaultTab);

  // Sign In / Sign Up fields
  const [identifier, setIdentifier] = useState(''); // Username or Email
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    const cleanIdentifier = identifier.trim();

    try {
      if (tab === 'signin') {
        const { error } = await signInWithEmail(cleanIdentifier, password);
        if (error) {
          setErrorMessage(error.message === 'Invalid login credentials' 
            ? 'Invalid username/email or password. Please check your credentials.' 
            : error.message);
        } else {
          toast.success('Signed in successfully!');
          onClose();
        }
      } else if (tab === 'signup') {
        const { error } = await signUpWithEmail(cleanIdentifier, password, fullName);
        if (error) {
          setErrorMessage(error.message);
        } else {
          toast.success('Account created and signed in successfully!');
          onClose();
        }
      } else if (tab === 'forgot') {
        const { error } = await resetPasswordForEmail(cleanIdentifier);
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

  const handleContinueAsGuest = () => {
    enableGuestMode();
    toast.info('Continuing in Guest Mode. Chat history will be saved locally on this device.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm sm:max-w-md bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          title="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3 border border-primary/20">
            <Shield className="w-6 h-6" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-foreground">
            {tab === 'signin' && 'Sign In to ISI Security Chat'}
            {tab === 'signup' && 'Create Your Account'}
            {tab === 'forgot' && 'Reset Password'}
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {tab === 'signin' && 'Enter your username or email and password.'}
            {tab === 'signup' && 'Enter your details to create your account.'}
            {tab === 'forgot' && 'Enter your username or email to reset password.'}
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

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Clean Form: Username/Email and Password Alone */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Sign Up Full Name */}
          {tab === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-foreground mb-1">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          )}

          {/* Identifier: Username OR Email */}
          <div>
            <label className="block text-xs font-medium text-foreground mb-1">
              Username or Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                required
                autoComplete="username"
                placeholder="e.g. admin or name@company.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
            </div>
          </div>

          {/* Password */}
          {tab !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-medium text-foreground">
                  Password
                </label>
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
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/80 bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
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
