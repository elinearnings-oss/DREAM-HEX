import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  ShoppingBag, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  MessageSquare, 
  Settings, 
  History, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink, 
  Shield, 
  ChevronRight,
  User as UserIcon,
  Bell
} from 'lucide-react';
import { brandLogo } from '../../assets/images';

export type AdminSection = 
  | 'dashboard' 
  | 'users' 
  | 'products' 
  | 'orders' 
  | 'payments' 
  | 'withdrawals' 
  | 'support' 
  | 'settings'
  | 'audit-logs';

interface AdminLayoutProps {
  currentSection: AdminSection;
  onNavigate: (section: AdminSection) => void;
  onExitToCustomerSite: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentSection,
  onNavigate,
  onExitToCustomerSite,
  children
}) => {
  const { admin, logout } = useAdminAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
    { id: 'users', label: 'User Directory', icon: Users, path: '/admin/users' },
    { id: 'products', label: 'Product Catalog', icon: Package, path: '/admin/products' },
    { id: 'orders', label: 'Orders & Nodes', icon: ShoppingBag, path: '/admin/orders' },
    { id: 'payments', label: 'Deposits (Inflow)', icon: ArrowDownToLine, path: '/admin/payments' },
    { id: 'withdrawals', label: 'Withdrawals (Outflow)', icon: ArrowUpFromLine, path: '/admin/withdrawals' },
    { id: 'support', label: 'Customer Support', icon: MessageSquare, path: '/admin/support' },
    { id: 'settings', label: 'System Settings', icon: Settings, path: '/admin/settings' },
    { id: 'audit-logs', label: 'Audit Security Logs', icon: History, path: '/admin/audit' },
  ];

  const handleSelect = (sectionId: AdminSection) => {
    onNavigate(sectionId);
    setMobileSidebarOpen(false);
    try {
      window.location.hash = `admin/${sectionId}`;
    } catch {}
  };

  const getSectionTitle = () => {
    const item = navigationItems.find(i => i.id === currentSection);
    return item ? item.label : 'Console Overview';
  };

  return (
    <div className="min-h-screen bg-[#07090d] text-slate-100 flex flex-col font-sans selection:bg-rose-500/20 selection:text-rose-200">
      
      {/* TOP HEADER */}
      <header className="sticky top-0 z-40 w-full bg-[#0a0d14]/90 backdrop-blur-md border-b border-[#1b2332] h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
            aria-label="Toggle Navigation Drawer"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <div className="flex items-center gap-2.5">
            <img 
              src={brandLogo} 
              alt="VELORA" 
              className="w-8 h-8 rounded-lg object-cover border border-rose-500/40"
            />
            <div className="hidden sm:block">
              <span className="text-base font-bold font-mono tracking-tight text-white block leading-none">
                VELORA
              </span>
              <span className="text-[10px] font-mono text-rose-500 uppercase tracking-widest">
                Manager Console
              </span>
            </div>
          </div>

          {/* Breadcrumb divider */}
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 ml-4 pl-4 border-l border-[#1f293b]">
            <span className="text-slate-400">Admin</span>
            <ChevronRight className="w-3 h-3 text-slate-600" />
            <span className="text-white font-medium">{getSectionTitle()}</span>
          </div>
        </div>

        {/* Right: Quick actions, Status, User profile */}
        <div className="flex items-center gap-3">
          
          {/* Return to Customer Platform button */}
          <button
            onClick={onExitToCustomerSite}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-white bg-[#121620] hover:bg-[#1a202c] border border-[#212b3c] rounded-lg transition-colors"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
          </button>

          {/* Role Pill */}
          <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Authorized Session</span>
          </div>

          {/* Admin Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2 py-1.5 px-2.5 bg-[#121620] hover:bg-[#19202c] border border-[#212b3c] rounded-xl text-xs font-medium transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                {admin?.name?.charAt(0) || 'A'}
              </div>
              <span className="hidden sm:inline text-slate-200 max-w-[120px] truncate">{admin?.name || 'Admin'}</span>
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-[#0e121a] border border-[#232d3f] rounded-xl shadow-2xl py-2 z-50 text-xs">
                <div className="px-3.5 py-2 border-b border-[#1c2433]">
                  <p className="font-semibold text-white truncate">{admin?.name}</p>
                  <p className="text-[11px] font-mono text-slate-400 truncate">{admin?.email}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.2 rounded text-[10px] font-mono uppercase bg-rose-500/10 text-rose-400 border border-rose-500/20">
                    {admin?.role || 'Administrator'}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      handleSelect('settings');
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#171e2c] text-slate-300 hover:text-white flex items-center gap-2"
                  >
                    <Settings className="w-3.5 h-3.5 text-slate-500" />
                    <span>System Settings</span>
                  </button>
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      onExitToCustomerSite();
                    }}
                    className="w-full text-left px-3.5 py-2 hover:bg-[#171e2c] text-slate-300 hover:text-white flex items-center gap-2 sm:hidden"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Customer Site</span>
                  </button>
                </div>

                <div className="border-t border-[#1c2433] pt-1 mt-1">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(false);
                      logout();
                    }}
                    className="w-full text-left px-3.5 py-2 text-rose-400 hover:bg-rose-950/20 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>End Admin Session</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>

      </header>

      {/* BODY WITH PERSISTENT SIDEBAR + CONTENT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#0a0d14] border-r border-[#1b2332] p-4 space-y-6 shrink-0">
          
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 px-3 block mb-2">
              Operations Navigation
            </span>

            {navigationItems.map(item => {
              const Icon = item.icon;
              const isActive = currentSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleSelect(item.id as AdminSection)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white font-semibold shadow-md shadow-rose-950/50'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#121620]'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Staff Info Footer Box */}
          <div className="mt-auto pt-4 border-t border-[#1b2332] p-3 bg-[#0d1017] rounded-xl border border-[#161d2a] text-xs">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-semibold text-white">Security Shield</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              RBAC Firestore security rules enforced. Unauthorized reads and writes blocked.
            </p>
          </div>

        </aside>

        {/* MOBILE DRAWER */}
        {mobileSidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div 
              onClick={() => setMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm" 
            />

            {/* Drawer */}
            <div className="relative w-72 max-w-[85vw] bg-[#0a0d14] border-r border-[#1b2332] p-5 flex flex-col h-full z-10 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#1b2332]">
                <div className="flex items-center gap-2">
                  <img src={brandLogo} alt="Logo" className="w-7 h-7 rounded-md object-cover border border-rose-500/40" />
                  <span className="font-bold font-mono text-white text-sm">VELORA Admin</span>
                </div>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1 overflow-y-auto flex-1">
                {navigationItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item.id as AdminSection)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-colors ${
                        isActive
                          ? 'bg-rose-600 text-white font-semibold'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-[#121620]'
                      }`}
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-[#1b2332] space-y-2">
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    onExitToCustomerSite();
                  }}
                  className="w-full py-2 px-3 text-xs text-slate-300 hover:text-white bg-[#121620] border border-[#212b3c] rounded-xl flex items-center justify-between"
                >
                  <span>Return to Customer Site</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => {
                    setMobileSidebarOpen(false);
                    logout();
                  }}
                  className="w-full py-2 px-3 text-xs text-rose-400 hover:bg-rose-950/20 rounded-xl flex items-center gap-2 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out of Console</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-[#07090d]">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
};
