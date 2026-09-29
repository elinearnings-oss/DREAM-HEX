import React from 'react';
import { useApp } from '../context/AppContext';
import { BRAND_INFO } from '../data/mockData';
import { 
  ArrowRight, 
  Layers, 
  RefreshCw, 
  ShieldCheck, 
  Clock, 
  ArrowDownToLine, 
  ArrowUpFromLine, 
  Users, 
  ChevronRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { setActiveView, openAuthModal, openProductDetails, products, user } = useApp();

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-16 md:pb-20 border-b border-[#18202d]">
        {/* Subtle background ambient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            
            {/* Left Column: Proposition & CTA */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Unboxed Metadata / Kicker */}
              <div className="flex items-center gap-2 text-xs font-mono text-rose-400 tracking-wider uppercase">
                <span>Crypto Rewards Platform</span>
                <span aria-hidden="true">·</span>
                <span>USDT BEP20 & TRC20</span>
                <span aria-hidden="true">·</span>
                <span>Indonesia</span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                VELORA
                <span className="block text-2xl sm:text-3xl lg:text-4xl font-semibold text-rose-500 mt-2">
                  {BRAND_INFO.tagline}
                </span>
              </h1>

              {/* Clear description (Anti-slop, factual, no fake guarantees) */}
              <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                VELORA delivers modular digital computing products backed by an automated rewards distribution mechanism. 
                Activate verified computing node products to participate in 24-hour cycles crediting a 5% product reward directly into your wallet.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveView('products')}
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold rounded-lg shadow-lg shadow-rose-950/50 transition-colors flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {!user ? (
                  <>
                    <button
                      onClick={() => openAuthModal('register')}
                      className="px-5 py-2.5 bg-[#141a24] hover:bg-[#1a2332] border border-[#273347] text-slate-200 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                    >
                      Get Started (18+)
                    </button>
                    <button
                      onClick={() => openAuthModal('login')}
                      className="px-4 py-2.5 text-slate-400 hover:text-white text-sm font-medium transition-colors whitespace-nowrap"
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setActiveView('dashboard')}
                    className="px-5 py-2.5 bg-[#141a24] hover:bg-[#1a2332] border border-[#273347] text-slate-200 text-sm font-medium rounded-lg transition-colors whitespace-nowrap"
                  >
                    Go to Dashboard
                  </button>
                )}
              </div>

              {/* Key Platform Specifications (Factual unboxed specifications) */}
              <div className="pt-6 border-t border-[#1b2332] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Product Reward</span>
                  <span className="text-sm font-semibold text-white font-mono tabular-nums">5% per 24h</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Referral Reward</span>
                  <span className="text-sm font-semibold text-white font-mono tabular-nums">10% direct</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Minimum Deposit</span>
                  <span className="text-sm font-semibold text-white font-mono tabular-nums">3 USDT (HELEKET)</span>
                </div>
              </div>

            </div>

            {/* Right Column: Visual Anchor */}
            <div className="lg:col-span-5">
              <div className="relative rounded-xl border border-[#222d3f] bg-[#0c1017] p-2 shadow-2xl overflow-hidden group">
                <img 
                  src="/src/assets/images/velora_hero_fintech_1790680402245.jpg" 
                  alt="VELORA Digital Products & Rewards" 
                  className="w-full h-auto rounded-lg object-cover brightness-95 group-hover:scale-[1.01] transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay Card: Live Cycle Mechanics */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-[#0d121af0]/95 backdrop-blur-md border border-[#242f42] rounded-lg">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-300 font-medium flex items-center gap-1.5">
                      <RefreshCw className="w-3.5 h-3.5 text-rose-500 animate-spin" style={{ animationDuration: '8s' }} />
                      Automated 24h Cycle
                    </span>
                    <span className="font-mono text-emerald-400 font-medium">5.0% Reward</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Product values calculate rewards daily with automated wallet crediting upon cycle execution.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. HOW VELORA WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono text-rose-500 uppercase tracking-widest block mb-2">Process Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">How VELORA Operates</h2>
          <p className="text-sm text-slate-400 mt-2">
            A clear, predictable progression from product activation through automated 24-hour reward cycles.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          
          <div className="p-5 bg-[#0e1219] border border-[#1d2534] rounded-xl relative">
            <span className="text-xs font-mono text-rose-500 font-semibold mb-2 block">01</span>
            <h3 className="text-base font-semibold text-slate-100 mb-2">Add USDT Funds</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deposit starting from 3 USDT using BEP20 or TRC20 networks facilitated by the HELEKET payment gateway.
            </p>
          </div>

          <div className="p-5 bg-[#0e1219] border border-[#1d2534] rounded-xl relative">
            <span className="text-xs font-mono text-rose-500 font-semibold mb-2 block">02</span>
            <h3 className="text-base font-semibold text-slate-100 mb-2">Select Digital Product</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Choose from tiered computing product slots ranging from 10 USDT to 100 USDT to allocate your resources.
            </p>
          </div>

          <div className="p-5 bg-[#0e1219] border border-[#1d2534] rounded-xl relative">
            <span className="text-xs font-mono text-rose-500 font-semibold mb-2 block">03</span>
            <h3 className="text-base font-semibold text-slate-100 mb-2">24h Reward Cycle</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Once active, each product calculates a 5% reward per 24-hour cycle based strictly on the product value.
            </p>
          </div>

          <div className="p-5 bg-[#0e1219] border border-[#1d2534] rounded-xl relative">
            <span className="text-xs font-mono text-rose-500 font-semibold mb-2 block">04</span>
            <h3 className="text-base font-semibold text-slate-100 mb-2">Settle or Withdraw</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Rewards are credited to your available balance. Withdraw anytime to your personal wallet from 0.5 USDT (0% fee).
            </p>
          </div>

        </div>
      </section>

      {/* 3. FEATURED PRODUCTS & REWARDS CATALOG PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-mono text-rose-500 uppercase tracking-widest block mb-1">Catalog</span>
            <h2 className="text-2xl font-bold text-white tracking-tight">Active Product Allocations</h2>
            <p className="text-xs text-slate-400 mt-1">Each product operates on an independent 24-hour cycle yielding a 5% product reward.</p>
          </div>
          <button
            onClick={() => setActiveView('products')}
            className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>View All Products</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {products.map(product => {
            const dailyReward = (product.priceUSDT * BRAND_INFO.productRewardRate).toFixed(2);
            return (
              <div 
                key={product.id}
                className="bg-[#0e1219] border border-[#1e2637] hover:border-rose-500/50 rounded-xl p-5 flex flex-col justify-between transition-all duration-200 group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                    <span>{product.tier}</span>
                    {product.badge && (
                      <span className="text-rose-400 font-mono text-[11px]">{product.badge}</span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors">
                    {product.name}
                  </h3>

                  <div className="mt-4 mb-4 pb-4 border-b border-[#1b2332]">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold font-mono tabular-nums text-white">
                        {product.priceUSDT}
                      </span>
                      <span className="text-xs font-mono text-slate-400">USDT</span>
                    </div>
                    <div className="text-xs text-emerald-400 font-mono tabular-nums mt-1 flex items-center gap-1">
                      <span>Reward: +{dailyReward} USDT</span>
                      <span className="text-slate-400 font-normal">/ 24h (5%)</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 leading-relaxed line-clamp-2">
                    {product.description}
                  </p>

                  <ul className="space-y-1.5 mb-5 text-[11px] text-slate-300">
                    <li className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                      <span>24-hour automated cycle</span>
                    </li>
                    <li className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                      <span>Available slots: {product.availableSlots} remaining</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    onClick={() => openProductDetails(product.id)}
                    className="w-full py-2 px-3 bg-[#151b26] hover:bg-rose-600 hover:text-white border border-[#263143] text-xs font-semibold text-slate-200 rounded-lg transition-colors text-center"
                  >
                    View Details & Cycle
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. DEPOSIT & WITHDRAWAL GATEWAY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-mono text-rose-500 uppercase tracking-widest block">Payment Architecture</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Secure USDT Gateway Powered by HELEKET
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Fund your account and withdraw your earnings seamlessly using Binance Smart Chain (BEP20) or Tron (TRC20). 
                The platform features transparent, zero-fee withdrawals and immediate ledger settlements.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3.5 bg-[#12161f] border border-[#1f2736] rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-semibold text-slate-200">Deposits</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Min 3 USDT · BEP20 & TRC20</p>
                  <p className="text-[11px] text-slate-400 mt-1">Processed via HELEKET API</p>
                </div>

                <div className="p-3.5 bg-[#12161f] border border-[#1f2736] rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <ArrowUpFromLine className="w-4 h-4 text-rose-400" />
                    <span className="text-xs font-semibold text-slate-200">Withdrawals</span>
                  </div>
                  <p className="text-[11px] text-slate-400">Min 0.5 USDT · 0% Fee</p>
                  <p className="text-[11px] text-slate-400 mt-1">Instant network dispatch</p>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setActiveView('deposit')}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Deposit Funds
                </button>
                <button
                  onClick={() => setActiveView('withdraw')}
                  className="px-4 py-2 bg-[#161c28] hover:bg-[#1d2536] border border-[#283348] text-slate-300 text-xs font-medium rounded-lg transition-colors"
                >
                  Withdraw USDT
                </button>
              </div>
            </div>

            {/* Right: Technical specifications list */}
            <div className="lg:col-span-6 bg-[#0f141c] border border-[#20293a] rounded-xl p-5 sm:p-6 space-y-4">
              <h3 className="text-sm font-semibold text-slate-200">Gateway Specifications & Invariants</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-start justify-between pb-2.5 border-b border-[#1c2433]">
                  <span className="text-slate-400">Supported Asset</span>
                  <span className="text-slate-200 font-mono font-medium">USDT (Tether USD)</span>
                </div>
                <div className="flex items-start justify-between pb-2.5 border-b border-[#1c2433]">
                  <span className="text-slate-400">Network Protocols</span>
                  <span className="text-slate-200 font-mono font-medium">BEP20 (BSC) & TRC20 (Tron)</span>
                </div>
                <div className="flex items-start justify-between pb-2.5 border-b border-[#1c2433]">
                  <span className="text-slate-400">Payment Processor</span>
                  <span className="text-slate-200 font-medium">HELEKET Payment Gateway</span>
                </div>
                <div className="flex items-start justify-between pb-2.5 border-b border-[#1c2433]">
                  <span className="text-slate-400">Withdrawal Service Charge</span>
                  <span className="text-emerald-400 font-mono font-semibold">0% (Zero Fee)</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">Thresholds</span>
                  <span className="text-slate-300 font-mono">Deposit ≥ 3 USDT / Withdraw ≥ 0.5 USDT</span>
                </div>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-md text-[11px] text-amber-300 leading-relaxed">
                Deposit transactions require standard on-chain block confirmations through the HELEKET gateway before balance availability.
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. REFERRAL REWARDS SECTION (10%) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#0d1118] border border-[#1b2332] rounded-2xl p-6 sm:p-10">
          <div className="lg:col-span-7 space-y-4">
            <span className="text-xs font-mono text-rose-500 uppercase tracking-widest block">Community Growth</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              10% Direct Referral Commission
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Introduce new users to the VELORA platform using your unique referral code. Whenever a direct referral completes a product purchase, 
              a 10% commission is credited immediately to your available USDT wallet balance.
            </p>

            <div className="flex items-center gap-6 pt-2 text-xs">
              <div>
                <span className="text-slate-400 block">Commission Rate</span>
                <span className="text-base font-bold font-mono tabular-nums text-rose-400">10%</span>
              </div>
              <div className="h-8 w-px bg-[#20293b]" />
              <div>
                <span className="text-slate-400 block">Payout Frequency</span>
                <span className="text-base font-bold text-slate-200">Instant on Purchase</span>
              </div>
              <div className="h-8 w-px bg-[#20293b]" />
              <div>
                <span className="text-slate-400 block">Lockup Period</span>
                <span className="text-base font-bold text-emerald-400 font-mono">0 Days</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setActiveView('referral')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
              >
                <span>Access Referral Hub</span>
                <Users className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 bg-[#121620] border border-[#212b3c] rounded-xl p-5 space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider">Example Commission Model</h4>
            <div className="space-y-2 text-xs">
              <div className="p-2.5 bg-[#171e2c] rounded border border-[#253247] flex justify-between items-center">
                <span className="text-slate-300">Starter Node (10 USDT)</span>
                <span className="font-mono font-bold text-rose-400">+1.00 USDT</span>
              </div>
              <div className="p-2.5 bg-[#171e2c] rounded border border-[#253247] flex justify-between items-center">
                <span className="text-slate-300">Prime Node (50 USDT)</span>
                <span className="font-mono font-bold text-rose-400">+5.00 USDT</span>
              </div>
              <div className="p-2.5 bg-[#171e2c] rounded border border-[#253247] flex justify-between items-center">
                <span className="text-slate-300">Enterprise Node (100 USDT)</span>
                <span className="font-mono font-bold text-rose-400">+10.00 USDT</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              *Referral rewards are funded from product operational allocations and immediately available for withdrawal.
            </p>
          </div>
        </div>
      </section>

      {/* 6. SECURITY & ACCOUNT INFORMATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-mono text-rose-500 uppercase tracking-widest block mb-1">Architecture</span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Security & Operational Standards</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-5 bg-[#0e1219] border border-[#1c2433] rounded-xl space-y-2.5">
            <ShieldCheck className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-semibold text-white">Payment Key Isolation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              HELEKET API private keys are safeguarded in isolated backend environment configurations. No private secret credentials are ever exposed in client-side bundles.
            </p>
          </div>

          <div className="p-5 bg-[#0e1219] border border-[#1c2433] rounded-xl space-y-2.5">
            <RefreshCw className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-semibold text-white">Automated Cycle Integrity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reward settlements are calculated at strict 24-hour timestamps to prevent duplicate reward distribution and ensure consistent account ledger reconciliation.
            </p>
          </div>

          <div className="p-5 bg-[#0e1219] border border-[#1c2433] rounded-xl space-y-2.5">
            <Clock className="w-5 h-5 text-rose-500" />
            <h3 className="text-sm font-semibold text-white">Transparent Compliance</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Operated under Indonesian business registration standards. Participation requires age verification (18+) with transparent risk disclosures.
            </p>
          </div>
        </div>
      </section>

      {/* 7. FAQ PREVIEW & SUPPORT CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 bg-[#0b0e14] border border-[#1b2332] rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl font-bold text-white">Have questions about VELORA?</h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Learn more about 24-hour reward cycles, payment protocols, and compliance in our comprehensive FAQ or contact our official Telegram desk.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveView('faq')}
              className="px-4 py-2.5 bg-[#141a24] hover:bg-[#1b2332] border border-[#273245] text-slate-200 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap"
            >
              Browse FAQ
            </button>
            <button
              onClick={() => setActiveView('support')}
              className="px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors whitespace-nowrap"
            >
              Contact Support Desk
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
