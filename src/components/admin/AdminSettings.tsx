import React, { useEffect, useState } from 'react';
import { 
  Settings, 
  Save, 
  CheckCircle2, 
  RefreshCw, 
  AlertCircle, 
  Shield, 
  Mail, 
  Phone, 
  Send, 
  DollarSign, 
  Percent,
  Sliders
} from 'lucide-react';
import { PlatformSettingsRecord } from '../../types/admin';
import { getPlatformSettings, updatePlatformSettings } from '../../lib/adminService';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { brandLogo } from '../../assets/images';

export const AdminSettings: React.FC = () => {
  const { admin } = useAdminAuth();
  const [settings, setSettings] = useState<PlatformSettingsRecord | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form fields
  const [brandName, setBrandName] = useState('');
  const [tagline, setTagline] = useState('');
  const [supportEmail, setSupportEmail] = useState('');
  const [supportHours, setSupportHours] = useState('');
  const [contactTelegram, setContactTelegram] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [businessAddress, setBusinessAddress] = useState('');
  const [minDepositUSDT, setMinDepositUSDT] = useState<number>(3);
  const [minWithdrawalUSDT, setMinWithdrawalUSDT] = useState<number>(0.5);
  const [productRewardRate, setProductRewardRate] = useState<number>(0.05);
  const [referralRewardRate, setReferralRewardRate] = useState<number>(0.10);
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [allowNewRegistrations, setAllowNewRegistrations] = useState<boolean>(true);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await getPlatformSettings();
      setSettings(data);
      setBrandName(data.brandName);
      setTagline(data.tagline);
      setSupportEmail(data.supportEmail);
      setSupportHours(data.supportHours);
      setContactTelegram(data.contactTelegram);
      setContactPhone(data.contactPhone);
      setBusinessAddress(data.businessAddress);
      setMinDepositUSDT(data.minDepositUSDT);
      setMinWithdrawalUSDT(data.minWithdrawalUSDT);
      setProductRewardRate(data.productRewardRate);
      setReferralRewardRate(data.referralRewardRate);
      setMaintenanceMode(data.maintenanceMode);
      setAllowNewRegistrations(data.allowNewRegistrations);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload: Partial<PlatformSettingsRecord> = {
      brandName: brandName.trim(),
      tagline: tagline.trim(),
      supportEmail: supportEmail.trim(),
      supportHours: supportHours.trim(),
      contactTelegram: contactTelegram.trim(),
      contactPhone: contactPhone.trim(),
      businessAddress: businessAddress.trim(),
      minDepositUSDT: Number(minDepositUSDT),
      minWithdrawalUSDT: Number(minWithdrawalUSDT),
      productRewardRate: Number(productRewardRate),
      referralRewardRate: Number(referralRewardRate),
      maintenanceMode,
      allowNewRegistrations
    };

    const success = await updatePlatformSettings(payload, admin?.email || 'admin@velora.io');
    setSaving(false);

    if (success) {
      setToastMessage('Platform system parameters updated in Firestore.');
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Sliders className="w-6 h-6 text-rose-500" />
            <span>Platform Configuration & Global Invariants</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure platform branding, official communication endpoints, payment minimums, and yield percentages.
          </p>
        </div>

        <button
          onClick={loadSettings}
          disabled={loading}
          className="px-3 py-1.5 bg-[#121620] hover:bg-[#181e2b] border border-[#232c3c] text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin text-rose-500' : ''}`} />
          <span>Reload Settings</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* SECTION 1: BRAND IDENTITY & LOGO */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Shield className="w-4 h-4 text-rose-500" />
            <span>Brand Identity</span>
          </h3>

          <div className="flex flex-col sm:flex-row sm:items-center gap-5 p-4 bg-[#11151e] border border-[#1e2637] rounded-xl">
            <div className="relative">
              <img 
                src={brandLogo} 
                alt="Brand Logo" 
                className="w-16 h-16 rounded-xl object-cover border border-rose-500/40 shadow-lg"
              />
            </div>
            <div className="text-xs space-y-1">
              <span className="font-bold text-white text-sm block">Active Logo Asset</span>
              <p className="text-slate-400">
                Official red geometric brand icon utilized across customer interface and admin headers.
              </p>
              <span className="font-mono text-[10px] text-slate-500">Asset format: High-res JPG / PNG</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Platform Brand Name</label>
              <input
                type="text"
                required
                value={brandName}
                onChange={e => setBrandName(e.target.value)}
                className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Official Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={e => setTagline(e.target.value)}
                className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: OFFICIAL CHANNELS & SUPPORT */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Mail className="w-4 h-4 text-cyan-400" />
            <span>Support & Communications</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Support Email</label>
              <input
                type="email"
                required
                value={supportEmail}
                onChange={e => setSupportEmail(e.target.value)}
                className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Support Operating Hours</label>
              <input
                type="text"
                value={supportHours}
                onChange={e => setSupportHours(e.target.value)}
                className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Official Telegram</label>
              <input
                type="text"
                value={contactTelegram}
                onChange={e => setContactTelegram(e.target.value)}
                className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Contact Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={e => setContactPhone(e.target.value)}
                className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-medium mb-1">Corporate / Registered Address</label>
              <input
                type="text"
                value={businessAddress}
                onChange={e => setBusinessAddress(e.target.value)}
                className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: GATEWAY & INVARIANTS */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span>Financial Thresholds & Reward Invariants</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Min Deposit (USDT)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={minDepositUSDT}
                onChange={e => setMinDepositUSDT(parseFloat(e.target.value) || 3)}
                className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Standard: 3 USDT</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Min Withdrawal (USDT)</label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={minWithdrawalUSDT}
                onChange={e => setMinWithdrawalUSDT(parseFloat(e.target.value) || 0.5)}
                className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Standard: 0.5 USDT</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Product 24h Rate</label>
              <input
                type="number"
                min="0.01"
                max="0.5"
                step="0.01"
                required
                value={productRewardRate}
                onChange={e => setProductRewardRate(parseFloat(e.target.value) || 0.05)}
                className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">0.05 = 5% per cycle</span>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Referral Commission</label>
              <input
                type="number"
                min="0.01"
                max="0.5"
                step="0.01"
                required
                value={referralRewardRate}
                onChange={e => setReferralRewardRate(parseFloat(e.target.value) || 0.10)}
                className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">0.10 = 10% direct</span>
            </div>
          </div>
        </div>

        {/* SECTION 4: TOGGLES */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">System Flags & Guardrails</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            
            <div className="p-4 bg-[#11151e] border border-[#1e2637] rounded-xl flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Allow New Registrations</span>
                <span className="text-[11px] text-slate-400">Permit prospective customers to create accounts.</span>
              </div>
              <input
                type="checkbox"
                checked={allowNewRegistrations}
                onChange={e => setAllowNewRegistrations(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-[#121620] border-[#212b3c]"
              />
            </div>

            <div className="p-4 bg-[#11151e] border border-[#1e2637] rounded-xl flex items-center justify-between">
              <div>
                <span className="font-semibold text-white block">Platform Maintenance Mode</span>
                <span className="text-[11px] text-slate-400">Display maintenance advisory on customer endpoints.</span>
              </div>
              <input
                type="checkbox"
                checked={maintenanceMode}
                onChange={e => setMaintenanceMode(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 bg-[#121620] border-[#212b3c]"
              />
            </div>

          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-500 disabled:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-lg shadow-rose-950/40 transition-all flex items-center gap-2"
          >
            {saving ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            <span>Save Platform Settings</span>
          </button>
        </div>

      </form>

    </div>
  );
};
