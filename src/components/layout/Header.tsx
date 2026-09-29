import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Menu, X, Shield, Wallet, ChevronDown, User as UserIcon, LogOut, ArrowUpRight } from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    user, 
    isAdmin, 
    activeView, 
    setActiveView, 
    openAuthModal, 
    logout, 
    wallet,
    toggleAdminRole 
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const handleNav = (view: any) => {
    setActiveView(view);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090b0e]/90 backdrop-blur-md border-b border-[#1b222e]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* ZONE 1: BRAND WORDMARK (Single element with logo) */}
        <button 
          onClick={() => handleNav('home')} 
          className="flex items-center gap-2.5 text-left group focus:outline-none focus-visible:ring-1 focus-visible:ring-rose-500 rounded"
        >
          <img 
            src="/src/assets/images/velora_brand_logo_1790680377503.jpg" 
            alt="VELORA" 
            className="w-8 h-8 rounded-md object-cover border border-rose-500/40 group-hover:border-rose-500 transition-colors"
          />
          <span className="text-xl font-bold tracking-tight text-white font-mono">
            VELORA
          </span>
        </button>

        {/* ZONE 2: 4-6 CLEAN NAV LINKS (Single line, text with subtle hover) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-300">
          <button
            onClick={() => handleNav('home')}
            className={`transition-colors hover:text-white ${activeView === 'home' ? 'text-rose-400 font-semibold' : ''}`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('products')}
            className={`transition-colors hover:text-white ${activeView === 'products' || activeView === 'product-details' ? 'text-rose-400 font-semibold' : ''}`}
          >
            Products
          </button>
          <button
            onClick={() => handleNav('deposit')}
            className={`transition-colors hover:text-white ${activeView === 'deposit' ? 'text-rose-400 font-semibold' : ''}`}
          >
            Deposit
          </button>
          <button
            onClick={() => handleNav('withdraw')}
            className={`transition-colors hover:text-white ${activeView === 'withdraw' ? 'text-rose-400 font-semibold' : ''}`}
          >
            Withdraw
          </button>
          <button
            onClick={() => handleNav('referral')}
            className={`transition-colors hover:text-white ${activeView === 'referral' ? 'text-rose-400 font-semibold' : ''}`}
          >
            Referral
          </button>
          <button
            onClick={() => handleNav('support')}
            className={`transition-colors hover:text-white ${activeView === 'support' ? 'text-rose-400 font-semibold' : ''}`}
          >
            Support
          </button>
        </nav>

        {/* ZONE 3: PRIMARY ACTIONS (Wallet balance, Dashboard/Login, Admin Toggle) */}
        <div className="flex items-center gap-3">
          {/* Quick Admin Simulator Toggle */}
          <button
            onClick={toggleAdminRole}
            title={isAdmin ? "Switch to User View" : "Simulate Admin Console"}
            className={`hidden xl:inline-flex items-center gap-1.5 px-2.5 py-1 text-xs rounded border transition-colors whitespace-nowrap ${
              isAdmin 
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' 
                : 'bg-[#121620] border-[#222b3b] text-slate-400 hover:text-slate-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>{isAdmin ? 'Admin Active' : 'Admin Demo'}</span>
          </button>

          {user ? (
            <div className="relative">
              <div className="flex items-center gap-2">
                {/* Available Balance Pill */}
                <button
                  onClick={() => handleNav('dashboard')}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-[#121620] hover:bg-[#181e2b] border border-[#222b3b] rounded-lg text-xs font-mono tabular-nums text-slate-200 transition-colors"
                >
                  <Wallet className="w-3.5 h-3.5 text-rose-500" />
                  <span>{wallet.availableUSDT.toFixed(2)} USDT</span>
                </button>

                {/* Profile Trigger */}
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 py-1.5 px-2.5 bg-[#161c28] hover:bg-[#1d2535] border border-[#273245] rounded-lg text-xs font-medium text-slate-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-rose-600/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                    {user.name.charAt(0)}
                  </div>
                  <span className="hidden sm:inline max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-[#121620] border border-[#222b3b] rounded-lg shadow-2xl py-2 z-50 text-xs">
                  <div className="px-3.5 py-2 border-b border-[#1f2736]">
                    <p className="font-semibold text-slate-200 truncate">{user.name}</p>
                    <p className="text-slate-400 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => handleNav('dashboard')}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#1a2130] text-slate-300 hover:text-white flex items-center justify-between"
                    >
                      <span>User Dashboard</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                    <button
                      onClick={() => handleNav('my-products')}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#1a2130] text-slate-300 hover:text-white"
                    >
                      My Active Products (5%)
                    </button>
                    <button
                      onClick={() => handleNav('transactions')}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#1a2130] text-slate-300 hover:text-white"
                    >
                      Transaction Ledger
                    </button>
                    <button
                      onClick={() => handleNav('profile')}
                      className="w-full text-left px-3.5 py-2 hover:bg-[#1a2130] text-slate-300 hover:text-white"
                    >
                      Account Profile & Security
                    </button>
                    {isAdmin && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full text-left px-3.5 py-2 hover:bg-rose-950/30 text-rose-400 font-semibold"
                      >
                        Admin Control Center
                      </button>
                    )}
                  </div>

                  <div className="border-t border-[#1f2736] pt-1 mt-1">
                    <button
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-3.5 py-2 text-rose-400 hover:bg-rose-950/20 flex items-center gap-2"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuthModal('login')}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white transition-colors whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => openAuthModal('register')}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg shadow-sm shadow-rose-950/40 transition-colors whitespace-nowrap"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white focus:outline-none"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#1e2635] bg-[#0c0f15] px-4 pt-3 pb-6 space-y-2">
          <button
            onClick={() => handleNav('home')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === 'home' ? 'bg-[#171e2c] text-rose-400' : 'text-slate-300'}`}
          >
            Home
          </button>
          <button
            onClick={() => handleNav('products')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === 'products' ? 'bg-[#171e2c] text-rose-400' : 'text-slate-300'}`}
          >
            Products & Rewards (5%)
          </button>
          <button
            onClick={() => handleNav('deposit')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === 'deposit' ? 'bg-[#171e2c] text-rose-400' : 'text-slate-300'}`}
          >
            Deposit USDT
          </button>
          <button
            onClick={() => handleNav('withdraw')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === 'withdraw' ? 'bg-[#171e2c] text-rose-400' : 'text-slate-300'}`}
          >
            Withdraw USDT
          </button>
          <button
            onClick={() => handleNav('referral')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === 'referral' ? 'bg-[#171e2c] text-rose-400' : 'text-slate-300'}`}
          >
            Referral Program (10%)
          </button>
          <button
            onClick={() => handleNav('dashboard')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === 'dashboard' ? 'bg-[#171e2c] text-rose-400' : 'text-slate-300'}`}
          >
            User Dashboard
          </button>
          <button
            onClick={() => handleNav('my-products')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === 'my-products' ? 'bg-[#171e2c] text-rose-400' : 'text-slate-300'}`}
          >
            My Products & Cycles
          </button>
          <button
            onClick={() => handleNav('transactions')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === 'transactions' ? 'bg-[#171e2c] text-rose-400' : 'text-slate-300'}`}
          >
            Transaction History
          </button>
          <button
            onClick={() => handleNav('support')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === 'support' ? 'bg-[#171e2c] text-rose-400' : 'text-slate-300'}`}
          >
            Customer Support
          </button>
          <button
            onClick={() => handleNav('faq')}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${activeView === 'faq' ? 'bg-[#171e2c] text-rose-400' : 'text-slate-300'}`}
          >
            FAQ
          </button>

          <div className="pt-3 border-t border-[#1e2635] flex items-center justify-between">
            <button
              onClick={toggleAdminRole}
              className="text-xs text-rose-400 font-mono py-1 px-2 rounded bg-rose-950/30 border border-rose-800/30"
            >
              Toggle Admin Demo ({isAdmin ? 'Active' : 'Off'})
            </button>
            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className="text-xs text-rose-400 font-semibold"
              >
                Go to Admin
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
