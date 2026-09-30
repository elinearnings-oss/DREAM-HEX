import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { Shield, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2, User, KeyRound, ArrowRight } from 'lucide-react';
import { brandLogo } from '../../assets/images';

interface AdminLoginProps {
  onBackToCustomerSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToCustomerSite }) => {
  const { login, createFirstAdmin, needsInitialSetup, loading } = useAdminAuth();

  const [isSetupMode, setIsSetupMode] = useState<boolean>(needsInitialSetup);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both administrative email and password.');
      return;
    }

    if (isSetupMode) {
      if (password.length < 8) {
        setErrorMessage('Security policy requires admin password to be at least 8 characters long.');
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage('Passwords do not match. Please re-enter.');
        return;
      }

      setSubmitting(true);
      const res = await createFirstAdmin(email.trim(), password, displayName.trim() || 'Master Admin');
      setSubmitting(false);

      if (!res.success) {
        setErrorMessage(res.error || 'Failed to initialize master admin account.');
      } else {
        setSuccessMessage('Master Admin account created successfully! Accessing console...');
      }
      return;
    }

    // Standard Login
    setSubmitting(true);
    const res = await login(email.trim(), password);
    setSubmitting(false);

    if (!res.success) {
      setErrorMessage(res.error || 'Invalid credentials or unauthorized account.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090d] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans">
      {/* Subtle background ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-rose-950/20 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Top Brand Banner */}
        <div className="text-center mb-8 space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-[#0f141f] border border-[#1f293d] shadow-xl mb-2">
            <img 
              src={brandLogo} 
              alt="VELORA" 
              className="w-10 h-10 rounded-lg object-cover border border-rose-500/30"
            />
          </div>
          <div className="flex items-center justify-center gap-2 text-xs font-mono tracking-widest text-rose-500 uppercase">
            <Shield className="w-3.5 h-3.5" />
            <span>Staff Portal · Restricted Access</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            VELORA Manager Center
          </h1>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            {isSetupMode 
              ? 'Establish the initial Master Administrator credentials for this deployment.'
              : 'Sign in with your verified administrative credentials to manage operations.'}
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#0b0e14] border border-[#1a2230] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          {/* Status Notifications */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {needsInitialSetup && !isSetupMode && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex flex-col gap-2">
              <div className="flex items-center gap-2 font-medium">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Initial Deployment Detected</span>
              </div>
              <p className="text-[11px] text-amber-400/90">
                No administrator account has been provisioned yet. You can initialize your first master admin account now.
              </p>
              <button
                type="button"
                onClick={() => setIsSetupMode(true)}
                className="mt-1 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-500 py-1.5 px-3 rounded-lg text-left inline-flex items-center justify-between transition-colors"
              >
                <span>Launch Master Admin Setup</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isSetupMode && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Admin Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    placeholder="e.g. Master Administrator"
                    className="w-full bg-[#121620] border border-[#212b3c] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@velora.com"
                  className="w-full bg-[#121620] border border-[#212b3c] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-[#121620] border border-[#212b3c] rounded-xl pl-9 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSetupMode && (
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#121620] border border-[#212b3c] rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting || loading}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {submitting ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Authorization...</span>
                </>
              ) : isSetupMode ? (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Create Master Admin & Sign In</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate to Console</span>
                </>
              )}
            </button>
          </form>

          {isSetupMode && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsSetupMode(false)}
                className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
              >
                Already have an admin account? Return to Login
              </button>
            </div>
          )}

          {/* Security Notice */}
          <div className="pt-4 border-t border-[#18212e] text-[11px] text-slate-500 text-center leading-relaxed">
            All administrative logins are secured by Firebase Authentication & Firestore role verification with automatic session audit logging.
          </div>
        </div>

        {/* Back to Customer Facing Website */}
        <div className="mt-6 text-center">
          <button
            onClick={onBackToCustomerSite}
            className="text-xs text-slate-400 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            <span>← Return to VELORA Customer Platform</span>
          </button>
        </div>

      </div>
    </div>
  );
};
