import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Eye, 
  UserCheck, 
  UserX, 
  RefreshCw,
  Calendar,
  Wallet,
  ShoppingBag,
  ArrowDownToLine,
  ArrowUpFromLine,
  X
} from 'lucide-react';
import { AdminUserRecord } from '../../types/admin';
import { getAdminUsers, updateAdminUserStatus } from '../../lib/adminService';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminUsers: React.FC = () => {
  const { admin } = useAdminAuth();
  const [users, setUsers] = useState<AdminUserRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Under Review' | 'Suspended'>('All');
  
  const [selectedUser, setSelectedUser] = useState<AdminUserRecord | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getAdminUsers();
      setUsers(data);
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleToggleStatus = async (user: AdminUserRecord) => {
    const nextStatus = user.accountStatus === 'Active' ? 'Suspended' : 'Active';
    const confirmPrompt = window.confirm(`Are you sure you want to mark ${user.name} as "${nextStatus}"?`);
    if (!confirmPrompt) return;

    setActionInProgress(user.id);
    const success = await updateAdminUserStatus(user.id, nextStatus, admin?.email || 'admin@velora.io');
    setActionInProgress(null);

    if (success) {
      setUsers(prev => prev.map(u => u.id === user.id ? { ...u, accountStatus: nextStatus } : u));
      if (selectedUser?.id === user.id) {
        setSelectedUser(prev => prev ? { ...prev, accountStatus: nextStatus } : null);
      }
      setToastMessage(`User ${user.name} status updated to ${nextStatus}.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  // Filtered and searched users
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.referralCode && u.referralCode.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || u.accountStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-rose-500" />
            <span>Customer Account Directory</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit user profiles, security compliance status, active balances, and account authorization.
          </p>
        </div>

        <button
          onClick={loadUsers}
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

      {/* Search and Filters Bar */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-xl p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, user ID..."
            className="w-full bg-[#121620] border border-[#212b3c] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Filter Buttons */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs pb-1 md:pb-0">
          {(['All', 'Active', 'Under Review', 'Suspended'] as const).map(tab => (
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

      {/* Users Table */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#0e121a] border-b border-[#1b2332] text-slate-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Registration</th>
                <th className="py-3 px-4">Balance</th>
                <th className="py-3 px-4">Orders</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151c27] text-slate-300">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No users found matching query.
                  </td>
                </tr>
              ) : (
                filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-[#11151f] transition-colors">
                    
                    {/* User */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold text-xs shrink-0">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <span className="font-semibold text-white block">{u.name}</span>
                          <span className="font-mono text-[10px] text-slate-500">{u.id}</span>
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {u.email}
                    </td>

                    {/* Registered Date */}
                    <td className="py-3 px-4 text-slate-400">
                      {u.registeredAt ? new Date(u.registeredAt).toLocaleDateString() : 'N/A'}
                    </td>

                    {/* Balance */}
                    <td className="py-3 px-4 font-mono font-semibold text-emerald-400 tabular-nums">
                      {Number(u.walletBalanceUSDT || 0).toFixed(2)} USDT
                    </td>

                    {/* Orders count */}
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {u.totalOrdersCount || 0}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono ${
                        u.accountStatus === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : u.accountStatus === 'Under Review'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}>
                        {u.accountStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* View Details */}
                        <button
                          onClick={() => setSelectedUser(u)}
                          title="View Complete User Details"
                          className="p-1.5 bg-[#161c28] hover:bg-[#1d2535] text-slate-300 hover:text-white rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Enable / Disable Button */}
                        <button
                          onClick={() => handleToggleStatus(u)}
                          disabled={actionInProgress === u.id}
                          title={u.accountStatus === 'Active' ? 'Suspend Account' : 'Reactivate Account'}
                          className={`p-1.5 rounded-lg transition-colors ${
                            u.accountStatus === 'Active'
                              ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}
                        >
                          {actionInProgress === u.id ? (
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          ) : u.accountStatus === 'Active' ? (
                            <UserX className="w-3.5 h-3.5" />
                          ) : (
                            <UserCheck className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* USER DETAIL MODAL / DRAWER */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0e121a] border border-[#232d3f] rounded-2xl p-6 text-slate-100 space-y-5 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold text-lg">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{selectedUser.name}</h3>
                <span className="text-xs font-mono text-slate-400">{selectedUser.email}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">User ID</span>
                <span className="font-mono text-white">{selectedUser.id}</span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Account Status</span>
                <span className={`font-mono font-semibold ${selectedUser.accountStatus === 'Active' ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {selectedUser.accountStatus}
                </span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Wallet Balance</span>
                <span className="font-mono font-bold text-emerald-400">
                  {Number(selectedUser.walletBalanceUSDT || 0).toFixed(2)} USDT
                </span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Referral Code</span>
                <span className="font-mono text-rose-400 font-semibold">{selectedUser.referralCode || 'N/A'}</span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Total Deposits</span>
                <span className="font-mono text-slate-200">
                  +{Number(selectedUser.totalDepositAmount || 0).toFixed(2)} USDT
                </span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Total Withdrawals</span>
                <span className="font-mono text-slate-200">
                  -{Number(selectedUser.totalWithdrawalAmount || 0).toFixed(2)} USDT
                </span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-[#1b2332]">
              <button
                onClick={() => handleToggleStatus(selectedUser)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  selectedUser.accountStatus === 'Active'
                    ? 'bg-rose-600/20 text-rose-400 hover:bg-rose-600/30'
                    : 'bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600/30'
                }`}
              >
                {selectedUser.accountStatus === 'Active' ? 'Suspend User Access' : 'Reactivate Account'}
              </button>

              <button
                onClick={() => setSelectedUser(null)}
                className="px-4 py-1.5 bg-[#161c28] hover:bg-[#202738] text-white text-xs font-medium rounded-lg"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
