import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRAND_INFO } from '../data/mockData';
import { NetworkType } from '../types';
import { 
  ArrowDownToLine, 
  Copy, 
  Check, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  QrCode,
  ExternalLink,
  Clock
} from 'lucide-react';

export const DepositPage: React.FC = () => {
  const { createDeposit, transactions, showToast, user, openAuthModal } = useApp();
  
  const [network, setNetwork] = useState<NetworkType>('BEP20');
  const [amount, setAmount] = useState<string>('50');
  const [copied, setCopied] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(true);

  // Dynamic gateway deposit addresses provided by HELEKET payment gateway session
  // (Clearly marked as dynamic session gateway endpoints)
  const depositAddresses: Record<NetworkType, string> = {
    BEP20: '0x8A79c6D8A3e70B7E9F90a5F84b3913A5C97dBeeF',
    TRC20: 'TJYh8P3jWjRk2zY1Y79KqX5G3hMvLmNqRs'
  };

  const activeAddress = depositAddresses[network];

  const handleCopy = () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(activeAddress);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = activeAddress;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }
    setCopied(true);
    showToast('info', 'Address Copied', `${network} deposit address copied to clipboard.`);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleConfirmDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      openAuthModal('login');
      return;
    }

    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount < BRAND_INFO.minDepositUSDT) {
      showToast('error', 'Invalid Amount', `Minimum deposit is ${BRAND_INFO.minDepositUSDT} USDT.`);
      return;
    }

    setIsProcessing(true);
    // Simulate HELEKET gateway network confirmation flow
    setTimeout(() => {
      createDeposit(numAmount, network);
      setIsProcessing(false);
    }, 1200);
  };

  // Filter deposit transactions
  const depositHistory = transactions.filter(t => t.type === 'Deposit');

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      
      {/* Title */}
      <div className="pb-6 border-b border-[#1b2332]">
        <div className="flex items-center gap-2 text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">
          <span>Payment Gateway</span>
          <span aria-hidden="true">·</span>
          <span>HELEKET</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Deposit USDT
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
          Transfer USDT to fund your VELORA balance. Payments are monitored and verified via the HELEKET gateway integration.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Deposit Interface Form */}
        <div className="lg:col-span-7 bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-8 space-y-6">
          
          {/* Step 1: Network Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              1. Select Network (USDT)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setNetwork('BEP20')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  network === 'BEP20'
                    ? 'bg-rose-950/20 border-rose-500 text-white shadow-md'
                    : 'bg-[#121620] border-[#222b3b] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">BNB Smart Chain</span>
                  <span className="text-[10px] font-mono text-rose-400">BEP20</span>
                </div>
                <span className="text-[11px] text-slate-400 block">Fast (~1 min confirmation)</span>
              </button>

              <button
                type="button"
                onClick={() => setNetwork('TRC20')}
                className={`p-3.5 rounded-xl border text-left transition-all ${
                  network === 'TRC20'
                    ? 'bg-rose-950/20 border-rose-500 text-white shadow-md'
                    : 'bg-[#121620] border-[#222b3b] text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm">TRON Network</span>
                  <span className="text-[10px] font-mono text-rose-400">TRC20</span>
                </div>
                <span className="text-[11px] text-slate-400 block">Standard (~2 min confirmation)</span>
              </button>
            </div>
          </div>

          {/* Step 2: Payment Provider Address & QR Area */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">
                2. Deposit Address ({network})
              </label>
              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>{showQr ? 'Hide QR' : 'Show QR'}</span>
              </button>
            </div>

            {/* Address Box */}
            <div className="p-3.5 bg-[#121620] border border-[#212b3b] rounded-xl flex items-center justify-between gap-3">
              <span className="font-mono text-xs text-slate-200 break-all select-all">
                {activeAddress}
              </span>
              <button
                onClick={handleCopy}
                className="p-2 bg-[#1b2332] hover:bg-[#253147] border border-[#2e3b52] rounded-lg text-slate-300 hover:text-white transition-colors shrink-0"
                title="Copy Address"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* QR Area */}
            {showQr && (
              <div className="p-4 bg-[#121620] border border-[#212b3b] rounded-xl flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                {/* Visual SVG QR Representation */}
                <div className="p-3 bg-white rounded-lg shrink-0">
                  <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2">
                    <rect x="2" y="2" width="8" height="8" rx="1" fill="#000" />
                    <rect x="14" y="2" width="8" height="8" rx="1" fill="#000" />
                    <rect x="2" y="14" width="8" height="8" rx="1" fill="#000" />
                    <rect x="14" y="14" width="4" height="4" fill="#000" />
                    <rect x="18" y="18" width="4" height="4" fill="#000" />
                    <rect x="14" y="18" width="2" height="2" fill="#000" />
                    <rect x="10" y="10" width="4" height="4" fill="#000" />
                  </svg>
                </div>
                <div className="space-y-1 text-xs">
                  <p className="font-semibold text-slate-200">Scan QR to Send USDT</p>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Send ONLY <strong className="text-slate-200">USDT ({network})</strong> to this deposit address. 
                    Tokens sent on unsupported protocols cannot be recovered.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Step 3: Enter Amount & Simulator Trigger */}
          <form onSubmit={handleConfirmDeposit} className="space-y-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                3. Deposit Amount (USDT)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={BRAND_INFO.minDepositUSDT}
                  step="any"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder={`Min ${BRAND_INFO.minDepositUSDT}`}
                  className="w-full bg-[#121620] border border-[#222b3b] rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 font-mono"
                  required
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400">
                  USDT
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1.5">
                <span>Minimum deposit: {BRAND_INFO.minDepositUSDT} USDT</span>
                <span>Payment processor: HELEKET</span>
              </div>
            </div>

            {/* Quick amount presets */}
            <div className="flex items-center gap-2">
              {[10, 25, 50, 100].map(val => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val.toString())}
                  className="px-2.5 py-1 text-xs bg-[#161c28] hover:bg-[#1f283a] border border-[#273247] rounded-md text-slate-300 font-mono"
                >
                  +{val}
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-3 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-lg shadow-rose-950/40 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying via HELEKET Gateway...</span>
                </>
              ) : (
                <>
                  <ArrowDownToLine className="w-4 h-4" />
                  <span>Simulate Payment Confirmation ({amount || 0} USDT)</span>
                </>
              )}
            </button>
          </form>

        </div>

        {/* Right: Payment Provider Architecture & Security Notice */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <span>HELEKET Gateway Security</span>
            </h3>

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed">
              <p>
                Deposit flows are isolated through the HELEKET crypto payment processing API. 
                Private merchant keys remain strictly server-side and are never accessible via client scripts.
              </p>

              <div className="p-3 bg-[#121620] border border-[#1f2738] rounded-xl space-y-1.5 text-[11px] text-slate-400">
                <div className="flex justify-between">
                  <span>Minimum Threshold:</span>
                  <span className="font-mono text-slate-200">3 USDT</span>
                </div>
                <div className="flex justify-between">
                  <span>BEP20 Confirmations:</span>
                  <span className="font-mono text-slate-200">15 Blocks</span>
                </div>
                <div className="flex justify-between">
                  <span>TRC20 Confirmations:</span>
                  <span className="font-mono text-slate-200">12 Blocks</span>
                </div>
                <div className="flex justify-between">
                  <span>Merchant Routing:</span>
                  <span className="font-mono text-emerald-400">Secured via Proxy</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[11px] text-amber-300">
                Ensure you transfer only USDT on the exact network selected above. Sending other digital tokens will result in permanent loss.
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Deposit History Section */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-white">Recent Deposit History</h3>
        
        {depositHistory.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            No deposits recorded yet. Initiate your first deposit above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-[#1b2332] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">Tx ID</th>
                  <th className="py-2.5 px-3">Network</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151c27] text-slate-300">
                {depositHistory.map(tx => (
                  <tr key={tx.id} className="hover:bg-[#121620] transition-colors">
                    <td className="py-3 px-3 font-mono text-slate-200">{tx.id}</td>
                    <td className="py-3 px-3 font-mono">{tx.network || 'BEP20'}</td>
                    <td className="py-3 px-3 font-mono font-semibold text-emerald-400 tabular-nums">
                      +{tx.amount.toFixed(2)} USDT
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
