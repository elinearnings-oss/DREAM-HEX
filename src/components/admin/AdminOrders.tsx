import React, { useEffect, useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  RefreshCw, 
  Eye, 
  X, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { AdminOrderRecord } from '../../types/admin';
import { getAdminOrders, updateAdminOrderStatus } from '../../lib/adminService';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminOrders: React.FC = () => {
  const { admin } = useAdminAuth();
  const [orders, setOrders] = useState<AdminOrderRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Pending Activation' | 'Completed' | 'Suspended'>('All');
  
  const [selectedOrder, setSelectedOrder] = useState<AdminOrderRecord | null>(null);
  const [actionInProgress, setActionInProgress] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAdminOrders();
      setOrders(data);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, newStatus: AdminOrderRecord['orderStatus']) => {
    setActionInProgress(orderId);
    const success = await updateAdminOrderStatus(orderId, newStatus, admin?.email || 'admin@velora.io');
    setActionInProgress(null);

    if (success) {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, orderStatus: newStatus } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, orderStatus: newStatus } : null);
      }
      setToastMessage(`Order ${orderId} status set to ${newStatus}.`);
      setTimeout(() => setToastMessage(null), 3500);
    }
  };

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.productName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-emerald-400" />
            <span>Product Orders & Allocations</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit customer product purchases, 24-hour cycle yield progressions, and active computing slots.
          </p>
        </div>

        <button
          onClick={loadOrders}
          disabled={loading}
          className="px-3 py-1.5 bg-[#121620] hover:bg-[#181e2b] border border-[#232c3c] text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin text-rose-500' : ''}`} />
          <span>Refresh</span>
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
            placeholder="Search by Order ID, customer, product..."
            className="w-full bg-[#121620] border border-[#212b3c] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs pb-1 md:pb-0">
          {(['All', 'Active', 'Pending Activation', 'Completed', 'Suspended'] as const).map(tab => (
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

      {/* Orders Table */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#0e121a] border-b border-[#1b2332] text-slate-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Daily Yield (5%)</th>
                <th className="py-3 px-4">Cycle</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151c27] text-slate-300">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No orders found matching filters.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(o => (
                  <tr key={o.id} className="hover:bg-[#11151f] transition-colors">
                    
                    {/* Order ID */}
                    <td className="py-3 px-4 font-mono font-semibold text-rose-400">
                      {o.id}
                    </td>

                    {/* Customer */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-white block">{o.customerName}</span>
                        <span className="font-mono text-[10px] text-slate-400">{o.customerEmail}</span>
                      </div>
                    </td>

                    {/* Product */}
                    <td className="py-3 px-4 text-slate-200 font-medium">
                      {o.productName}
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                      {o.amount.toFixed(2)} USDT
                    </td>

                    {/* Yield */}
                    <td className="py-3 px-4 font-mono text-emerald-400 tabular-nums">
                      +{o.dailyRewardAmount.toFixed(2)} USDT
                    </td>

                    {/* Cycle */}
                    <td className="py-3 px-4 font-mono text-slate-300">
                      Cycle #{o.currentCycle}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-mono ${
                        o.orderStatus === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : o.orderStatus === 'Pending Activation'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-700/30 text-slate-400 border border-slate-700/50'
                      }`}>
                        {o.orderStatus}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedOrder(o)}
                          title="View Order Details"
                          className="p-1.5 bg-[#161c28] hover:bg-[#1d2535] text-slate-300 hover:text-white rounded-lg transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
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

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0e121a] border border-[#232d3f] rounded-2xl p-6 text-slate-100 space-y-5 shadow-2xl relative">
            
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Order Details: {selectedOrder.id}</h3>
                <span className="text-xs font-mono text-slate-400">Purchased on {new Date(selectedOrder.purchaseDate).toLocaleString()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Customer</span>
                <span className="font-semibold text-white">{selectedOrder.customerName}</span>
                <span className="font-mono text-[10px] text-slate-500 block">{selectedOrder.customerEmail}</span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Product</span>
                <span className="font-semibold text-white">{selectedOrder.productName}</span>
                <span className="font-mono text-[10px] text-slate-500 block">{selectedOrder.amount} USDT</span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Cycle Progress</span>
                <span className="font-mono text-rose-400 font-semibold">
                  Cycle #{selectedOrder.currentCycle} ({selectedOrder.totalCyclesCompleted} completed)
                </span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Rewards Distributed</span>
                <span className="font-mono text-emerald-400 font-bold">
                  +{selectedOrder.totalRewardsPaid.toFixed(2)} USDT
                </span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Next Reward Time</span>
                <span className="font-mono text-slate-300">
                  {selectedOrder.nextRewardTime ? new Date(selectedOrder.nextRewardTime).toLocaleTimeString() : 'N/A'}
                </span>
              </div>
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1e2535]">
                <span className="text-slate-400 block mb-0.5">Payment Status</span>
                <span className="font-mono text-emerald-400 font-semibold">{selectedOrder.paymentStatus}</span>
              </div>
            </div>

            {/* Status Modification */}
            <div className="pt-2 border-t border-[#1b2332] space-y-2">
              <label className="text-xs font-semibold text-slate-300 block">Change Allocation Status:</label>
              <div className="flex items-center gap-2 text-xs">
                {(['Active', 'Pending Activation', 'Completed', 'Suspended'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateStatus(selectedOrder.id, st)}
                    disabled={selectedOrder.orderStatus === st || actionInProgress === selectedOrder.id}
                    className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                      selectedOrder.orderStatus === st
                        ? 'bg-rose-600 text-white font-semibold'
                        : 'bg-[#161c28] hover:bg-[#202738] text-slate-400 hover:text-white'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedOrder(null)}
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
