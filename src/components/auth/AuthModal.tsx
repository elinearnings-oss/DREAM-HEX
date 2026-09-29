import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Lock, Mail, User as UserIcon, ShieldCheck, ArrowRight } from 'lucide-react';
import { BRAND_INFO } from '../../data/mockData';

export const AuthModal: React.FC = () => {
  const { authModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsConfirmed, setTermsConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  if (!authModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('error', 'Validation Error', 'Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      login(email, password);
      setIsLoading(false);
    }, 400);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('error', 'Validation Error', 'Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      showToast('error', 'Validation Error', 'Please enter a valid email address.');
      return;
    }
    if (!ageConfirmed) {
      showToast('error', 'Eligibility Notice', 'You must confirm that you are at least 18 years of age.');
      return;
    }
    if (!termsConfirmed) {
      showToast('error', 'Terms & Conditions', 'Please acknowledge the platform terms and risk disclosure.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      register(name, email, ageConfirmed, referralCode);
      setIsLoading(false);
    }, 400);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      showToast('error', 'Validation Error', 'Please provide your account email.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      showToast('info', 'Recovery Initiated', `If an account exists for ${email}, a password reset link has been dispatched.`);
      openAuthModal('login');
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#0f131a] border border-[#222b3a] rounded-xl shadow-2xl p-6 sm:p-7 relative text-slate-100"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={closeAuthModal}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-200 p-1 rounded-md transition-colors"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-6">
          <img 
            src="/src/assets/images/velora_brand_logo_1790680377503.jpg" 
            alt="VELORA" 
            className="w-8 h-8 rounded-md object-cover border border-rose-500/30"
          />
          <div>
            <h2 className="text-base font-bold text-slate-100 tracking-tight">VELORA</h2>
            <p className="text-xs text-slate-400">{BRAND_INFO.tagline}</p>
          </div>
        </div>

        {/* Mode Title */}
        <div className="mb-5">
          <h3 className="text-lg font-semibold text-slate-100">
            {authModalMode === 'login' && 'Sign in to your account'}
            {authModalMode === 'register' && 'Create VELORA account'}
            {authModalMode === 'forgot' && 'Reset your password'}
            {authModalMode === 'reset' && 'Set a new password'}
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {authModalMode === 'login' && 'Access your digital products, 24h reward cycles, and wallet.'}
            {authModalMode === 'register' && 'Join the rewards platform. Age requirement 18+ applies.'}
            {authModalMode === 'forgot' && 'Enter your registered email to receive recovery instructions.'}
          </p>
        </div>

        {/* LOGIN FORM */}
        {authModalMode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#161c26] border border-[#263142] rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-slate-300">Password</label>
                <button
                  type="button"
                  onClick={() => openAuthModal('forgot')}
                  className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#161c26] border border-[#263142] rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg shadow-md shadow-rose-950/40 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <span className="text-xs text-slate-400">Don't have an account yet? </span>
              <button
                type="button"
                onClick={() => openAuthModal('register')}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 ml-1 transition-colors"
              >
                Create one now
              </button>
            </div>
          </form>
        )}

        {/* REGISTER FORM */}
        {authModalMode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Legal Name</label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Alexandre Pratama"
                  className="w-full bg-[#161c26] border border-[#263142] rounded-lg pl-10 pr-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#161c26] border border-[#263142] rounded-lg pl-10 pr-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Create Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full bg-[#161c26] border border-[#263142] rounded-lg pl-10 pr-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Referral Code (Optional)</label>
              <input
                type="text"
                value={referralCode}
                onChange={e => setReferralCode(e.target.value)}
                placeholder="e.g. VEL-78492"
                className="w-full bg-[#161c26] border border-[#263142] rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Compliance & Age verification checkboxes */}
            <div className="pt-2 space-y-2 border-t border-[#222b3a]">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ageConfirmed}
                  onChange={e => setAgeConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded bg-[#161c26] border-[#374151] text-rose-600 focus:ring-rose-500 focus:ring-offset-0"
                  required
                />
                <span className="text-xs text-slate-300 leading-snug">
                  I confirm that I am at least <strong className="text-slate-100">18 years of age</strong> (Minimum age requirement).
                </span>
              </label>

              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsConfirmed}
                  onChange={e => setTermsConfirmed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded bg-[#161c26] border-[#374151] text-rose-600 focus:ring-rose-500 focus:ring-offset-0"
                  required
                />
                <span className="text-xs text-slate-400 leading-snug">
                  I understand that product rewards are not guaranteed investment returns and I accept the platform terms.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 py-2.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg shadow-md shadow-rose-950/40 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isLoading ? 'Creating account...' : 'Create VELORA Account'}
              <ShieldCheck className="w-4 h-4" />
            </button>

            <div className="text-center pt-1">
              <span className="text-xs text-slate-400">Already have an account? </span>
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="text-xs font-semibold text-rose-400 hover:text-rose-300 ml-1 transition-colors"
              >
                Sign in
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {authModalMode === 'forgot' && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-[#161c26] border border-[#263142] rounded-lg pl-10 pr-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
            >
              {isLoading ? 'Submitting...' : 'Send Password Reset Link'}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => openAuthModal('login')}
                className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
              >
                Back to Sign in
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
