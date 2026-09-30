import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  Shield, 
  AlertCircle, 
  LogOut, 
  Sparkles, 
  RefreshCw,
  ExternalLink,
  Lock,
  KeyRound,
  CheckCircle2,
  Copy,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { brandLogo } from '../../assets/images';

interface AdminLoginProps {
  onBackToCustomerSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBackToCustomerSite }) => {
  const { 
    isMasterLockPresent,
    unauthorizedUser,
    authError,
    loginWithGoogle,
    loginWithMasterKey,
    logout,
    clearError
  } = useAdminAuth();

  const [localError, setLocalError] = useState<string | null>(null);
  const [submittingGoogle, setSubmittingGoogle] = useState(false);
  
  // Master Key Fallback
  const [showKeyAccess, setShowKeyAccess] = useState(false);
  const [masterKey, setMasterKey] = useState('');
  const [adminName, setAdminName] = useState('');
  const [submittingKey, setSubmittingKey] = useState(false);
  const [copiedDomain, setCopiedDomain] = useState(false);

  const activeError = localError || authError;
  const currentHostname = typeof window !== 'undefined' ? window.location.hostname : 'github.io';
  const isDomainError = activeError?.includes('unauthorized-domain') || activeError?.includes('Authorized Domains');

  const handleGoogleSignIn = async () => {
    setLocalError(null);
    clearError();
    setSubmittingGoogle(true);
    const res = await loginWithGoogle();
    setSubmittingGoogle(false);
    if (!res.success) {
      setLocalError(res.error || 'Google authentication failed.');
      if (res.error?.includes('unauthorized-domain')) {
        setShowKeyAccess(true);
      }
    }
  };

  const handleMasterKeySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    if (!masterKey.trim()) {
      setLocalError('Please enter the Master Access Key.');
      return;
    }

    setSubmittingKey(true);
    const res = await loginWithMasterKey(masterKey.trim(), adminName.trim() || undefined);
    setSubmittingKey(false);
    if (!res.success) {
      setLocalError(res.error || 'Invalid Master Access Key.');
    }
  };

  const handleCopyDomain = () => {
    try {
      navigator.clipboard.writeText(currentHostname);
      setCopiedDomain(true);
      setTimeout(() => setCopiedDomain(false), 2500);
    } catch {}
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
          {unauthorizedUser ? (
            <div className="space-y-4 text-center py-2">
              <div className="w-12 h-12 rounded-full bg-rose-600/20 text-rose-400 mx-auto flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-white">Administrative Authorization Required</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  You are signed in as <strong className="text-slate-200">{unauthorizedUser.email}</strong>, but this account has not been designated as an Administrator in Cloud Firestore.
                </p>
              </div>
              <div className="p-3 bg-[#11151f] rounded-xl border border-[#1d2638] text-[11px] text-slate-400 text-left space-y-1">
                <span className="text-slate-300 font-semibold block">Need access?</span>
                <p>Contact the platform Master Administrator to grant your account administrative permissions in the Firestore database.</p>
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
          ) : (
            <div className="space-y-5">
              
              {/* Initial setup prompt if no master admin exists yet */}
              {!isMasterLockPresent && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold">
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    <span>Master Admin Access</span>
                  </div>
                  <p className="text-[11px] text-rose-300/90 leading-relaxed">
                    Click <strong>"Continue with Google"</strong> or use the <strong>Master Access Key</strong> below to enter the VELORA Manager Center.
                  </p>
                </div>
              )}

              {/* SPECIFIC UNAUTHORIZED DOMAIN GUIDE BOX */}
              {isDomainError && (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-white block font-semibold">Firebase Domain Authorization Required</strong>
                      <span className="text-[11px] text-amber-300/90 leading-relaxed">
                        Firebase blocks Google sign-in on domains not listed in its authorized list.
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 bg-black/40 rounded-lg border border-amber-500/20 text-[11px] space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-slate-400">Current Domain:</span>
                      <div className="flex items-center gap-1.5">
                        <code className="text-white bg-slate-900 px-2 py-0.5 rounded text-[11px] font-mono border border-slate-700">
                          {currentHostname}
                        </code>
                        <button
                          type="button"
                          onClick={handleCopyDomain}
                          className="px-2 py-0.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-[10px] font-medium transition-colors flex items-center gap-1"
                        >
                          {copiedDomain ? <CheckCircle2 className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedDomain ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                    </div>
                    <div className="text-slate-300 text-[11px] leading-relaxed pt-1 border-t border-amber-500/20 space-y-1">
                      <p className="font-semibold text-white">How to authorize in 30 seconds:</p>
                      <ol className="list-decimal pl-4 space-y-0.5 text-slate-300">
                        <li>Open Firebase Console → <strong>Authentication</strong></li>
                        <li>Click the <strong>Settings</strong> tab (5th tab next to Usage)</li>
                        <li>Scroll down to <strong>Authorized domains</strong></li>
                        <li>Click <strong>Add domain</strong> and paste <code>{currentHostname}</code></li>
                      </ol>
                    </div>
                  </div>

                  <div className="text-[11px] text-amber-400 font-medium">
                    ⚡ <strong>Instant alternative:</strong> Use the Master Key option below to login immediately without changing Firebase settings!
                  </div>
                </div>
              )}

              {/* General active error banner */}
              {activeError && !isDomainError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/25 text-xs text-rose-300 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{activeError}</span>
                </div>
              )}

              {/* PRIMARY GOOGLE SIGN-IN BUTTON */}
              <div>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={submittingGoogle || submittingKey}
                  className="w-full py-3.5 px-4 bg-[#141a24] hover:bg-[#1a2332] active:bg-[#111620] border border-[#2b384e] hover:border-rose-500/50 text-white text-xs font-semibold rounded-xl shadow-lg transition-all flex items-center justify-center gap-3 cursor-pointer group disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {submittingGoogle ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin text-rose-500" />
                      <span>Authenticating with Google...</span>
                    </>
                  ) : (
                    <>
                      {/* Multi-Color Google G SVG */}
                      <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                      <span className="text-sm font-medium">Continue with Google</span>
                    </>
                  )}
                </button>
              </div>

              {/* SEPARATOR */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-[#1b2332] w-full" />
                <span className="bg-[#0b0e14] px-3 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                  OR
                </span>
                <div className="border-t border-[#1b2332] w-full" />
              </div>

              {/* MASTER PASSCODE ACCORDION / TOGGLE */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowKeyAccess(!showKeyAccess)}
                  className="w-full py-2.5 px-3 rounded-xl bg-[#10141d] hover:bg-[#161c28] border border-[#20293a] text-xs text-slate-300 font-medium transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <KeyRound className="w-3.5 h-3.5 text-rose-500" />
                    <span>Emergency Master Key Access</span>
                  </div>
                  {showKeyAccess ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {showKeyAccess && (
                  <form onSubmit={handleMasterKeySubmit} className="mt-3 p-3.5 bg-[#0e121a] rounded-xl border border-[#1f2838] space-y-3">
                    <div className="text-[11px] text-slate-400">
                      Enter the deployment master passcode for instant console authorization:
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Master Passcode
                      </label>
                      <input
                        type="password"
                        required
                        value={masterKey}
                        onChange={e => setMasterKey(e.target.value)}
                        placeholder="Enter VELORA-2026"
                        className="w-full bg-[#121620] border border-[#212b3c] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                      />
                      <div className="text-[10px] text-slate-500 mt-1">
                        Default master key: <code className="text-rose-400 font-mono">VELORA-2026</code>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-slate-300 mb-1">
                        Administrator Name (Optional)
                      </label>
                      <input
                        type="text"
                        value={adminName}
                        onChange={e => setAdminName(e.target.value)}
                        placeholder="e.g. Master Administrator"
                        className="w-full bg-[#121620] border border-[#212b3c] rounded-lg px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingKey}
                      className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white text-xs font-semibold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
                    >
                      {submittingKey ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Verifying Passcode...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-3.5 h-3.5" />
                          <span>Authorize via Master Key</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>

            </div>
          )}

          {/* Security Notice */}
          <div className="pt-2 border-t border-[#18212e] text-[11px] text-slate-500 text-center leading-relaxed">
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
