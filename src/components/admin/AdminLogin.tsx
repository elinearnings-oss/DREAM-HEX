import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  Shield, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  User, 
  KeyRound, 
  ArrowRight,
  LogOut,
  Sparkles,
  Info,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { brandLogo } from '../../assets/images';

interface AdminLoginProps {
  onBackToCustomerSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToCustomerSite }) => {
  const { 
    firebaseUser,
    isMasterLockPresent,
    isEligibleForMasterSetup,
    unauthorizedUser,
    authError,
    isEmailPasswordDisabled,
    loginWithGoogle,
    loginWithEmail,
    registerMasterAdminWithEmail,
    claimMasterAdmin,
    logout,
    clearError
  } = useAdminAuth();

  // Mode: 'login' or 'register_master'
  const [mode, setMode] = useState<'login' | 'register_master'>(() => {
    return !isMasterLockPresent ? 'register_master' : 'login';
  });

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [localError, setLocalError] = useState<string | null>(null);
  const [submittingGoogle, setSubmittingGoogle] = useState(false);
  const [submittingEmail, setSubmittingEmail] = useState(false);
  const [submittingClaim, setSubmittingClaim] = useState(false);

  const activeError = localError || authError;

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearError();
    setSubmittingGoogle(true);
    const res = await loginWithGoogle();
    setSubmittingGoogle(false);
    if (!res.success) {
      setLocalError(res.error || 'Google authentication failed.');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!email.trim() || !password.trim()) {
      setLocalError('Please provide both administrative email and password.');
      return;
    }

    if (mode === 'register_master') {
      if (password.length < 8) {
        setLocalError('Security policy requires admin password to be at least 8 characters.');
        return;
      }
      if (password !== confirmPassword) {
        setLocalError('Passwords do not match. Please re-enter.');
        return;
      }

      setSubmittingEmail(true);
      const res = await registerMasterAdminWithEmail(
        email.trim(), 
        password, 
        displayName.trim() || 'Master Administrator'
      );
      setSubmittingEmail(false);
      if (!res.success) {
        setLocalError(res.error || 'Failed to establish master admin account.');
      }
      return;
    }

    // Standard Login
    setSubmittingEmail(true);
    const res = await loginWithEmail(email.trim(), password);
    setSubmittingEmail(false);
    if (!res.success) {
      setLocalError(res.error || 'Invalid credentials or unauthorized account.');
    }
  };

  const handleClaimMasterAdmin = async () => {
    setLocalError(null);
    clearError();
    setSubmittingClaim(true);
    const res = await claimMasterAdmin(displayName.trim() || undefined);
    setSubmittingClaim(false);
    if (!res.success) {
      setLocalError(res.error || 'Failed to claim Master Administrator role.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07090d] flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden font-sans selection:bg-rose-500/20 selection:text-rose-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-rose-950/20 rounded-full blur-2xl pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        
        {/* Top Brand Banner */}
        <div className="text-center mb-6 space-y-2">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-[#0f141f] border border-[#1f293d] shadow-xl mb-1">
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
            Administrative console for user verification, yield cycles, deposits, withdrawals, and support.
          </p>
        </div>

        {/* Card Container */}
        <div className="bg-[#0b0e14] border border-[#1a2230] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-5">
          
          {/* STATE 1: Authenticated, but not an admin in Firestore (Access Denied) */}
          {unauthorizedUser && (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-rose-600/20 text-rose-400 mx-auto flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Administrative Authorization Required</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You are signed in as <strong className="text-slate-200">{unauthorizedUser.email}</strong>, but this account has not been designated as an Administrator or Manager in Cloud Firestore.
                </p>
              </div>
              <div className="p-3 bg-[#11151f] rounded-xl border border-[#1d2638] text-[11px] text-slate-400 text-left space-y-1">
                <span className="text-slate-300 font-semibold block">Need access?</span>
                <p>Contact the platform Master Administrator to grant your UID (<code>{unauthorizedUser.uid.slice(0, 10)}...</code>) administrator permissions.</p>
              </div>
              <div className="pt-2 flex flex-col gap-2">
                <button
                  onClick={logout}
                  className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out & Switch Account</span>
                </button>
                <button
                  onClick={onBackToCustomerSite}
                  className="w-full py-2 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Return to Customer Platform
                </button>
              </div>
            </div>
          )}

          {/* STATE 2: Authenticated via Firebase Auth, and eligible to establish Master Admin */}
          {!unauthorizedUser && isEligibleForMasterSetup && firebaseUser && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold">
                  <KeyRound className="w-4 h-4 text-amber-400" />
                  <span>Establish Master Administrator</span>
                </div>
                <p className="text-[11px] text-amber-400/90 leading-relaxed">
                  Authenticated as <strong className="text-white">{firebaseUser.email}</strong>. No Master Administrator has been established yet. Click below to grant this account master administrative privileges.
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Display / Administrator Name (Optional)
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  placeholder={firebaseUser.displayName || 'Master Administrator'}
                  className="w-full bg-[#121620] border border-[#212b3c] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              {activeError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{activeError}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleClaimMasterAdmin}
                disabled={submittingClaim}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2"
              >
                {submittingClaim ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Establishing Master Admin in Database...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Confirm & Enter Admin Console</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={logout}
                  className="text-xs text-slate-500 hover:text-slate-300 inline-flex items-center gap-1.5"
                >
                  <LogOut className="w-3 h-3" />
                  <span>Sign out & use a different account</span>
                </button>
              </div>
            </div>
          )}

          {/* STATE 3: Unauthenticated - Standard Login & Setup Form */}
          {!unauthorizedUser && !isEligibleForMasterSetup && (
            <div className="space-y-4">
              
              {/* First-time setup banner if no master admin exists yet */}
              {!isMasterLockPresent && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 space-y-1">
                  <div className="flex items-center gap-2 font-semibold">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    <span>Initial Master Setup</span>
                  </div>
                  <p className="text-[11px] text-rose-300/90 leading-relaxed">
                    Sign in with your Google account or provide email credentials below to establish the first Master Administrator.
                  </p>
                </div>
              )}

              {/* ACTIONABLE ERROR BANNER */}
              {activeError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 space-y-1.5">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{activeError}</span>
                  </div>
                  {isEmailPasswordDisabled && (
                    <div className="p-2.5 bg-black/40 rounded-lg border border-rose-500/20 text-[11px] text-slate-300 space-y-1">
                      <strong className="text-white block">Action Required for Email/Password:</strong>
                      <p>Google sign-in is already active on this project. Click <strong>"Continue with Google"</strong> below for instant access.</p>
                      <p className="text-slate-400">To enable Email/Password: Open Firebase Console → Authentication → Sign-in method → Enable "Email/Password".</p>
                    </div>
                  )}
                </div>
              )}

              {/* PRIMARY METHOD: CONTINUE WITH GOOGLE (Enabled by Default) */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={submittingGoogle || submittingEmail}
                  className="w-full py-2.5 px-4 bg-[#141a24] hover:bg-[#1c2433] border border-[#273347] hover:border-slate-500 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center justify-center gap-3 group"
                >
                  {submittingGoogle ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
                      <span>Authenticating with Google...</span>
                    </>
                  ) : (
                    <>
                      {/* Google G Multi-Color SVG Icon */}
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span>Continue with Google</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active Provider
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* SEPARATOR */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#1b2332] w-full" />
                <span className="bg-[#0b0e14] px-3 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                  or use email
                </span>
                <div className="border-t border-[#1b2332] w-full" />
              </div>

              {/* EMAIL & PASSWORD FORM */}
              <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                
                {mode === 'register_master' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Administrator Name
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
                        className="w-full bg-[#121620] border border-[#212b3c] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Administrative Email
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
                      className="w-full bg-[#121620] border border-[#212b3c] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
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
                      className="w-full bg-[#121620] border border-[#212b3c] rounded-xl pl-9 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
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

                {mode === 'register_master' && (
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
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
                        className="w-full bg-[#121620] border border-[#212b3c] rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submittingEmail || submittingGoogle}
                  className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-950/50 transition-all flex items-center justify-center gap-2 mt-2"
                >
                  {submittingEmail ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Verifying Authentication...</span>
                    </>
                  ) : mode === 'register_master' ? (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Create Master Admin via Email</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Authenticate to Console</span>
                    </>
                  )}
                </button>
              </form>

              {/* Mode Switcher Toggle */}
              <div className="pt-2 text-center">
                {!isMasterLockPresent && mode === 'register_master' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login');
                      setLocalError(null);
                      clearError();
                    }}
                    className="text-[11px] text-slate-400 hover:text-white transition-colors"
                  >
                    Already created an admin account? Switch to Standard Login
                  </button>
                )}

                {!isMasterLockPresent && mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register_master');
                      setLocalError(null);
                      clearError();
                    }}
                    className="text-[11px] text-rose-400 hover:text-rose-300 font-medium transition-colors"
                  >
                    Switch to First-Time Master Admin Setup
                  </button>
                )}
              </div>

            </div>
          )}

          {/* Security Notice */}
          <div className="pt-3 border-t border-[#18212e] text-[11px] text-slate-500 text-center leading-relaxed">
            Secured via Firebase Authentication & Cloud Firestore RBAC rules.
          </div>

        </div>

        {/* Back to Customer Facing Website */}
        <div className="mt-5 text-center">
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
