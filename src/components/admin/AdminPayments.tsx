import React, { useEffect, useState } from 'react';
import { 
  ArrowDownToLine, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Eye, 
  Check, 
  X, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { AdminDepositRecord } from '../../types/admin';
import { getAdminDeposits, approveDeposit, rejectDeposit } from '../../lib/adminService';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminPayments: React.FC = () => {
  const { admin } = useAdminAuth();
  const [deposits, setDeposits] = useState<AdminDepositRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed' | 'Rejected'>('All');

  // Modals & Action States
  const [selectedDeposit, setSelectedDeposit] = useState<AdminDepositRecord | null>(null);
  const [rejectModalDeposit, setRejectModalDeposit] = useState<AdminDepositRecord | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');
  
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadDeposits = async () => {
    setLoading(true);
    try {
      const data = await getAdminDeposits();
      setDeposits(data);
    } catch (err) {
      console.error('Failed to load deposits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDeposits();
  }, []);

  const handleApprove = async (dep: AdminDepositRecord) => {
    const confirmApprove = window.confirm(`Approve deposit ${dep.id} of ${dep.amount} USDT for ${dep.userName}? This will credit the user's available balance in the database.`);
    if (!confirmApprove) return;

    setActionInProgress(dep.id);
    const success = await approveDeposit(dep.id, admin?.email || 'admin@velora.io', 'Verified on blockchain explorer');
    setActionInProgress(null);

    if (success) {
      setDeposits(prev => prev.map(d => d.id === dep.id ? { ...d, status: 'Completed', adminActionBy: admin?.email, adminActionAt: new Date().toISOString() } : d));
      setToastMessage(`Deposit ${dep.id} approved and credited to ${dep.userName}.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalDeposit || !rejectReason.trim()) return;

    setActionInProgress(rejectModalDeposit.id);
    const success = await rejectDeposit(rejectModalDeposit.id, admin?.email || 'admin@velora.io', rejectReason.trim());
    setActionInProgress(null);

    if (success) {
      setDeposits(prev => prev.map(d => d.id === rejectModalDeposit.id ? { ...d, status: 'Rejected', adminActionBy: admin?.email, adminNotes: rejectReason.trim() } : d));
      setToastMessage(`Deposit ${rejectModalDeposit.id} marked as Rejected.`);
      setTimeout(() => setToastMessage(null), 3500);
    }

    setRejectModalDeposit(null);
    setRejectReason('');
  };

  const filteredDeposits = deposits.filter(d => {
    const matchesSearch = 
      d.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.txHash && d.txHash.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || d.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ArrowDownToLine className="w-6 h-6 text-emerald-400" />
            <span>Deposit Management & Verification</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit inbound USDT payments via HELEKET gateway (BEP20 / TRC20) backed by real database records.
          </p>
        </div>

        <button
          onClick={loadDeposits}
          disabled={loading}
          className="px-3 py-1.5 bg-[#121620] hover:bg-[#181e2b] border border-[#232c3c] text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin text-rose-500' : ''}`} />
          <span>Refresh Ledger</span>
        </button>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by Tx ID, user, hash..."
            className="w-full bg-[#121620] border border-[#212b3c] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs pb-1 md:pb-0">
          {(['All', 'Pending', 'Completed', 'Rejected'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                statusFilter === tab
                  ? 'bg-rose-600 text-white font-semibold'
                  : 'bg-[#121620] hover:bg-[#181e2b] text-slate-400 hover:text-slate-200 border border-[#212b3c]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Deposits Table */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#0e121a] border-b border-[#1b2332] text-slate-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">Transaction ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Amount (USDT)</th>
                <th className="py-3 px-4">Network</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151c27] text-slate-300">
              {filteredDeposits.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No deposit transactions found matching filters.
                  </td>
                </tr>
              ) : (
                filteredDeposits.map(d => (
                  <tr key={d.id} className="hover:bg-[#11151f] transition-colors">
                    
                    {/* Tx ID */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-mono font-semibold text-white block">{d.id}</span>
                        {d.txHash && (
                          <span className="font-mono text-[10px] text-slate-500 truncate max-w-[120px] block">
                            {d.txHash.slice(0, 8)}...{d.txHash.slice(-6)}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* User */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-white block">{d.userName}</span>
                        <span className="font-mono text-[10px] text-slate-400">{d.userEmail}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 font-mono font-bold text-emerald-400 tabular-nums">
                      +{d.amount.toFixed(2)} USDT
                    </td>

                    {/* Network */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161c28] text-slate-300 border border-[#212b3c]">
                        {d.network}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(d.date).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono ${
                        d.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : d.status === 'Pending'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {d.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        <button
                          onClick={() => setSelectedDeposit(d)}
                          title="View Details"
                          className="p-1.5 bg-[#161c28] hover:bg-[#1d2535] text-slate-300 hover:text-white rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {d.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(d)}
                              disabled={actionInProgress === d.id}
                              title="Approve & Credit Balance"
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-mono text-[11px] font-medium transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <Check className="w-3 h-3" />
                              <span>Approve</span>
                            </button>

                            <button
                              onClick={() => {
                                setRejectModalDeposit(d);
                                setRejectReason('');
                              }}
                              disabled={actionInProgress === d.id}
                              title="Reject Deposit"
                              className="p-1.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 border border-rose-500/20 rounded-lg transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}

                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW DEPOSIT DETAILS MODAL */}
      {selectedDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0e121a] border border-[#232d3f] rounded-2xl p-6 text-slate-100 space-y-5 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedDeposit(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                <ArrowDownToLine className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Deposit #{selectedDeposit.id}</h3>
                <span className="text-xs font-mono text-slate-400">{new Date(selectedDeposit.date).toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Customer</span>
                <span className="font-semibold text-white">{selectedDeposit.userName}</span>
                <span className="font-mono text-[10px] text-slate-500 block">{selectedDeposit.userEmail}</span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Amount Credited</span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  +{selectedDeposit.amount.toFixed(2)} USDT
                </span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Network & Gateway</span>
                <span className="font-mono text-white">{selectedDeposit.network} (HELEKET)</span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Transaction Status</span>
                <span className={`font-mono font-semibold ${selectedDeposit.status === 'Completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {selectedDeposit.status}
                </span>
              </div>
            </div>

            {selectedDeposit.txHash && (
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535] text-xs">
                <span className="text-slate-400 block mb-1">Blockchain Transaction Hash</span>
                <span className="font-mono text-slate-300 break-all text-[11px] block select-all">
                  {selectedDeposit.txHash}
                </span>
              </div>
            )}

            {selectedDeposit.adminNotes && (
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535] text-xs">
                <span className="text-slate-400 block mb-1">Audit Notes / Reason:</span>
                <p className="text-slate-300 text-[11px]">{selectedDeposit.adminNotes}</p>
                {selectedDeposit.adminActionBy && (
                  <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                    By: {selectedDeposit.adminActionBy}
                  </span>
                )}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedDeposit(null)}
                className="px-4 py-1.5 bg-[#161c28] hover:bg-[#202738] text-white text-xs font-medium rounded-lg"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* REJECT DEPOSIT MODAL */}
      {rejectModalDeposit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0e121a] border border-[#232d3f] rounded-2xl p-6 text-slate-100 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>Reject Deposit #{rejectModalDeposit.id}</span>
            </h3>

            <p className="text-xs text-slate-400">
              State the reason for rejecting this deposit (e.g. invalid hash, wrong network, under minimum threshold). This will be recorded in the audit ledger.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="w-full bg-[#121620] border border-[#212b3c] rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalDeposit(null)}
                  className="px-3.5 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionInProgress === rejectModalDeposit.id}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
