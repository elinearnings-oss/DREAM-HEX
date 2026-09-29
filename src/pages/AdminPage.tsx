import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldAlert, 
  Users, 
  Layers, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  RefreshCw, 
  History, 
  MessageSquare, 
  Settings, 
  Check, 
  X, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  RotateCcw,
  Lock
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { 
    isAdmin, 
    toggleAdminRole, 
    products, 
    transactions, 
    referrals, 
    supportTickets, 
    activeProducts,
    adminApproveDeposit,
    adminApproveWithdrawal,
    adminReplyTicket,
    resetAllData,
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'users' | 'products' | 'purchases' | 'rewards' | 'referrals' | 'deposits' | 'withdrawals' | 'transactions' | 'support' | 'settings'
  >('dashboard');

  const [ticketReplyModal, setTicketReplyModal] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');

  // Access protection check
  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-600/20 text-rose-500 mx-auto flex items-center justify-center">
          <Lock className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-white">Admin Authorization Required</h2>
        <p className="text-xs text-slate-400 leading-relaxed">
          Access to the VELORA administration console is restricted to authenticated staff. 
          Use the demo toggle in the navigation bar to test admin workflows.
        </p>
        <button
          onClick={toggleAdminRole}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          Enable Admin Demo Session
        </button>
      </div>
    );
  }

  // Filter specific lists
  const depositList = transactions.filter(t => t.type === 'Deposit');
  const withdrawalList = transactions.filter(t => t.type === 'Withdrawal');
  const purchasesList = transactions.filter(t => t.type === 'Product Purchase');
  const rewardList = transactions.filter(t => t.type === 'Product Reward');

  // Stats calculation from actual ledger
  const totalDepositVolume = depositList.reduce((acc, curr) => acc + curr.amount, 0);
  const totalWithdrawalVolume = withdrawalList.reduce((acc, curr) => acc + curr.amount, 0);
  const totalRewardsDistributed = rewardList.reduce((acc, curr) => acc + curr.amount, 0);

  const handlePostReply = (ticketId: string) => {
    if (!replyText.trim()) return;
    adminReplyTicket(ticketId, replyText.trim());
    setTicketReplyModal(null);
    setReplyText('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1b2332]">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">
            <span>Privileged Access</span>
            <span aria-hidden="true">·</span>
            <span>Console Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            VELORA Admin Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            System administration for users, product allocations, rewards, payment gateway verifications, and tickets.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={resetAllData}
            className="px-3.5 py-1.5 bg-[#141a24] hover:bg-[#1b2332] border border-[#273245] text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
            title="Reset mock data to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
          <button
            onClick={toggleAdminRole}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors"
          >
            Exit Admin View
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#18202d] text-xs">
        {[
          { id: 'dashboard', label: 'Dashboard' },
          { id: 'users', label: 'Users' },
          { id: 'products', label: 'Products' },
          { id: 'purchases', label: 'Purchases' },
          { id: 'rewards', label: '5% Rewards' },
          { id: 'referrals', label: 'Referrals' },
          { id: 'deposits', label: 'Deposits' },
          { id: 'withdrawals', label: 'Withdrawals' },
          { id: 'transactions', label: 'All Tx' },
          { id: 'support', label: 'Support' },
          { id: 'settings', label: 'Settings' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-rose-600 text-white font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 1. DASHBOARD OVERVIEW */}
      {activeTab === 'dashboard' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-[#0b0e14] border border-[#1b2332] rounded-xl p-5 space-y-1">
              <span className="text-xs text-slate-400">Total Deposit Volume</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                +{totalDepositVolume.toFixed(2)} USDT
              </p>
              <span className="text-[11px] text-slate-500 block font-mono">{depositList.length} transactions</span>
            </div>

            <div className="bg-[#0b0e14] border border-[#1b2332] rounded-xl p-5 space-y-1">
              <span className="text-xs text-slate-400">Total Withdrawn</span>
              <p className="text-2xl font-bold font-mono text-white tabular-nums">
                -{totalWithdrawalVolume.toFixed(2)} USDT
              </p>
              <span className="text-[11px] text-slate-500 block font-mono">{withdrawalList.length} transactions</span>
            </div>

            <div className="bg-[#0b0e14] border border-[#1b2332] rounded-xl p-5 space-y-1">
              <span className="text-xs text-slate-400">Rewards Distributed (5%)</span>
              <p className="text-2xl font-bold font-mono text-rose-400 tabular-nums">
                {totalRewardsDistributed.toFixed(2)} USDT
              </p>
              <span className="text-[11px] text-slate-500 block font-mono">{rewardList.length} cycles completed</span>
            </div>

            <div className="bg-[#0b0e14] border border-[#1b2332] rounded-xl p-5 space-y-1">
              <span className="text-xs text-slate-400">Active Node Slots</span>
              <p className="text-2xl font-bold font-mono text-white tabular-nums">
                {activeProducts.length}
              </p>
              <span className="text-[11px] text-slate-500 block font-mono">Running live 24h cycles</span>
            </div>
          </div>

          <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-3">
            <h3 className="text-sm font-bold text-white">System Architecture Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-[#11151e] rounded-xl border border-[#1d2535]">
                <span className="text-slate-400 block mb-1">Payment Provider:</span>
                <span className="text-emerald-400 font-mono font-semibold">HELEKET (BEP20 / TRC20)</span>
              </div>
              <div className="p-3 bg-[#11151e] rounded-xl border border-[#1d2535]">
                <span className="text-slate-400 block mb-1">Product Cycle Engine:</span>
                <span className="text-slate-200 font-mono font-semibold">24-Hour Automated Interval (5%)</span>
              </div>
              <div className="p-3 bg-[#11151e] rounded-xl border border-[#1d2535]">
                <span className="text-slate-400 block mb-1">Referral Engine:</span>
                <span className="text-slate-200 font-mono font-semibold">10% Direct Wallet Attribution</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. USERS */}
      {activeTab === 'users' && (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Registered Users</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="border-b border-[#1b2332] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">User ID</th>
                  <th className="py-2.5 px-3">Full Name</th>
                  <th className="py-2.5 px-3">Email</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Age 18+</th>
                  <th className="py-2.5 px-3">Referral Code</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151c27] text-slate-300">
                <tr className="hover:bg-[#121620]">
                  <td className="py-3 px-3 font-mono">usr-8921</td>
                  <td className="py-3 px-3 font-semibold text-white">Alexandre Pratama</td>
                  <td className="py-3 px-3 font-mono text-slate-400">alex.pratama@example.com</td>
                  <td className="py-3 px-3 text-emerald-400 font-mono">Active</td>
                  <td className="py-3 px-3 text-emerald-400">Verified</td>
                  <td className="py-3 px-3 font-mono text-rose-400">VEL-78492</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. PRODUCTS */}
      {activeTab === 'products' && (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Platform Products Catalog</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="border-b border-[#1b2332] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">ID</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Price (USDT)</th>
                  <th className="py-2.5 px-3">Daily Rate</th>
                  <th className="py-2.5 px-3">Cycle Duration</th>
                  <th className="py-2.5 px-3">Remaining Slots</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151c27] text-slate-300">
                {products.map(p => (
                  <tr key={p.id} className="hover:bg-[#121620]">
                    <td className="py-3 px-3 font-mono">{p.id}</td>
                    <td className="py-3 px-3 font-semibold text-white">{p.name}</td>
                    <td className="py-3 px-3 font-mono tabular-nums">{p.priceUSDT} USDT</td>
                    <td className="py-3 px-3 font-mono text-emerald-400">5% ({(p.priceUSDT * 0.05).toFixed(2)} USDT)</td>
                    <td className="py-3 px-3 font-mono">{p.cycleHours} Hours</td>
                    <td className="py-3 px-3 font-mono">{p.availableSlots} / {p.allocationLimit}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. PRODUCT PURCHASES & ACTIVE ALLOCATIONS */}
      {activeTab === 'purchases' && (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Active Product Allocations</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="border-b border-[#1b2332] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">Allocation ID</th>
                  <th className="py-2.5 px-3">Product Name</th>
                  <th className="py-2.5 px-3">Value</th>
                  <th className="py-2.5 px-3">Current Cycle</th>
                  <th className="py-2.5 px-3">Total Earned</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151c27] text-slate-300">
                {activeProducts.map(act => (
                  <tr key={act.id} className="hover:bg-[#121620]">
                    <td className="py-3 px-3 font-mono">{act.id}</td>
                    <td className="py-3 px-3 font-semibold text-white">{act.productName}</td>
                    <td className="py-3 px-3 font-mono tabular-nums">{act.productValue} USDT</td>
                    <td className="py-3 px-3 font-mono text-rose-400">Cycle #{act.currentCycle}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400 tabular-nums">+{act.totalRewardsReceived.toFixed(2)} USDT</td>
                    <td className="py-3 px-3 font-mono text-emerald-400">{act.activationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. 5% REWARDS LEDGER */}
      {activeTab === 'rewards' && (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">24h Cycle Reward Settlements</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="border-b border-[#1b2332] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">Tx ID</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Note</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151c27] text-slate-300">
                {rewardList.map(r => (
                  <tr key={r.id} className="hover:bg-[#121620]">
                    <td className="py-3 px-3 font-mono">{r.id}</td>
                    <td className="py-3 px-3 font-mono font-bold text-emerald-400 tabular-nums">+{r.amount.toFixed(2)} USDT</td>
                    <td className="py-3 px-3 text-slate-400">{new Date(r.date).toLocaleString()}</td>
                    <td className="py-3 px-3 text-slate-300">{r.note}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400">{r.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. REFERRALS */}
      {activeTab === 'referrals' && (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Affiliate Relationships (10% Commission)</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="border-b border-[#1b2332] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">Ref ID</th>
                  <th className="py-2.5 px-3">User</th>
                  <th className="py-2.5 px-3">Product Volume</th>
                  <th className="py-2.5 px-3">10% Commission Payout</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151c27] text-slate-300">
                {referrals.map(ref => (
                  <tr key={ref.id} className="hover:bg-[#121620]">
                    <td className="py-3 px-3 font-mono">{ref.id}</td>
                    <td className="py-3 px-3 font-semibold text-white">{ref.userName} ({ref.userId})</td>
                    <td className="py-3 px-3 font-mono tabular-nums">{ref.totalContributedUSDT.toFixed(2)} USDT</td>
                    <td className="py-3 px-3 font-mono text-rose-400 font-bold tabular-nums">+{ref.commissionEarnedUSDT.toFixed(2)} USDT</td>
                    <td className="py-3 px-3 font-mono text-emerald-400">{ref.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 7. DEPOSITS */}
      {activeTab === 'deposits' && (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">HELEKET Deposit Ledger</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="border-b border-[#1b2332] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">Tx ID</th>
                  <th className="py-2.5 px-3">Network</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151c27] text-slate-300">
                {depositList.map(dep => (
                  <tr key={dep.id} className="hover:bg-[#121620]">
                    <td className="py-3 px-3 font-mono">{dep.id}</td>
                    <td className="py-3 px-3 font-mono">{dep.network}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold tabular-nums">+{dep.amount.toFixed(2)} USDT</td>
                    <td className="py-3 px-3 text-slate-400">{new Date(dep.date).toLocaleString()}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400">{dep.status}</td>
                    <td className="py-3 px-3 text-right">
                      {dep.status !== 'Completed' && (
                        <button
                          onClick={() => adminApproveDeposit(dep.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-mono text-[10px]"
                        >
                          Approve
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. WITHDRAWALS */}
      {activeTab === 'withdrawals' && (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Withdrawal Requests</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="border-b border-[#1b2332] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">Tx ID</th>
                  <th className="py-2.5 px-3">Network</th>
                  <th className="py-2.5 px-3">Destination Address</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151c27] text-slate-300">
                {withdrawalList.map(w => (
                  <tr key={w.id} className="hover:bg-[#121620]">
                    <td className="py-3 px-3 font-mono">{w.id}</td>
                    <td className="py-3 px-3 font-mono">{w.network}</td>
                    <td className="py-3 px-3 font-mono text-slate-400 break-all">{w.walletAddress || 'External'}</td>
                    <td className="py-3 px-3 font-mono text-rose-400 font-bold tabular-nums">-{w.amount.toFixed(2)} USDT</td>
                    <td className="py-3 px-3 font-mono text-emerald-400">{w.status}</td>
                    <td className="py-3 px-3 text-right">
                      {w.status !== 'Completed' && (
                        <button
                          onClick={() => adminApproveWithdrawal(w.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-mono text-[10px]"
                        >
                          Broadcast
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 9. ALL TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">All Platform Transactions ({transactions.length})</h3>
          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead className="border-b border-[#1b2332] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-2.5 px-3">Tx ID</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3">Amount</th>
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#151c27] text-slate-300">
                {transactions.map(t => (
                  <tr key={t.id} className="hover:bg-[#121620]">
                    <td className="py-3 px-3 font-mono">{t.id}</td>
                    <td className="py-3 px-3 font-medium text-slate-200">{t.type}</td>
                    <td className="py-3 px-3 font-mono tabular-nums">{t.amount.toFixed(2)} USDT</td>
                    <td className="py-3 px-3 text-slate-400">{new Date(t.date).toLocaleDateString()}</td>
                    <td className="py-3 px-3 font-mono text-emerald-400">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 10. SUPPORT REQUESTS */}
      {activeTab === 'support' && (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white">Customer Support Inquiries</h3>
          
          <div className="space-y-4 text-xs">
            {supportTickets.map(t => (
              <div key={t.id} className="p-4 bg-[#121620] border border-[#1e2738] rounded-xl space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-rose-400 font-semibold">{t.id}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-semibold text-white">{t.subject}</span>
                    <span className="text-slate-500 font-mono">({t.category})</span>
                  </div>
                  <span className={`font-mono ${t.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {t.status}
                  </span>
                </div>

                <p className="text-slate-300 text-[11px] leading-relaxed bg-[#0b0e14] p-3 rounded border border-[#18202c]">
                  {t.message}
                </p>

                {t.adminReply && (
                  <div className="p-3 bg-[#161c28] rounded border border-[#232f42] text-[11px]">
                    <span className="text-rose-400 font-semibold block mb-0.5">Your Response:</span>
                    <p className="text-slate-300">{t.adminReply}</p>
                  </div>
                )}

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={() => {
                      setTicketReplyModal(t.id);
                      setReplyText(t.adminReply || '');
                    }}
                    className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded font-medium"
                  >
                    {t.adminReply ? 'Edit Reply' : 'Post Reply'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Ticket Reply Modal */}
          {ticketReplyModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-[#0f131a] border border-[#232c3c] rounded-xl p-6 text-slate-100 space-y-4">
                <h3 className="text-sm font-bold text-white">Post Support Ticket Reply</h3>
                <textarea
                  rows={4}
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type official response..."
                  className="w-full bg-[#121620] border border-[#212b3c] rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <div className="flex justify-end gap-2 text-xs">
                  <button
                    onClick={() => setTicketReplyModal(null)}
                    className="px-3 py-1.5 text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handlePostReply(ticketReplyModal)}
                    className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg"
                  >
                    Send Reply
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 11. SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-6 text-xs text-slate-300">
          <h3 className="text-sm font-bold text-white">Platform Engine Configuration</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#121620] border border-[#1e2738] rounded-xl space-y-2">
              <h4 className="font-semibold text-white">Reward Engine Parameters</h4>
              <p className="text-[11px] text-slate-400">Rate: 5% per 24-hour cycle duration.</p>
              <p className="text-[11px] text-slate-400">Referral Commission: 10% direct referrer payout.</p>
            </div>

            <div className="p-4 bg-[#121620] border border-[#1e2738] rounded-xl space-y-2">
              <h4 className="font-semibold text-white">Gateway Invariants</h4>
              <p className="text-[11px] text-slate-400">HELEKET USDT: BEP20 (15 confirmations) / TRC20 (12 confirmations).</p>
              <p className="text-[11px] text-slate-400">Minimum thresholds: Deposit ≥ 3 USDT / Withdrawal ≥ 0.5 USDT (0% fee).</p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
