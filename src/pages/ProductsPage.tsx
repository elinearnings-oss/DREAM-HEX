import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRAND_INFO } from '../data/mockData';
import { Layers, Clock, ArrowRight, ShieldCheck, CheckCircle2, AlertTriangle, Wallet } from 'lucide-react';
import { Product } from '../types';

export const ProductsPage: React.FC = () => {
  const { products, openProductDetails, purchaseProduct, wallet, user, openAuthModal } = useApp();
  const [selectedTier, setSelectedTier] = useState<string>('all');
  const [confirmModalProduct, setConfirmModalProduct] = useState<Product | null>(null);

  const filteredProducts = selectedTier === 'all' 
    ? products 
    : products.filter(p => p.tier.toLowerCase().includes(selectedTier));

  const handlePurchaseClick = (product: Product) => {
    if (!user) {
      openAuthModal('login');
      return;
    }
    setConfirmModalProduct(product);
  };

  const handleConfirmPurchase = () => {
    if (!confirmModalProduct) return;
    const res = purchaseProduct(confirmModalProduct.id);
    if (res.success) {
      setConfirmModalProduct(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-[#1b2332]">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono text-rose-500 uppercase tracking-widest">
            <span>Digital Node Allocations</span>
            <span aria-hidden="true">·</span>
            <span>5% Per 24-Hour Cycle</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Products & Reward Specifications
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Select an active computing node slot to participate in modular digital operations. 
            Each verified slot calculates a 5% reward distribution every 24-hour cycle credited directly to your available wallet balance.
          </p>
        </div>

        {/* User Balance Glance */}
        {user && (
          <div className="p-3.5 bg-[#0e1219] border border-[#1f2737] rounded-xl flex items-center gap-3 shrink-0">
            <Wallet className="w-4 h-4 text-rose-500 shrink-0" />
            <div>
              <span className="text-[11px] text-slate-400 block">Available Balance</span>
              <span className="text-sm font-bold font-mono tabular-nums text-white">
                {wallet.availableUSDT.toFixed(2)} USDT
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Distinction & Risk Banner */}
      <div className="p-4 bg-[#121620] border border-[#212b3c] rounded-xl text-xs text-slate-300 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-100">Reward Disclaimer: </strong>
          Product rewards represent digital asset computing incentives calculated strictly at 5% of product value per 24 hours. 
          Rewards are subject to protocol operations and do NOT constitute a guaranteed bank deposit, promissory note, or guaranteed profit.
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-[#18202d] pb-2 text-xs overflow-x-auto">
        <button
          onClick={() => setSelectedTier('all')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            selectedTier === 'all' 
              ? 'bg-rose-600 text-white font-semibold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          All Allocations
        </button>
        <button
          onClick={() => setSelectedTier('starter')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            selectedTier === 'starter' 
              ? 'bg-rose-600 text-white font-semibold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Starter (10 USDT)
        </button>
        <button
          onClick={() => setSelectedTier('core')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            selectedTier === 'core' 
              ? 'bg-rose-600 text-white font-semibold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Core (25 USDT)
        </button>
        <button
          onClick={() => setSelectedTier('prime')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            selectedTier === 'prime' 
              ? 'bg-rose-600 text-white font-semibold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Prime (50 USDT)
        </button>
        <button
          onClick={() => setSelectedTier('enterprise')}
          className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
            selectedTier === 'enterprise' 
              ? 'bg-rose-600 text-white font-semibold' 
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Enterprise (100 USDT)
        </button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => {
          const rewardPerCycle = (product.priceUSDT * BRAND_INFO.productRewardRate).toFixed(2);
          const hasBalance = wallet.availableUSDT >= product.priceUSDT;

          return (
            <div
              key={product.id}
              className="bg-[#0b0e14] border border-[#1b2332] hover:border-[#2b374d] rounded-2xl p-6 flex flex-col justify-between transition-all duration-200"
            >
              <div>
                {/* Header tags */}
                <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                  <span className="font-mono">{product.tier}</span>
                  {product.badge && (
                    <span className="text-[11px] font-mono text-rose-400 font-semibold">{product.badge}</span>
                  )}
                </div>

                {/* Product Title */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {product.name}
                </h3>

                {/* Value & 5% Cycle Reward */}
                <div className="bg-[#121620] border border-[#1f2839] rounded-xl p-4 my-4 space-y-1.5">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-slate-400">Product Value</span>
                    <span className="text-xl font-bold font-mono tabular-nums text-white">
                      {product.priceUSDT.toFixed(2)} USDT
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between pt-1 border-t border-[#1b2332]">
                    <span className="text-xs text-slate-400">24h Reward (5%)</span>
                    <span className="text-sm font-bold font-mono tabular-nums text-emerald-400">
                      +{rewardPerCycle} USDT
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed mb-5">
                  {product.description}
                </p>

                {/* Feature Bullet Points */}
                <ul className="space-y-2 mb-6 text-xs text-slate-300">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
                      <span className="leading-tight">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4 border-t border-[#18202d]">
                <button
                  onClick={() => handlePurchaseClick(product)}
                  className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-rose-950/40 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <span>Activate Node</span>
                  <span className="font-mono">({product.priceUSDT} USDT)</span>
                </button>

                <button
                  onClick={() => openProductDetails(product.id)}
                  className="w-full py-2 px-3 bg-[#131822] hover:bg-[#1a2230] border border-[#222b3b] text-slate-300 text-xs font-medium rounded-lg transition-colors text-center"
                >
                  View Full Specifications
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* CONFIRM PURCHASE MODAL */}
      {confirmModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0f131a] border border-[#232c3c] rounded-xl p-6 shadow-2xl text-slate-100">
            <h3 className="text-base font-bold text-white mb-1">Confirm Product Activation</h3>
            <p className="text-xs text-slate-400 mb-4">
              Review allocation terms before committing USDT from your available balance.
            </p>

            <div className="bg-[#141a24] border border-[#222c3e] rounded-lg p-4 space-y-2 text-xs mb-5">
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Product:</span>
                <span className="font-semibold text-white">{confirmModalProduct.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Product Value:</span>
                <span className="font-mono font-bold text-white">{confirmModalProduct.priceUSDT.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Calculated Cycle Reward:</span>
                <span className="font-mono font-semibold text-emerald-400">
                  +{(confirmModalProduct.priceUSDT * BRAND_INFO.productRewardRate).toFixed(2)} USDT / 24 hours (5%)
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#1e2637]">
                <span className="text-slate-400">Available Wallet Balance:</span>
                <span className="font-mono text-slate-200">{wallet.availableUSDT.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Balance After Activation:</span>
                <span className={`font-mono font-semibold ${wallet.availableUSDT >= confirmModalProduct.priceUSDT ? 'text-slate-200' : 'text-rose-400'}`}>
                  {(wallet.availableUSDT - confirmModalProduct.priceUSDT).toFixed(2)} USDT
                </span>
              </div>
            </div>

            {wallet.availableUSDT < confirmModalProduct.priceUSDT && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-xs text-rose-300 mb-4 leading-relaxed">
                Insufficient available USDT balance. Please deposit at least {(confirmModalProduct.priceUSDT - wallet.availableUSDT).toFixed(2)} USDT via HELEKET.
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setConfirmModalProduct(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                disabled={wallet.availableUSDT < confirmModalProduct.priceUSDT}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Confirm & Activate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
