import React from 'react';
import { useApp } from '../context/AppContext';
import { BRAND_INFO } from '../data/mockData';
import { CountdownTimer } from '../components/common/CountdownTimer';
import { 
  Wallet, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Layers, 
  Users, 
  History, 
  User as UserIcon,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    user, 
    wallet, 
    activeProducts, 
    transactions, 
    setActiveView, 
    triggerCycleReward,
    openProductDetails,
    openAuthModal 
  } = useApp();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-5">
        <div className="w-12 h-12 rounded-full bg-rose-600/20 text-rose-500 mx-auto flex items-center justify-center">
          <Wallet className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Sign In to Access Your Dashboard</h2>
        <p className="text-xs text-slate-400">
          Monitor your active digital product cycles, 24-hour rewards, and USDT wallet balances.
        </p>
        <button
          onClick={() => openAuthModal('login')}
          className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors"
        >
          Sign In to VELORA
        </button>
      </div>
    );
  }

  // Find earliest next reward countdown
  const nextRewardTarget = activeProducts.length > 0 
    ? [...activeProducts].sort((a, b) => new Date(a.nextRewardTime).getTime() - new Date(b.nextRewardTime).getTime())[0]?.nextRewardTime
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      
      {/* Top Welcome & Account Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1b2332]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Welcome back</span>
            <span aria-hidden="true">·</span>
            <span className="text-rose-400 font-semibold">{user.name}</span>
            <span aria-hidden="true">·</span>
            <span>ID: {user.id}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Account Dashboard
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveView('deposit')}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-md shadow-rose-950/40 transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Deposit</span>
          </button>
          <button
            onClick={() => setActiveView('withdraw')}
            className="px-4 py-2 bg-[#141a24] hover:bg-[#1b2332] border border-[#263145] text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <ArrowUpFromLine className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW METRICS GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Total Wallet Balance */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Wallet Balance</span>
            <Wallet className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {wallet.totalBalanceUSDT.toFixed(2)} <span className="text-xs font-normal text-slate-400">USDT</span>
          </p>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
            <span>Avail: {wallet.availableUSDT.toFixed(2)}</span>
            <span aria-hidden="true">·</span>
            <span>Pending: {wallet.pendingUSDT.toFixed(2)}</span>
          </div>
        </div>

        {/* Total Product Rewards (5%) */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Product Rewards (5%)</span>
            <RefreshCw className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
            +{wallet.totalProductRewardsUSDT.toFixed(2)} <span className="text-xs font-normal text-slate-400">USDT</span>
          </p>
          <span className="text-[11px] text-slate-400 block pt-1">
            From 24h cycle distributions
          </span>
        </div>

        {/* Total Referral Rewards (10%) */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Referral Rewards (10%)</span>
            <Users className="w-4 h-4 text-rose-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            +{wallet.totalReferralRewardsUSDT.toFixed(2)} <span className="text-xs font-normal text-slate-400">USDT</span>
          </p>
          <span className="text-[11px] text-slate-400 block pt-1">
            Direct affiliate commission
          </span>
        </div>

        {/* Active Products & Next Reward */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-xl p-5 space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Active Products</span>
            <Layers className="w-4 h-4 text-rose-500" />
          </div>
          <p className="text-2xl font-bold font-mono text-white tabular-nums">
            {activeProducts.length} <span className="text-xs font-normal text-slate-400">Nodes</span>
          </p>
          <div className="pt-1 text-[11px] text-slate-300">
            {nextRewardTarget ? (
              <div className="flex items-center gap-1">
                <span className="text-slate-400">Next cycle:</span>
                <CountdownTimer targetDate={nextRewardTarget} compact />
              </div>
            ) : (
              <span className="text-slate-500">No cycles running</span>
            )}
          </div>
        </div>

      </div>

      {/* 2. QUICK ACTIONS BAR */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-5 sm:p-6 space-y-3">
        <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Quick Actions</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <button
            onClick={() => setActiveView('deposit')}
            className="p-3 bg-[#121620] hover:bg-[#181f2c] border border-[#212b3b] hover:border-rose-500/40 rounded-xl text-left transition-colors flex flex-col justify-between h-20"
          >
            <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">Deposit Funds</span>
          </button>

          <button
            onClick={() => setActiveView('withdraw')}
            className="p-3 bg-[#121620] hover:bg-[#181f2c] border border-[#212b3b] hover:border-rose-500/40 rounded-xl text-left transition-colors flex flex-col justify-between h-20"
          >
            <ArrowUpFromLine className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-semibold text-slate-200">Withdraw USDT</span>
          </button>

          <button
            onClick={() => setActiveView('products')}
            className="p-3 bg-[#121620] hover:bg-[#181f2c] border border-[#212b3b] hover:border-rose-500/40 rounded-xl text-left transition-colors flex flex-col justify-between h-20"
          >
            <Layers className="w-4 h-4 text-rose-500" />
            <span className="text-xs font-semibold text-slate-200">Explore Nodes</span>
          </button>

          <button
            onClick={() => setActiveView('my-products')}
            className="p-3 bg-[#121620] hover:bg-[#181f2c] border border-[#212b3b] hover:border-rose-500/40 rounded-xl text-left transition-colors flex flex-col justify-between h-20"
          >
            <RefreshCw className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-semibold text-slate-200">My Products</span>
          </button>

          <button
            onClick={() => setActiveView('referral')}
            className="p-3 bg-[#121620] hover:bg-[#181f2c] border border-[#212b3b] hover:border-rose-500/40 rounded-xl text-left transition-colors flex flex-col justify-between h-20"
          >
            <Users className="w-4 h-4 text-slate-300" />
            <span className="text-xs font-semibold text-slate-200">Referral (10%)</span>
          </button>

          <button
            onClick={() => setActiveView('transactions')}
            className="p-3 bg-[#121620] hover:bg-[#181f2c] border border-[#212b3b] hover:border-rose-500/40 rounded-xl text-left transition-colors flex flex-col justify-between h-20"
          >
            <History className="w-4 h-4 text-slate-300" />
            <span className="text-xs font-semibold text-slate-200">Ledger</span>
          </button>

        </div>
      </div>

      {/* 3. ACTIVE PRODUCTS SECTION */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Active Computing Products</h2>
            <p className="text-xs text-slate-400">Products currently participating in 24-hour reward cycles (5% rate).</p>
          </div>
          <button
            onClick={() => setActiveView('products')}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
          >
            <span>+ Activate Another</span>
          </button>
        </div>

        {activeProducts.length === 0 ? (
          <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-10 text-center space-y-3">
            <Layers className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-xs text-slate-400">You do not have any active products yet.</p>
            <button
              onClick={() => setActiveView('products')}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
            >
              Browse Digital Products
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activeProducts.map(item => (
              <div 
                key={item.id}
                className="bg-[#0b0e14] border border-[#1b2332] rounded-xl p-5 space-y-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-mono text-rose-400 block mb-0.5">
                      Cycle #{item.currentCycle} Active
                    </span>
                    <h3 className="text-base font-bold text-white">{item.productName}</h3>
                  </div>

                  <span className="px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-medium">
                    {item.activationStatus}
                  </span>
                </div>

                {/* Details Breakdown */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-[#111620] rounded-lg text-xs font-mono">
                  <div>
                    <span className="text-slate-400 text-[11px] font-sans block">Product Value:</span>
                    <span className="text-slate-100 font-bold tabular-nums">{item.productValue.toFixed(2)} USDT</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] font-sans block">24h Reward (5%):</span>
                    <span className="text-emerald-400 font-bold tabular-nums">+{item.dailyRewardAmount.toFixed(2)} USDT</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] font-sans block">Total Earned:</span>
                    <span className="text-white font-bold tabular-nums">+{item.totalRewardsReceived.toFixed(2)} USDT</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] font-sans block">Cycles Succeeded:</span>
                    <span className="text-slate-300 tabular-nums">{item.totalCyclesCompleted}</span>
                  </div>
                </div>

                {/* Countdown & Settlement Action */}
                <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t border-[#18202d]">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Next 24h Cycle Settlement:</span>
                    <CountdownTimer targetDate={item.nextRewardTime} />
                  </div>

                  <button
                    onClick={() => triggerCycleReward(item.id)}
                    className="w-full sm:w-auto px-3.5 py-1.5 bg-[#171e2c] hover:bg-rose-600 hover:text-white border border-[#273248] text-xs font-semibold text-slate-300 rounded-lg transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                    title="Simulate / Trigger 24h cycle settlement to wallet"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Settle Cycle (+{item.dailyRewardAmount.toFixed(2)} USDT)</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. RECENT TRANSACTIONS SUMMARY */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Recent Transactions</h2>
          <button
            onClick={() => setActiveView('transactions')}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
          >
            <span>View Full Ledger</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-[#1b2332] text-slate-400 uppercase font-mono">
              <tr>
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Date</th>
                <th className="py-2 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151c27] text-slate-300">
              {transactions.slice(0, 5).map(tx => {
                const isPositive = tx.type === 'Deposit' || tx.type === 'Product Reward' || tx.type === 'Referral Reward';
                return (
                  <tr key={tx.id} className="hover:bg-[#121620] transition-colors">
                    <td className="py-2.5 px-3 font-medium text-slate-200">{tx.type}</td>
                    <td className="py-2.5 px-3 font-mono font-semibold tabular-nums">
                      <span className={isPositive ? 'text-emerald-400' : 'text-slate-300'}>
                        {isPositive ? '+' : '-'}{tx.amount.toFixed(2)} USDT
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-400">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <span className="font-mono text-xs text-emerald-400">{tx.status}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
