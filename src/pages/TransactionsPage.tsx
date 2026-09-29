import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TransactionType, TransactionStatus } from '../types';
import { Search, Filter, ArrowDownToLine, ArrowUpFromLine, RefreshCw, Layers, Users, Eye, X } from 'lucide-react';

export const TransactionsPage: React.FC = () => {
  const { transactions } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedTx, setSelectedTx] = useState<any>(null);

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (tx.note && tx.note.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.walletAddress && tx.walletAddress.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType = typeFilter === 'all' || tx.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;

    return matchesSearch && matchesType && matchesStatus;
  });

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'Deposit':
        return <ArrowDownToLine className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Withdrawal':
        return <ArrowUpFromLine className="w-3.5 h-3.5 text-rose-400" />;
      case 'Product Reward':
        return <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />;
      case 'Referral Reward':
        return <Users className="w-3.5 h-3.5 text-rose-400" />;
      case 'Product Purchase':
        return <Layers className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Title */}
      <div className="pb-6 border-b border-[#1b2332]">
        <div className="flex items-center gap-2 text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">
          <span>Ledger Records</span>
          <span aria-hidden="true">·</span>
          <span>Transparent Accounting</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Transaction History
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          Search, filter, and review complete records of deposits, product purchases, 5% daily rewards, and withdrawals.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-5 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          
          {/* Search box */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by Tx ID, address, or note..."
              className="w-full bg-[#121620] border border-[#212b3c] rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
            />
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value)}
            className="bg-[#121620] border border-[#212b3c] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="all">All Transaction Types</option>
            <option value="Deposit">Deposit</option>
            <option value="Withdrawal">Withdrawal</option>
            <option value="Product Purchase">Product Purchase</option>
            <option value="Product Reward">Product Reward (5%)</option>
            <option value="Referral Reward">Referral Reward (10%)</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-[#121620] border border-[#212b3c] rounded-xl px-3.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
          >
            <option value="all">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Failed">Failed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12 text-xs text-slate-500">
            No transactions match the selected filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0e1219] border-b border-[#1b2332] text-slate-400 uppercase font-mono">
                <tr>
                  <th className="py-3 px-4">Tx ID</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Network</th>
                  <th className="py-3 px-4">Date & Time</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141b26] text-slate-300">
                {filteredTransactions.map(tx => {
                  const isCredit = tx.type === 'Deposit' || tx.type === 'Product Reward' || tx.type === 'Referral Reward';
                  return (
                    <tr key={tx.id} className="hover:bg-[#121621] transition-colors">
                      <td className="py-3 px-4 font-mono font-medium text-slate-200">
                        {tx.id}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          {getTypeIcon(tx.type)}
                          <span className="font-medium text-slate-200">{tx.type}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono tabular-nums font-bold">
                        <span className={isCredit ? 'text-emerald-400' : 'text-slate-300'}>
                          {isCredit ? '+' : '-'}{tx.amount.toFixed(2)} USDT
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {tx.network || 'Internal'}
                      </td>
                      <td className="py-3 px-4 text-slate-400 whitespace-nowrap">
                        {new Date(tx.date).toLocaleDateString()} {new Date(tx.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className={`font-mono text-xs ${
                          tx.status === 'Completed' ? 'text-emerald-400' :
                          tx.status === 'Pending' ? 'text-amber-400' : 'text-rose-400'
                        }`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedTx(tx)}
                          className="p-1 hover:bg-[#1c2433] rounded text-slate-400 hover:text-white transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Transaction Details Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-[#0f131a] border border-[#232c3c] rounded-xl p-6 shadow-2xl text-slate-100 relative">
            <button
              onClick={() => setSelectedTx(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white mb-1">Transaction Details</h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">{selectedTx.id}</p>

            <div className="bg-[#131822] border border-[#212b3c] rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Type:</span>
                <span className="font-semibold text-white">{selectedTx.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount:</span>
                <span className="font-mono font-bold text-white">{selectedTx.amount.toFixed(2)} USDT</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Protocol:</span>
                <span className="font-mono text-slate-200">{selectedTx.network || 'Platform Internal'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Status:</span>
                <span className="font-mono text-emerald-400 font-semibold">{selectedTx.status}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Timestamp:</span>
                <span className="text-slate-300 font-mono">{new Date(selectedTx.date).toISOString()}</span>
              </div>
              {selectedTx.note && (
                <div className="pt-2 border-t border-[#1b2332]">
                  <span className="text-slate-400 block mb-0.5">Ledger Note:</span>
                  <p className="text-slate-200 text-[11px] leading-relaxed">{selectedTx.note}</p>
                </div>
              )}
              {selectedTx.txHash && (
                <div className="pt-2 border-t border-[#1b2332]">
                  <span className="text-slate-400 block mb-0.5">Blockchain Tx Hash:</span>
                  <span className="text-slate-400 font-mono text-[10px] break-all">{selectedTx.txHash}</span>
                </div>
              )}
              {selectedTx.walletAddress && (
                <div className="pt-2 border-t border-[#1b2332]">
                  <span className="text-slate-400 block mb-0.5">Destination Address:</span>
                  <span className="text-slate-300 font-mono text-[11px] break-all">{selectedTx.walletAddress}</span>
                </div>
              )}
            </div>

            <div className="mt-5 text-right">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-2 bg-[#171e2c] hover:bg-[#20293a] border border-[#273248] text-xs font-semibold text-slate-200 rounded-lg transition-colors"
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
