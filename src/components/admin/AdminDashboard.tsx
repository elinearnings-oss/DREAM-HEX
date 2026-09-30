import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Package, 
  ShoppingBag, 
  Clock, 
  DollarSign, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  MessageSquare,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { DashboardMetrics, AdminOrderRecord, AdminDepositRecord, AdminWithdrawalRecord, AdminUserRecord } from '../../types/admin';
import { 
  getDashboardMetrics, 
  getAdminOrders, 
  getAdminDeposits, 
  getAdminWithdrawals, 
  getAdminUsers 
} from '../../lib/adminService';

interface AdminDashboardProps {
  onNavigate: (section: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [recentOrders, setRecentOrders] = useState<AdminOrderRecord[]>([]);
  const [recentDeposits, setRecentDeposits] = useState<AdminDepositRecord[]>([]);
  const [recentWithdrawals, setRecentWithdrawals] = useState<AdminWithdrawalRecord[]>([]);
  const [recentUsers, setRecentUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [m, ords, deps, wths, usrs] = await Promise.all([
        getDashboardMetrics(),
        getAdminOrders(),
        getAdminDeposits(),
        getAdminWithdrawals(),
        getAdminUsers()
      ]);
      setMetrics(m);
      setRecentOrders(ords.slice(0, 5));
      setRecentDeposits(deps.slice(0, 4));
      setRecentWithdrawals(wths.slice(0, 4));
      setRecentUsers(usrs.slice(0, 5));
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="space-y-8">
      
      {/* Top Header & Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Executive Overview · Live Metrics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Platform Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry on customer registrations, active product allocations, payment flows, and service tickets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            disabled={loading}
            className="px-3 py-1.5 bg-[#121620] hover:bg-[#181e2b] border border-[#232c3c] text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin text-rose-500' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* METRICS CARDS GRID (8 Core Indicators) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* 1. Total Users */}
        <div 
          onClick={() => onNavigate('users')}
          className="bg-[#0b0e14] hover:bg-[#0e121a] border border-[#1b2332] hover:border-rose-500/40 rounded-xl p-5 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Users</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold font-mono text-white tabular-nums">
              {metrics ? metrics.totalUsers : '...'}
            </p>
            <span className="text-[11px] font-mono text-slate-500 group-hover:text-rose-400 flex items-center gap-0.5">
              <span>Manage</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 2. Total Products */}
        <div 
          onClick={() => onNavigate('products')}
          className="bg-[#0b0e14] hover:bg-[#0e121a] border border-[#1b2332] hover:border-rose-500/40 rounded-xl p-5 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Products</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold font-mono text-white tabular-nums">
              {metrics ? metrics.totalProducts : '...'}
            </p>
            <span className="text-[11px] font-mono text-slate-500 group-hover:text-rose-400 flex items-center gap-0.5">
              <span>Catalog</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 3. Total Orders */}
        <div 
          onClick={() => onNavigate('orders')}
          className="bg-[#0b0e14] hover:bg-[#0e121a] border border-[#1b2332] hover:border-rose-500/40 rounded-xl p-5 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Orders</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold font-mono text-white tabular-nums">
              {metrics ? metrics.totalOrders : '...'}
            </p>
            <span className="text-[11px] font-mono text-slate-500 group-hover:text-rose-400 flex items-center gap-0.5">
              <span>View</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 4. Pending Orders */}
        <div 
          onClick={() => onNavigate('orders')}
          className="bg-[#0b0e14] hover:bg-[#0e121a] border border-[#1b2332] hover:border-rose-500/40 rounded-xl p-5 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Orders</span>
            <div className={`p-2 rounded-lg ${metrics?.pendingOrders ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {metrics ? metrics.pendingOrders : '0'}
            </p>
            <span className="text-[11px] font-mono text-slate-500 group-hover:text-amber-400 flex items-center gap-0.5">
              <span>Review</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 5. Total Revenue (Deposits Volume) */}
        <div 
          onClick={() => onNavigate('payments')}
          className="bg-[#0b0e14] hover:bg-[#0e121a] border border-[#1b2332] hover:border-rose-500/40 rounded-xl p-5 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total Revenue (Volume)</span>
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
              {metrics ? `${metrics.totalRevenue.toFixed(2)} USDT` : '...'}
            </p>
            <span className="text-[11px] font-mono text-slate-500 group-hover:text-rose-400 flex items-center gap-0.5">
              <span>Ledger</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 6. Pending Deposits */}
        <div 
          onClick={() => onNavigate('payments')}
          className="bg-[#0b0e14] hover:bg-[#0e121a] border border-[#1b2332] hover:border-rose-500/40 rounded-xl p-5 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Deposits</span>
            <div className={`p-2 rounded-lg ${metrics?.pendingDeposits ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-800 text-slate-400'}`}>
              <ArrowDownToLine className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold font-mono text-amber-400 tabular-nums">
              {metrics ? metrics.pendingDeposits : '0'}
            </p>
            <span className="text-[11px] font-mono text-slate-500 group-hover:text-amber-400 flex items-center gap-0.5">
              <span>Verify</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 7. Pending Withdrawals */}
        <div 
          onClick={() => onNavigate('withdrawals')}
          className="bg-[#0b0e14] hover:bg-[#0e121a] border border-[#1b2332] hover:border-rose-500/40 rounded-xl p-5 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Withdrawals</span>
            <div className={`p-2 rounded-lg ${metrics?.pendingWithdrawals ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-slate-800 text-slate-400'}`}>
              <ArrowUpFromLine className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
              {metrics ? metrics.pendingWithdrawals : '0'}
            </p>
            <span className="text-[11px] font-mono text-slate-500 group-hover:text-rose-400 flex items-center gap-0.5">
              <span>Broadcast</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* 8. Open Support Requests */}
        <div 
          onClick={() => onNavigate('support')}
          className="bg-[#0b0e14] hover:bg-[#0e121a] border border-[#1b2332] hover:border-rose-500/40 rounded-xl p-5 cursor-pointer transition-all space-y-2 group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Open Support Inquiries</span>
            <div className={`p-2 rounded-lg ${metrics?.openSupportRequests ? 'bg-cyan-500/10 text-cyan-400' : 'bg-slate-800 text-slate-400'}`}>
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <p className="text-2xl font-bold font-mono text-cyan-400 tabular-nums">
              {metrics ? metrics.openSupportRequests : '0'}
            </p>
            <span className="text-[11px] font-mono text-slate-500 group-hover:text-cyan-400 flex items-center gap-0.5">
              <span>Respond</span>
              <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

      </div>

      {/* REVENUE & ACTIVITY SUMMARY BAR */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-500" />
              <span>Capital Flow & Settlement Ratios</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Aggregate inflow vs outflow vs 5% daily allocation rewards distributed.
            </p>
          </div>
          <div className="text-xs font-mono text-slate-400">
            Gateway: <span className="text-emerald-400 font-semibold">HELEKET (BEP20 / TRC20)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 bg-[#11151e] border border-[#1d2535] rounded-xl space-y-1">
            <span className="text-xs text-slate-400">Total Deposits Inflow</span>
            <p className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
              +{metrics?.totalRevenue.toFixed(2) || '0.00'} USDT
            </p>
            <div className="w-full bg-[#18202c] h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-emerald-500 h-full rounded-full w-full" />
            </div>
          </div>

          <div className="p-4 bg-[#11151e] border border-[#1d2535] rounded-xl space-y-1">
            <span className="text-xs text-slate-400">Completed Withdrawals Outflow</span>
            <p className="text-xl font-bold font-mono text-slate-200 tabular-nums">
              -{metrics?.totalWithdrawalsCompleted.toFixed(2) || '0.00'} USDT
            </p>
            <div className="w-full bg-[#18202c] h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-rose-500 h-full rounded-full" 
                style={{ 
                  width: `${Math.min(100, metrics && metrics.totalRevenue > 0 
                    ? ((metrics.totalWithdrawalsCompleted / metrics.totalRevenue) * 100) 
                    : 25)}%` 
                }} 
              />
            </div>
          </div>

          <div className="p-4 bg-[#11151e] border border-[#1d2535] rounded-xl space-y-1">
            <span className="text-xs text-slate-400">5% Rewards Credited</span>
            <p className="text-xl font-bold font-mono text-rose-400 tabular-nums">
              {metrics?.totalRewardsDistributed.toFixed(2) || '0.00'} USDT
            </p>
            <div className="w-full bg-[#18202c] h-1.5 rounded-full overflow-hidden mt-2">
              <div className="bg-rose-500/80 h-full rounded-full w-2/3" />
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN SECTION: RECENT ORDERS & RECENT USERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Orders */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span>Recent Orders & Allocations</span>
            </h3>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No orders recorded yet.</p>
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="border-b border-[#1b2332] text-slate-500 uppercase font-mono">
                  <tr>
                    <th className="pb-2">Order ID</th>
                    <th className="pb-2">Customer</th>
                    <th className="pb-2">Product</th>
                    <th className="pb-2">Amount</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#151c27] text-slate-300">
                  {recentOrders.map(o => (
                    <tr key={o.id} className="hover:bg-[#121620]">
                      <td className="py-2.5 font-mono text-slate-400">{o.id}</td>
                      <td className="py-2.5 font-medium text-white max-w-[120px] truncate">{o.customerName}</td>
                      <td className="py-2.5 text-slate-300 max-w-[130px] truncate">{o.productName}</td>
                      <td className="py-2.5 font-mono tabular-nums">{o.amount} USDT</td>
                      <td className="py-2.5 text-right font-mono text-emerald-400">{o.orderStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Recent Registered Users */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>Newly Registered Customers</span>
            </h3>
            <button
              onClick={() => onNavigate('users')}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium inline-flex items-center gap-1"
            >
              <span>View All</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {recentUsers.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No users registered yet.</p>
          ) : (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead className="border-b border-[#1b2332] text-slate-500 uppercase font-mono">
                  <tr>
                    <th className="pb-2">User</th>
                    <th className="pb-2">Email</th>
                    <th className="pb-2">Balance</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#151c27] text-slate-300">
                  {recentUsers.map(u => (
                    <tr key={u.id} className="hover:bg-[#121620]">
                      <td className="py-2.5 font-medium text-white max-w-[120px] truncate">{u.name}</td>
                      <td className="py-2.5 font-mono text-slate-400 max-w-[150px] truncate">{u.email}</td>
                      <td className="py-2.5 font-mono text-slate-200 tabular-nums">{u.walletBalanceUSDT.toFixed(2)} USDT</td>
                      <td className="py-2.5 text-right font-mono">
                        <span className={`px-2 py-0.5 rounded text-[10px] ${
                          u.accountStatus === 'Active' 
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}>
                          {u.accountStatus}
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

      {/* RECENT PAYMENT ACTIVITY (DEPOSITS & WITHDRAWALS) */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
              <span>Recent Financial Operations</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Latest deposits and withdrawal verification queues.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => onNavigate('payments')}
              className="text-emerald-400 hover:text-emerald-300 font-medium"
            >
              All Deposits →
            </button>
            <span className="text-slate-600">·</span>
            <button
              onClick={() => onNavigate('withdrawals')}
              className="text-rose-400 hover:text-rose-300 font-medium"
            >
              All Withdrawals →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          {/* Recent Deposits Box */}
          <div className="p-4 bg-[#11151e] border border-[#1e2637] rounded-xl space-y-3">
            <span className="text-xs font-semibold text-slate-200 block">Recent Deposits (HELEKET)</span>
            <div className="space-y-2">
              {recentDeposits.map(d => (
                <div key={d.id} className="p-2.5 bg-[#0b0e14] rounded-lg border border-[#18202d] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-300 font-semibold">{d.id}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-[#1a2130] text-slate-400 rounded">{d.network}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 truncate max-w-[160px] block">{d.userName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-emerald-400 font-bold block">+{d.amount.toFixed(2)} USDT</span>
                    <span className={`text-[10px] font-mono ${d.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {d.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Withdrawals Box */}
          <div className="p-4 bg-[#11151e] border border-[#1e2637] rounded-xl space-y-3">
            <span className="text-xs font-semibold text-slate-200 block">Recent Withdrawals</span>
            <div className="space-y-2">
              {recentWithdrawals.map(w => (
                <div key={w.id} className="p-2.5 bg-[#0b0e14] rounded-lg border border-[#18202d] flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-300 font-semibold">{w.id}</span>
                      <span className="text-[10px] px-1.5 py-0.2 bg-[#1a2130] text-slate-400 rounded">{w.network}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 truncate max-w-[160px] block">{w.userName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-rose-400 font-bold block">-{w.amount.toFixed(2)} USDT</span>
                    <span className={`text-[10px] font-mono ${w.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {w.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
