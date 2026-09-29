import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRAND_INFO } from '../data/mockData';
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  Calculator,
  ArrowRight
} from 'lucide-react';

export const ProductDetailsPage: React.FC = () => {
  const { selectedProductId, products, setActiveView, purchaseProduct, wallet, user, openAuthModal } = useApp();
  const [calculatorCycles, setCalculatorCycles] = useState<number>(7);

  const product = products.find(p => p.id === selectedProductId) || products[0];

  const rewardPerCycle = product.priceUSDT * BRAND_INFO.productRewardRate;
  const simulatedTotalRewards = rewardPerCycle * calculatorCycles;

  const handlePurchase = () => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    const res = purchaseProduct(product.id);
    if (res.success) {
      setActiveView('my-products');
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      
      {/* Back button */}
      <div>
        <button
          onClick={() => setActiveView('products')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products Catalog</span>
        </button>
      </div>

      {/* Main Product Card */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-10 space-y-8">
        
        {/* Title & Metadata */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#18202d]">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-mono text-rose-500 uppercase tracking-widest">
              <span>{product.tier}</span>
              <span aria-hidden="true">·</span>
              <span>Available Slots: {product.availableSlots} / {product.allocationLimit}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="bg-[#121620] border border-[#1f283a] rounded-xl p-4 sm:text-right shrink-0">
            <span className="text-xs text-slate-400 block mb-1">Product Value</span>
            <div className="flex items-baseline sm:justify-end gap-1.5">
              <span className="text-3xl font-extrabold font-mono tabular-nums text-white">
                {product.priceUSDT.toFixed(2)}
              </span>
              <span className="text-xs font-mono text-slate-400">USDT</span>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold block mt-1">
              +{rewardPerCycle.toFixed(2)} USDT / 24h Cycle (5%)
            </span>
          </div>
        </div>

        {/* 2-Column: Specifications & Activation Timeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Specifications */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-rose-500" />
              <span>Allocation Parameters</span>
            </h3>

            <div className="bg-[#10141d] border border-[#1d2636] rounded-xl divide-y divide-[#18202d] text-xs">
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-400">Reward Rate</span>
                <span className="text-slate-100 font-mono font-semibold">5% per 24-hour cycle</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-400">Cycle Duration</span>
                <span className="text-slate-100 font-mono">24 Hours (86,400 seconds)</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-400">Payout Mechanism</span>
                <span className="text-slate-100">Automated wallet credit upon cycle completion</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-400">Referral Commission</span>
                <span className="text-rose-400 font-mono font-semibold">10% direct referrer credit</span>
              </div>
              <div className="p-3.5 flex justify-between">
                <span className="text-slate-400">Minimum Hold Duration</span>
                <span className="text-slate-100 font-mono">{product.minDurationDays} Day</span>
              </div>
            </div>
          </div>

          {/* Activation Timeline */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
              <Clock className="w-4 h-4 text-rose-500" />
              <span>Product Activation Sequence</span>
            </h3>

            <div className="bg-[#10141d] border border-[#1d2636] rounded-xl p-4 space-y-3.5 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-rose-600/20 text-rose-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  1
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Purchase Confirmation</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    USDT balance is verified and committed to the node product slot.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-rose-600/20 text-rose-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">Activation Window (5–10 Mins)</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Internal computing slot provisioning and ledger binding are finalized.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded bg-rose-600/20 text-rose-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-0.5">
                  3
                </div>
                <div>
                  <h4 className="font-semibold text-slate-200">First 24h Reward Cycle</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Upon timer completion, 5% of product value is credited directly to available balance.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 5% Cycle Calculator */}
        <div className="bg-[#121621] border border-[#20293b] rounded-xl p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-rose-500" />
              <span>Reward Calculator (5% Rate)</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">{calculatorCycles} Cycles Selected</span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-400">
              <span>1 Cycle (24h)</span>
              <span>15 Cycles</span>
              <span>30 Cycles</span>
            </div>
            <input
              type="range"
              min="1"
              max="30"
              value={calculatorCycles}
              onChange={e => setCalculatorCycles(Number(e.target.value))}
              className="w-full accent-rose-500 bg-[#1b2332] h-2 rounded cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-[#0d1017] rounded-lg border border-[#1b2230]">
              <span className="text-[11px] text-slate-400 block">Single Cycle (24h)</span>
              <span className="text-sm font-bold font-mono text-emerald-400">+{rewardPerCycle.toFixed(2)} USDT</span>
            </div>
            <div className="p-3 bg-[#0d1017] rounded-lg border border-[#1b2230]">
              <span className="text-[11px] text-slate-400 block">Cycles Selected ({calculatorCycles}x)</span>
              <span className="text-sm font-bold font-mono text-white">+{simulatedTotalRewards.toFixed(2)} USDT</span>
            </div>
            <div className="p-3 bg-[#0d1017] rounded-lg border border-[#1b2230]">
              <span className="text-[11px] text-slate-400 block">Rate Formula</span>
              <span className="text-xs font-mono text-slate-300">Value × 0.05 / 24h</span>
            </div>
          </div>
        </div>

        {/* Commitment Action Bar */}
        <div className="pt-6 border-t border-[#18202d] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-400">
            Available balance: <span className="font-mono text-white font-semibold">{wallet.availableUSDT.toFixed(2)} USDT</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handlePurchase}
              className="w-full sm:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-lg shadow-rose-950/40 transition-colors flex items-center justify-center gap-2"
            >
              <span>Activate Product ({product.priceUSDT} USDT)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Compliance Note */}
      <div className="p-4 bg-[#0d1117] border border-[#1b2230] rounded-xl flex items-start gap-3 text-xs text-slate-400">
        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          Product rewards reflect digital participation cycles. VELORA does not offer guaranteed investment returns. 
          Rewards depend on platform computing operations. All participants must be at least 18 years of age.
        </div>
      </div>

    </div>
  );
};
