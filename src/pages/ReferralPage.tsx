import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRAND_INFO } from '../data/mockData';
import { Users, Copy, Check, Share2, Award, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const ReferralPage: React.FC = () => {
  const { user, referrals, wallet, showToast, openAuthModal } = useApp();
  const [copied, setCopied] = useState<boolean>(false);

  const referralCode = user?.referralCode || 'VEL-INVITE';
  const getReferralUrl = () => {
    if (typeof window === 'undefined') return `https://velora.io/?ref=${referralCode}`;
    const cleanPath = window.location.pathname.replace(/\/+$/, '');
    return `${window.location.origin}${cleanPath}/?ref=${referralCode}`;
  };
  const referralLink = getReferralUrl();

  const totalReferrals = referrals.length;
  const activeReferrals = referrals.filter(r => r.status === 'Active').length;
  const totalEarned = wallet.totalReferralRewardsUSDT;

  const handleCopy = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(referralLink);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = referralLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
    setCopied(true);
    showToast('info', 'Link Copied', 'Referral link copied to clipboard.');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      
      {/* Title */}
      <div className="pb-6 border-b border-[#1b2332]">
        <div className="flex items-center gap-2 text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">
          <span>Affiliate & Partner Program</span>
          <span aria-hidden="true">·</span>
          <span>10% Direct Payout</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Referral Program
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
          Invite members to the VELORA platform. Whenever an invited user purchases an active computing product slot, 
          you receive a direct 10% referral reward credited straight to your available wallet balance.
        </p>
      </div>

      {/* Referral Link & Share Box */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Your Unique Referral Link</h2>
            <p className="text-xs text-slate-400">Share this link to automatically attribute registered participants.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-slate-400">Referral Code:</span>
            <span className="text-xs font-mono font-bold text-rose-400 bg-[#161c28] px-2.5 py-1 rounded border border-[#273247]">
              {referralCode}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
          <div className="w-full bg-[#121620] border border-[#222b3b] rounded-xl px-4 py-3 font-mono text-xs text-slate-200 select-all truncate">
            {referralLink}
          </div>
          <button
            onClick={handleCopy}
            className="w-full sm:w-auto px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Link Copied' : 'Copy Referral Link'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Row (No fake numbers, based on real state) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-[#0e1219] border border-[#1b2332] rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Referrals</span>
            <Users className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {totalReferrals}
          </p>
          <span className="text-[11px] text-slate-400">Registered with your code</span>
        </div>

        <div className="bg-[#0e1219] border border-[#1b2332] rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Referrals</span>
            <Award className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {activeReferrals}
          </p>
          <span className="text-[11px] text-slate-400">Holding active product nodes</span>
        </div>

        <div className="bg-[#0e1219] border border-[#1b2332] rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Referral Rewards</span>
            <span className="font-mono text-xs text-rose-400">10%</span>
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            +{totalEarned.toFixed(2)} USDT
          </p>
          <span className="text-[11px] text-slate-400">Credited to available wallet</span>
        </div>
      </div>

      {/* Referral History Table */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Referred Members & Contributions</h2>
          <span className="text-xs font-mono text-slate-400">{referrals.length} Total</span>
        </div>

        {referrals.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500">
            No referred users registered yet. Share your referral link above to start earning 10% rewards.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#1b2332] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">Member ID</th>
                  <th className="py-2.5 px-3">Name</th>
                  <th className="py-2.5 px-3">Joined Date</th>
                  <th className="py-2.5 px-3">Product Volume</th>
                  <th className="py-2.5 px-3">Your 10% Reward</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151c27] text-slate-300">
                {referrals.map(ref => (
                  <tr key={ref.id} className="hover:bg-[#121620] transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-200">{ref.userId}</td>
                    <td className="py-3 px-3 font-medium text-slate-100">{ref.userName}</td>
                    <td className="py-3 px-3 text-slate-400">{ref.joinedDate}</td>
                    <td className="py-3 px-3 font-mono tabular-nums">
                      {ref.totalContributedUSDT.toFixed(2)} USDT
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-rose-400 tabular-nums">
                      +{ref.commissionEarnedUSDT.toFixed(2)} USDT
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className={`font-mono text-xs ${ref.status === 'Active' ? 'text-emerald-400' : 'text-slate-500'}`}>
                        {ref.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
