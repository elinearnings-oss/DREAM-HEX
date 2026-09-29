import React from 'react';
import { useApp } from '../context/AppContext';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { Layers, RefreshCw, Clock, CheckCircle2, AlertTriangle, ArrowRight, Wallet } from 'lucide-react';

export const MyProductsPage: React.FC = () => {
  const { activeProducts, triggerCycleReward, wallet, setActiveView } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#1b2332]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">
            <span>Portfolio</span>
            <span aria-hidden="true">·</span>
            <span>24-Hour Cycle Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            My Active Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl leading-relaxed">
            Monitor active node allocations and automated 24-hour cycle executions. 
            Rewards are automatically added to your available USDT wallet balance.
          </p>
        </div>

        <div className="p-3.5 bg-[#0e1219] border border-[#1f2737] rounded-xl flex items-center gap-3 shrink-0">
          <Wallet className="w-4 h-4 text-rose-500 shrink-0" />
          <div>
            <span className="text-[11px] text-slate-400 block">Available Wallet</span>
            <span className="text-base font-bold font-mono tabular-nums text-white">
              {wallet.availableUSDT.toFixed(2)} USDT
            </span>
          </div>
        </div>
      </div>

      {/* Info notice */}
      <div className="p-4 bg-[#121620] border border-[#212b3c] rounded-xl text-xs text-slate-300 flex items-start gap-3">
        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-slate-100">Cycle Execution Protocol: </strong>
          Each product operates on its own 24-hour cycle calculated at 5% of product value. 
          Upon each cycle completion, rewards are transferred to your available balance. You can also manually settle eligible cycles below.
        </div>
      </div>

      {/* Active Products List */}
      {activeProducts.length === 0 ? (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-12 text-center space-y-4">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Active Products Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            You currently have no active computing products. Visit our catalog to activate a node.
          </p>
          <button
            onClick={() => setActiveView('products')}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg shadow-md transition-colors"
          >
            Explore Digital Products
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {activeProducts.map(item => (
            <div
              key={item.id}
              className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-8 space-y-6"
            >
              {/* Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#18202d]">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-rose-400 mb-1">
                    <span>Allocation ID: {item.id}</span>
                    <span aria-hidden="true">·</span>
                    <span>Status: {item.activationStatus}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{item.productName}</h2>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-mono text-emerald-400 font-medium">
                    {item.activationStatus}
                  </span>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-3 bg-[#11151e] rounded-xl border border-[#1d2535]">
                  <span className="text-slate-400 text-[11px] font-sans block mb-1">Product Value</span>
                  <span className="text-base font-bold text-white tabular-nums">{item.productValue.toFixed(2)} USDT</span>
                </div>

                <div className="p-3 bg-[#11151e] rounded-xl border border-[#1d2535]">
                  <span className="text-slate-400 text-[11px] font-sans block mb-1">Reward Rate / 24h</span>
                  <span className="text-base font-bold text-emerald-400 tabular-nums">+{item.dailyRewardAmount.toFixed(2)} USDT</span>
                  <span className="text-[10px] text-slate-400 block font-sans">(5% of Value)</span>
                </div>

                <div className="p-3 bg-[#11151e] rounded-xl border border-[#1d2535]">
                  <span className="text-slate-400 text-[11px] font-sans block mb-1">Current Reward Cycle</span>
                  <span className="text-base font-bold text-rose-400 tabular-nums">Cycle #{item.currentCycle}</span>
                  <span className="text-[10px] text-slate-400 block font-sans">{item.totalCyclesCompleted} completed</span>
                </div>

                <div className="p-3 bg-[#11151e] rounded-xl border border-[#1d2535]">
                  <span className="text-slate-400 text-[11px] font-sans block mb-1">Total Rewards Earned</span>
                  <span className="text-base font-bold text-white tabular-nums">+{item.totalRewardsReceived.toFixed(2)} USDT</span>
                </div>
              </div>

              {/* Activation & Cycle Timestamps */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-[#0e1219] p-4 rounded-xl border border-[#1c2433]">
                <div>
                  <span className="text-slate-400 block text-[11px]">Purchase Date:</span>
                  <span className="text-slate-200 font-mono">
                    {new Date(item.purchaseDate).toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Activation Date:</span>
                  <span className="text-slate-200 font-mono">
                    {new Date(item.activationDate).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Countdown & Settlement Action */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-[#18202d]">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">Next 24-Hour Reward Settlement:</span>
                  <CountdownTimer targetDate={item.nextRewardTime} />
                </div>

                <button
                  onClick={() => triggerCycleReward(item.id)}
                  className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-950/40 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
                  title="Simulate or claim 24-hour cycle reward"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Settle 24h Cycle (+{item.dailyRewardAmount.toFixed(2)} USDT)</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
