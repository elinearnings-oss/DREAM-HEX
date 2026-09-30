import React, { useEffect, useState } from 'react';
import { 
  ArrowUpFromLine, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RefreshCw, 
  Eye, 
  Check, 
  X, 
  Send,
  ExternalLink,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { AdminWithdrawalRecord } from '../../types/admin';
import { getAdminWithdrawals, approveWithdrawal, rejectWithdrawal } from '../../lib/adminService';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminWithdrawals: React.FC = () => {
  const { admin } = useAdminAuth();
  const [withdrawals, setWithdrawals] = useState<AdminWithdrawalRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Pending' | 'Completed' | 'Rejected'>('All');

  // Modals & Action States
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<AdminWithdrawalRecord | null>(null);
  const [broadcastModalWth, setBroadcastModalWth] = useState<AdminWithdrawalRecord | null>(null);
  const [broadcastTxHash, setBroadcastTxHash] = useState<string>('');
  const [broadcastNotes, setBroadcastNotes] = useState<string>('');

  const [rejectModalWth, setRejectModalWth] = useState<AdminWithdrawalRecord | null>(null);
  const [rejectReason, setRejectReason] = useState<string>('');

  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadWithdrawals = async () => {
    setLoading(true);
    try {
      const data = await getAdminWithdrawals();
      setWithdrawals(data);
    } catch (err) {
      console.error('Failed to load withdrawals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWithdrawals();
  }, []);

  const openBroadcastModal = (w: AdminWithdrawalRecord) => {
    setBroadcastModalWth(w);
    setBroadcastTxHash(
      w.network === 'BEP20'
        ? `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
        : `tx${Array.from({ length: 62 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
    );
    setBroadcastNotes(`Broadcasted on ${w.network} network with 0% fee`);
  };

  const handleBroadcastSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastModalWth) return;

    setActionInProgress(broadcastModalWth.id);
    const success = await approveWithdrawal(
      broadcastModalWth.id, 
      admin?.email || 'admin@velora.io', 
      broadcastTxHash.trim(), 
      broadcastNotes.trim()
    );
    setActionInProgress(null);

    if (success) {
      setWithdrawals(prev => prev.map(w => w.id === broadcastModalWth.id ? {
        ...w,
        status: 'Completed',
        txHash: broadcastTxHash.trim(),
        adminActionBy: admin?.email,
        adminActionAt: new Date().toISOString(),
        adminNotes: broadcastNotes.trim()
      } : w));
      setToastMessage(`Withdrawal ${broadcastModalWth.id} broadcast confirmed.`);
      setTimeout(() => setToastMessage(null), 3500);
    }

    setBroadcastModalWth(null);
  };

  const handleRejectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectModalWth || !rejectReason.trim()) return;

    setActionInProgress(rejectModalWth.id);
    const success = await rejectWithdrawal(
      rejectModalWth.id, 
      admin?.email || 'admin@velora.io', 
      rejectReason.trim()
    );
    setActionInProgress(null);

    if (success) {
      setWithdrawals(prev => prev.map(w => w.id === rejectModalWth.id ? {
        ...w,
        status: 'Rejected',
        adminActionBy: admin?.email,
        adminNotes: rejectReason.trim()
      } : w));
      setToastMessage(`Withdrawal ${rejectModalWth.id} rejected and funds refunded to customer balance.`);
      setTimeout(() => setToastMessage(null), 3500);
    }

    setRejectModalWth(null);
    setRejectReason('');
  };

  const filteredWithdrawals = withdrawals.filter(w => {
    const matchesSearch = 
      w.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.walletAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (w.txHash && w.txHash.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || w.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ArrowUpFromLine className="w-6 h-6 text-rose-500" />
            <span>Withdrawal Requests & Payouts</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Process outbound USDT requests (0% fee), verify blockchain destinations, and record transaction hashes.
          </p>
        </div>

        <button
          onClick={loadWithdrawals}
          disabled={loading}
          className="px-3 py-1.5 bg-[#121620] hover:bg-[#181e2b] border border-[#232c3c] text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin text-rose-500' : ''}`} />
          <span>Refresh List</span>
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
            placeholder="Search by ID, user, address, tx hash..."
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

      {/* Withdrawals Table */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#0e121a] border-b border-[#1b2332] text-slate-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">Withdrawal ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Network</th>
                <th className="py-3 px-4">Destination Address</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151c27] text-slate-300">
              {filteredWithdrawals.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No withdrawal requests found matching filters.
                  </td>
                </tr>
              ) : (
                filteredWithdrawals.map(w => (
                  <tr key={w.id} className="hover:bg-[#11151f] transition-colors">
                    
                    {/* ID */}
                    <td className="py-3 px-4 font-mono font-semibold text-rose-400">
                      {w.id}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-white block">{w.userName}</span>
                        <span className="font-mono text-[10px] text-slate-400">{w.userEmail}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 font-mono font-bold text-rose-400 tabular-nums">
                      -{w.amount.toFixed(2)} USDT
                    </td>

                    {/* Network */}
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161c28] text-slate-300 border border-[#212b3c]">
                        {w.network}
                      </span>
                    </td>

                    {/* Address */}
                    <td className="py-3 px-4 font-mono text-slate-400">
                      <span className="truncate max-w-[140px] block" title={w.walletAddress}>
                        {w.walletAddress.slice(0, 8)}...{w.walletAddress.slice(-6)}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 px-4 text-slate-400">
                      {new Date(w.date).toLocaleString()}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono ${
                        w.status === 'Completed'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : w.status === 'Pending'
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 animate-pulse'
                          : 'bg-slate-700/30 text-slate-400 border border-slate-700/50'
                      }`}>
                        {w.status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        <button
                          onClick={() => setSelectedWithdrawal(w)}
                          title="View Details"
                          className="p-1.5 bg-[#161c28] hover:bg-[#1d2535] text-slate-300 hover:text-white rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {w.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => openBroadcastModal(w)}
                              disabled={actionInProgress === w.id}
                              title="Broadcast Payout"
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-mono text-[11px] font-medium transition-colors flex items-center gap-1 shadow-sm"
                            >
                              <Send className="w-3 h-3" />
                              <span>Broadcast</span>
                            </button>

                            <button
                              onClick={() => {
                                setRejectModalWth(w);
                                setRejectReason('');
                              }}
                              disabled={actionInProgress === w.id}
                              title="Reject & Refund User"
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

      {/* VIEW WITHDRAWAL DETAILS MODAL */}
      {selectedWithdrawal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0e121a] border border-[#232d3f] rounded-2xl p-6 text-slate-100 space-y-5 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedWithdrawal(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-600/20 text-rose-500 flex items-center justify-center font-bold">
                <ArrowUpFromLine className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Withdrawal #{selectedWithdrawal.id}</h3>
                <span className="text-xs font-mono text-slate-400">{new Date(selectedWithdrawal.date).toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Customer</span>
                <span className="font-semibold text-white">{selectedWithdrawal.userName}</span>
                <span className="font-mono text-[10px] text-slate-500 block">{selectedWithdrawal.userEmail}</span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Amount (0% Fee)</span>
                <span className="font-mono font-bold text-rose-400 text-sm">
                  -{selectedWithdrawal.amount.toFixed(2)} USDT
                </span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Network</span>
                <span className="font-mono text-white">{selectedWithdrawal.network}</span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Status</span>
                <span className={`font-mono font-semibold ${selectedWithdrawal.status === 'Completed' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedWithdrawal.status}
                </span>
              </div>
            </div>

            <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535] text-xs">
              <span className="text-slate-400 block mb-1">Destination Wallet Address:</span>
              <span className="font-mono text-white break-all text-[11px] block select-all">
                {selectedWithdrawal.walletAddress}
              </span>
            </div>

            {selectedWithdrawal.txHash && (
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535] text-xs">
                <span className="text-slate-400 block mb-1">Broadcast Transaction Hash:</span>
                <span className="font-mono text-emerald-400 break-all text-[11px] block select-all">
                  {selectedWithdrawal.txHash}
                </span>
              </div>
            )}

            {selectedWithdrawal.adminNotes && (
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535] text-xs">
                <span className="text-slate-400 block mb-1">Audit Log / Notes:</span>
                <p className="text-slate-300 text-[11px]">{selectedWithdrawal.adminNotes}</p>
                {selectedWithdrawal.adminActionBy && (
                  <span className="text-[10px] text-slate-500 block mt-1 font-mono">
                    By: {selectedWithdrawal.adminActionBy}
                  </span>
                )}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedWithdrawal(null)}
                className="px-4 py-1.5 bg-[#161c28] hover:bg-[#202738] text-white text-xs font-medium rounded-lg"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* BROADCAST PAYOUT MODAL */}
      {broadcastModalWth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0e121a] border border-[#232d3f] rounded-2xl p-6 text-slate-100 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-400" />
              <span>Broadcast Withdrawal #{broadcastModalWth.id}</span>
            </h3>

            <p className="text-xs text-slate-400">
              Confirm outbound transfer of <strong className="text-white">{broadcastModalWth.amount} USDT</strong> to {broadcastModalWth.network} address.
            </p>

            <form onSubmit={handleBroadcastSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Destination Address</label>
                <input
                  type="text"
                  readOnly
                  value={broadcastModalWth.walletAddress}
                  className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-slate-400 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Blockchain Tx Hash / Broadcast ID *</label>
                <input
                  type="text"
                  required
                  value={broadcastTxHash}
                  onChange={e => setBroadcastTxHash(e.target.value)}
                  placeholder="0x... or tx..."
                  className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Audit Notes</label>
                <input
                  type="text"
                  value={broadcastNotes}
                  onChange={e => setBroadcastNotes(e.target.value)}
                  placeholder="Verification note..."
                  className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBroadcastModalWth(null)}
                  className="px-3.5 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionInProgress === broadcastModalWth.id}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  Confirm & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REJECT WITHDRAWAL MODAL */}
      {rejectModalWth && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-[#0e121a] border border-[#232d3f] rounded-2xl p-6 text-slate-100 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-500" />
              <span>Reject Withdrawal #{rejectModalWth.id}</span>
            </h3>

            <p className="text-xs text-slate-400">
              Rejecting this withdrawal will automatically refund <strong className="text-white">{rejectModalWth.amount} USDT</strong> back to the customer's available balance in the database.
            </p>

            <form onSubmit={handleRejectSubmit} className="space-y-4 text-xs">
              <textarea
                rows={3}
                required
                value={rejectReason}
                onChange={e => setRejectReason(e.target.value)}
                placeholder="Reason for rejection (e.g. invalid wallet address format, compliance review)..."
                className="w-full bg-[#121620] border border-[#212b3c] rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setRejectModalWth(null)}
                  className="px-3.5 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionInProgress === rejectModalWth.id}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg shadow-sm"
                >
                  Confirm Reject & Refund
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
