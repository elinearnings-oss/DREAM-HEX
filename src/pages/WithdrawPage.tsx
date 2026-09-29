import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRAND_INFO } from '../data/mockData';
import { NetworkType } from '../types';
import { 
  ArrowUpFromLine, 
  Wallet, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  ArrowRight,
  Info
} from 'lucide-react';

export const WithdrawPage: React.FC = () => {
  const { wallet, requestWithdrawal, transactions, showToast, user, openAuthModal } = useApp();
  
  const [network, setNetwork] = useState<NetworkType>('BEP20');
  const [address, setAddress] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const numAmount = parseFloat(amount) || 0;
  const feePercent = BRAND_INFO.withdrawalFeePercent; // 0%
  const feeAmount = numAmount * (feePercent / 100);
  const finalAmount = Math.max(0, numAmount - feeAmount);

  const validateAddress = (addr: string, net: NetworkType): boolean => {
    const clean = addr.trim();
    if (net === 'BEP20') {
      return clean.startsWith('0x') && clean.length === 42;
    }
    if (net === 'TRC20') {
      return clean.startsWith('T') && clean.length >= 33 && clean.length <= 35;
    }
    return false;
  };

  const isAddressValid = address ? validateAddress(address, network) : true;

  const handlePreSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    if (numAmount < BRAND_INFO.minWithdrawalUSDT) {
      showToast('error', 'Minimum Withdrawal', `Minimum withdrawal is ${BRAND_INFO.minWithdrawalUSDT} USDT.`);
      return;
    }

    if (numAmount > wallet.availableUSDT) {
      showToast('error', 'Insufficient Available Balance', `You only have ${wallet.availableUSDT.toFixed(2)} USDT available.`);
      return;
    }

    if (!validateAddress(address, network)) {
      showToast('error', 'Invalid Wallet Address', `Please enter a valid ${network} address format.`);
      return;
    }

    setShowConfirmModal(true);
  };

  const handleExecuteWithdrawal = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const res = requestWithdrawal(numAmount, network, address.trim());
      setIsSubmitting(false);
      setShowConfirmModal(false);
      if (res.success) {
        setAmount('');
        setAddress('');
      }
    }, 600);
  };

  const withdrawalHistory = transactions.filter(t => t.type === 'Withdrawal');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#1b2332]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">
            <span>Transfer Funds Out</span>
            <span aria-hidden="true">·</span>
            <span>0% Network Fee</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Withdraw USDT
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Request an automated withdrawal to your personal BEP20 or TRC20 wallet. Zero fees applied.
          </p>
        </div>

        {/* Available Balance Header Widget */}
        <div className="p-3.5 bg-[#0e1219] border border-[#1f2737] rounded-xl flex items-center gap-3 shrink-0">
          <Wallet className="w-4 h-4 text-rose-500 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-400 block">Available to Withdraw</span>
            <span className="text-base font-bold font-mono tabular-nums text-white">
              {wallet.availableUSDT.toFixed(2)} USDT
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Withdrawal Form */}
        <div className="lg:col-span-7 bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-8 space-y-6">
          
          <form onSubmit={handlePreSubmit} className="space-y-5">
            
            {/* 1. Network Selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-2">
                1. Select Destination Protocol
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setNetwork('BEP20')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    network === 'BEP20'
                      ? 'bg-rose-950/20 border-rose-500 text-white'
                      : 'bg-[#121620] border-[#222b3b] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">BNB Smart Chain</span>
                    <span className="text-xs font-mono text-rose-400">BEP20</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">Fee: 0%</span>
                </button>

                <button
                  type="button"
                  onClick={() => setNetwork('TRC20')}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    network === 'TRC20'
                      ? 'bg-rose-950/20 border-rose-500 text-white'
                      : 'bg-[#121620] border-[#222b3b] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">TRON</span>
                    <span className="text-xs font-mono text-rose-400">TRC20</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block mt-1">Fee: 0%</span>
                </button>
              </div>
            </div>

            {/* 2. Destination Address */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                2. Recipient Wallet Address ({network})
              </label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                placeholder={network === 'BEP20' ? '0x...' : 'T...'}
                className={`w-full bg-[#121620] border rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none transition-colors ${
                  !isAddressValid && address 
                    ? 'border-rose-500 focus:ring-1 focus:ring-rose-500' 
                    : 'border-[#222b3b] focus:border-rose-500'
                }`}
                required
              />
              {!isAddressValid && address && (
                <p className="text-[11px] text-rose-400 mt-1">
                  {network === 'BEP20' 
                    ? 'Address must begin with 0x and be 42 characters in length.' 
                    : 'Address must begin with "T" and be 34 characters in length.'}
                </p>
              )}
            </div>

            {/* 3. Amount */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  3. Withdrawal Amount
                </label>
                <button
                  type="button"
                  onClick={() => setAmount(wallet.availableUSDT.toString())}
                  className="text-xs text-rose-400 hover:text-rose-300 font-mono transition-colors"
                >
                  Max Available: {wallet.availableUSDT.toFixed(2)} USDT
                </button>
              </div>

              <div className="relative">
                <input
                  type="number"
                  min={BRAND_INFO.minWithdrawalUSDT}
                  step="any"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder={`Min ${BRAND_INFO.minWithdrawalUSDT} USDT`}
                  className="w-full bg-[#121620] border border-[#222b3b] rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 font-mono focus:outline-none focus:border-rose-500"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  USDT
                </span>
              </div>
            </div>

            {/* Calculations Breakdown */}
            <div className="p-4 bg-[#121620] border border-[#1f2738] rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Requested Amount:</span>
                <span className="font-mono text-slate-200">{numAmount.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Withdrawal Fee (0%):</span>
                <span className="font-mono text-emerald-400">0.00 USDT</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#1c2434] font-semibold">
                <span className="text-slate-200">You Will Receive:</span>
                <span className="font-mono text-white text-sm">{finalAmount.toFixed(2)} USDT</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={numAmount < BRAND_INFO.minWithdrawalUSDT || numAmount > wallet.availableUSDT || !address}
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-950/40 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <ArrowUpFromLine className="w-4 h-4" />
              <span>Review Withdrawal</span>
            </button>

          </form>

        </div>

        {/* Right: Withdrawal Policies & Security */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <span>Withdrawal Terms & Rules</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <div className="p-3 bg-[#121620] border border-[#1f2738] rounded-xl space-y-2 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Minimum Withdrawal:</span>
                  <span className="font-mono text-slate-200 font-semibold">{BRAND_INFO.minWithdrawalUSDT} USDT</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing Fee:</span>
                  <span className="font-mono text-emerald-400 font-semibold">0% (Completely Free)</span>
                </div>
                <div className="flex justify-between">
                  <span>Settlement Time:</span>
                  <span className="font-mono text-slate-200">Immediate / 5-15 mins</span>
                </div>
                <div className="flex justify-between">
                  <span>Account Requirements:</span>
                  <span className="font-mono text-slate-200">Active & Age 18+</span>
                </div>
              </div>

              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-[11px] text-rose-300">
                Double-check your recipient wallet address. Blockchain transfers are irreversible. 
                Ensure your wallet supports USDT on the chosen network.
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0f131a] border border-[#232c3c] rounded-xl p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-1">Confirm Withdrawal Request</h3>
            <p className="text-xs text-slate-400 mb-4">
              Please review all transfer details carefully before dispatching funds.
            </p>

            <div className="bg-[#141a24] border border-[#222c3e] rounded-lg p-4 space-y-2 text-xs mb-5 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Network:</span>
                <span className="text-rose-400 font-bold">{network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Amount:</span>
                <span className="text-white font-bold">{numAmount.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Fee:</span>
                <span className="text-emerald-400">0.00 USDT (0%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 font-sans">Final Payout:</span>
                <span className="text-white font-bold">{finalAmount.toFixed(2)} USDT</span>
              </div>
              <div className="pt-2 border-t border-[#1e2637]">
                <span className="text-slate-400 font-sans block mb-1">Destination Address:</span>
                <span className="text-[11px] text-slate-300 break-all">{address}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Back / Edit
              </button>
              <button
                onClick={handleExecuteWithdrawal}
                disabled={isSubmitting}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                {isSubmitting ? 'Processing...' : 'Confirm & Send'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Withdrawal History */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-white">Recent Withdrawal History</h3>
        
        {withdrawalHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No withdrawal requests logged yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#1b2332] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">Tx ID</th>
                  <th className="py-2.5 px-3">Network</th>
                  <th className="py-2.5 px-3">Address</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151c27] text-slate-300">
                {withdrawalHistory.map(tx => (
                  <tr key={tx.id} className="hover:bg-[#121620] transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-200">{tx.id}</td>
                    <td className="py-3 px-3 font-mono">{tx.network || 'BEP20'}</td>
                    <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                      {tx.walletAddress ? `${tx.walletAddress.slice(0, 6)}...${tx.walletAddress.slice(-4)}` : 'External'}
                    </td>
                    <td className="py-3 px-3 font-mono font-semibold text-rose-400 tabular-nums">
                      -{tx.amount.toFixed(2)} USDT
                    </td>
                    <td className="py-3 px-3 text-slate-400">
                      {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="font-mono text-emerald-400 font-medium">
                        {tx.status}
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
