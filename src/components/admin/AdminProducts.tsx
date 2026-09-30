import React, { useEffect, useState } from 'react';
import { 
  Package, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Check, 
  X, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw,
  Tag,
  DollarSign,
  Clock,
  Layers
} from 'lucide-react';
import { Product } from '../../types';
import { getAdminProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct } from '../../lib/adminService';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminProducts: React.FC = () => {
  const { admin } = useAdminAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [tier, setTier] = useState('Tier 1 - Starter');
  const [priceUSDT, setPriceUSDT] = useState<number>(10);
  const [dailyRewardRate, setDailyRewardRate] = useState<number>(0.05);
  const [cycleHours, setCycleHours] = useState<number>(24);
  const [description, setDescription] = useState('');
  const [allocationLimit, setAllocationLimit] = useState<number>(50);
  const [availableSlots, setAvailableSlots] = useState<number>(38);
  const [badge, setBadge] = useState('');
  const [featuresText, setFeaturesText] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await getAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setTier('Tier 1 - Starter');
    setPriceUSDT(10);
    setDailyRewardRate(0.05);
    setCycleHours(24);
    setDescription('');
    setAllocationLimit(50);
    setAvailableSlots(50);
    setBadge('');
    setFeaturesText('Daily 24h reward rate: 5%\nInstant cycle settlement\nDirect wallet credit');
    setIsModalOpen(true);
  };

  const openEditModal = (p: Product) => {
    setEditingProduct(p);
    setName(p.name);
    setTier(p.tier);
    setPriceUSDT(p.priceUSDT);
    setDailyRewardRate(p.dailyRewardRate || 0.05);
    setCycleHours(p.cycleHours || 24);
    setDescription(p.description);
    setAllocationLimit(p.allocationLimit);
    setAvailableSlots(p.availableSlots);
    setBadge(p.badge || '');
    setFeaturesText(p.features ? p.features.join('\n') : '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || priceUSDT <= 0) return;

    setSubmitting(true);
    const featuresList = featuresText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const productPayload = {
      name: name.trim(),
      tier,
      priceUSDT: Number(priceUSDT),
      dailyRewardRate: Number(dailyRewardRate),
      cycleHours: Number(cycleHours),
      description: description.trim(),
      features: featuresList,
      allocationLimit: Number(allocationLimit),
      availableSlots: Number(availableSlots),
      minDurationDays: 1,
      badge: badge.trim() || undefined
    };

    if (editingProduct) {
      const success = await updateAdminProduct(editingProduct.id, productPayload, admin?.email || 'admin@velora.io');
      if (success) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...productPayload } : p));
        setToastMessage(`Product "${name}" updated successfully.`);
      }
    } else {
      const res = await createAdminProduct(productPayload, admin?.email || 'admin@velora.io');
      if (res.success && res.id) {
        setProducts(prev => [{ ...productPayload, id: res.id! }, ...prev]);
        setToastMessage(`New product "${name}" added to catalog.`);
      }
    }

    setSubmitting(false);
    setIsModalOpen(false);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDelete = async (productId: string) => {
    const success = await deleteAdminProduct(productId, admin?.email || 'admin@velora.io');
    if (success) {
      setProducts(prev => prev.filter(p => p.id !== productId));
      setToastMessage('Product deleted successfully.');
      setTimeout(() => setToastMessage(null), 3500);
    }
    setDeleteConfirmId(null);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tier.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Package className="w-6 h-6 text-purple-400" />
            <span>Product Catalog & Yield Nodes</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure node allocations, 24h reward percentages (5%), slot capacities, and tier pricing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadProducts}
            disabled={loading}
            className="px-3 py-1.5 bg-[#121620] hover:bg-[#181e2b] border border-[#232c3c] text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin text-rose-500' : ''}`} />
            <span>Refresh</span>
          </button>
          <button
            onClick={openCreateModal}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-xl p-4 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search products by title, tier, ID..."
            className="w-full bg-[#121620] border border-[#212b3c] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
        <span className="text-xs font-mono text-slate-400">
          {filteredProducts.length} items cataloged
        </span>
      </div>

      {/* Products Table */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#0e121a] border-b border-[#1b2332] text-slate-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Tier / Category</th>
                <th className="py-3 px-4">Price (USDT)</th>
                <th className="py-3 px-4">24h Daily Yield</th>
                <th className="py-3 px-4">Cycle</th>
                <th className="py-3 px-4">Slots (Available/Total)</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151c27] text-slate-300">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No products found. Click "Add New Product" to create one.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-[#11151f] transition-colors">
                    
                    {/* Name */}
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-white block">{p.name}</span>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-slate-500">{p.id}</span>
                          {p.badge && (
                            <span className="px-1.5 py-0.2 bg-rose-500/10 text-rose-400 rounded text-[9px] font-mono border border-rose-500/20">
                              {p.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Tier */}
                    <td className="py-3 px-4 text-slate-300">
                      {p.tier}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-mono font-bold text-white tabular-nums">
                      {p.priceUSDT} USDT
                    </td>

                    {/* Daily Yield */}
                    <td className="py-3 px-4 font-mono text-emerald-400">
                      {((p.dailyRewardRate || 0.05) * 100).toFixed(0)}% ({(p.priceUSDT * (p.dailyRewardRate || 0.05)).toFixed(2)} USDT)
                    </td>

                    {/* Cycle */}
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {p.cycleHours || 24} Hours
                    </td>

                    {/* Slots */}
                    <td className="py-3 px-4 font-mono text-slate-300">
                      <span className={p.availableSlots < 10 ? 'text-rose-400 font-bold' : ''}>
                        {p.availableSlots}
                      </span> / {p.allocationLimit}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openEditModal(p)}
                          title="Edit Product"
                          className="p-1.5 bg-[#161c28] hover:bg-[#1d2535] text-slate-300 hover:text-white rounded-lg transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(p.id)}
                          title="Delete Product"
                          className="p-1.5 bg-rose-600/10 hover:bg-rose-600/20 text-rose-400 rounded-lg transition-colors border border-rose-500/20"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-[#0e121a] border border-[#232d3f] rounded-2xl p-6 text-slate-100 space-y-4 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Package className="w-5 h-5 text-rose-500" />
              <span>{editingProduct ? 'Edit Product Allocation' : 'Create New Yield Product'}</span>
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="e.g. Velora Node V5"
                    className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Tier / Category</label>
                  <input
                    type="text"
                    value={tier}
                    onChange={e => setTier(e.target.value)}
                    placeholder="e.g. Tier 1 - Starter"
                    className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Price (USDT) *</label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={priceUSDT}
                    onChange={e => setPriceUSDT(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Daily Reward Rate</label>
                  <input
                    type="number"
                    min="0.01"
                    max="0.5"
                    step="0.01"
                    value={dailyRewardRate}
                    onChange={e => setDailyRewardRate(parseFloat(e.target.value) || 0.05)}
                    className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">0.05 = 5% per cycle</span>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Cycle Hours</label>
                  <input
                    type="number"
                    min="1"
                    value={cycleHours}
                    onChange={e => setCycleHours(parseInt(e.target.value, 10) || 24)}
                    className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Total Capacity Limit</label>
                  <input
                    type="number"
                    min="1"
                    value={allocationLimit}
                    onChange={e => setAllocationLimit(parseInt(e.target.value, 10) || 50)}
                    className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Available Remaining Slots</label>
                  <input
                    type="number"
                    min="0"
                    value={availableSlots}
                    onChange={e => setAvailableSlots(parseInt(e.target.value, 10) || 0)}
                    className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white font-mono focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Badge (Optional)</label>
                  <input
                    type="text"
                    value={badge}
                    onChange={e => setBadge(e.target.value)}
                    placeholder="e.g. Popular, Recommended"
                    className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Comprehensive description of digital computing slot..."
                  className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Feature Bullet Points (One per line)</label>
                <textarea
                  rows={3}
                  value={featuresText}
                  onChange={e => setFeaturesText(e.target.value)}
                  placeholder="Daily 24h reward rate: 5%&#10;Direct wallet settlement&#10;Priority node queue"
                  className="w-full bg-[#121620] border border-[#212b3c] rounded-lg p-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1b2332]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {submitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
                  )}
                  <span>{editingProduct ? 'Save Changes' : 'Create Product'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-[#0e121a] border border-[#232d3f] rounded-2xl p-6 text-slate-100 space-y-4 shadow-2xl">
            <div className="w-10 h-10 rounded-full bg-rose-600/20 text-rose-500 mx-auto flex items-center justify-center">
              <Trash2 className="w-5 h-5" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-white">Delete Product from Catalog?</h3>
              <p className="text-xs text-slate-400">
                This will remove the product from the public catalog. Existing users with active cycles will continue uninterrupted.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-1.5 bg-[#161c28] hover:bg-[#1d2535] text-slate-300 text-xs font-medium rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
