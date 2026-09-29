import React from 'react';
import { useApp } from '../../context/AppContext';
import { BRAND_INFO } from '../../data/mockData';
import { Mail, Send, AlertTriangle } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActiveView } = useApp();

  return (
    <footer className="bg-[#06080b] border-t border-[#161d28] text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12 mb-10">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <img 
                src="/src/assets/images/velora_brand_logo_1790680377503.jpg" 
                alt="VELORA" 
                className="w-7 h-7 rounded object-cover border border-rose-500/30"
              />
              <span className="text-base font-bold tracking-tight text-white font-mono">
                VELORA
              </span>
            </div>
            <p className="text-xs text-slate-300 font-medium">{BRAND_INFO.tagline}</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modern digital computing and reward platform providing automated 24-hour cycle distributions on verified product allocations.
            </p>
            <div className="pt-1 text-[11px] text-slate-400 space-y-1">
              <p>Legal Entity: <span className="text-slate-300">{BRAND_INFO.legalName}</span></p>
              <p>Country of Business: <span className="text-slate-300">{BRAND_INFO.country}</span></p>
              <p>Business Address: <span className="text-slate-400">{BRAND_INFO.businessAddress}</span></p>
            </div>
          </div>

          {/* Col 2: Navigation & Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase">Platform</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveView('products')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Products & Rewards (5%)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView('deposit')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Deposit (HELEKET USDT)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView('withdraw')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Withdrawal (0% Fee)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView('referral')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Referral System (10%)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView('dashboard')} 
                  className="hover:text-white transition-colors text-left"
                >
                  User Dashboard
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView('transactions')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Transaction History
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Customer Support & Hours */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase">Customer Support</h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Email Address</span>
                  <a 
                    href={`mailto:${BRAND_INFO.supportEmail}`} 
                    className="text-slate-200 hover:text-white break-all"
                  >
                    {BRAND_INFO.supportEmail}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Send className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 block text-[11px]">Official Telegram</span>
                  <span className="text-slate-200">{BRAND_INFO.telegram}</span>
                </div>
              </div>

              <div className="pt-1 text-[11px] text-slate-400">
                <span className="text-slate-300 font-medium block">Support Hours:</span>
                <span>{BRAND_INFO.supportHours}</span>
              </div>

              <div className="text-[11px] text-slate-400">
                <span>WhatsApp: {BRAND_INFO.whatsapp} · Twitter/X: {BRAND_INFO.twitter}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Legal & Compliance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase">Legal & Compliance</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveView('disclaimer')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Risk Disclosure & Disclaimer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView('terms')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView('privacy')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveView('faq')} 
                  className="hover:text-white transition-colors text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
              <li className="pt-2 text-[11px] text-slate-400 leading-relaxed">
                Eligible participants must be 18 years of age or older.
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory & Risk Transparency Banner */}
        <div className="p-4 bg-[#0e1219] border border-[#1b2332] rounded-lg mb-8 text-xs text-slate-400 leading-relaxed">
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-200">Risk Disclosure & Important Notice: </strong>
              Digital assets and cryptocurrency-related reward activities carry market, technical, and operational risk. 
              Product rewards (5% per 24-hour cycle) are calculated based on product allocation parameters and must NOT be interpreted 
              as guaranteed investment returns, fixed annuities, or guaranteed profits. VELORA is not a licensed bank or insured financial institution. 
              Never commit funds you cannot afford to risk.
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Unboxed text metadata */}
        <div className="pt-6 border-t border-[#161d28] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-400">
          <div>
            © {new Date().getFullYear()} VELORA. All rights reserved. Registered jurisdiction: Indonesia.
          </div>
          <div className="flex items-center gap-3">
            <span>Minimum age 18+</span>
            <span aria-hidden="true">·</span>
            <span>USDT BEP20 & TRC20</span>
            <span aria-hidden="true">·</span>
            <span>Payment Provider: HELEKET</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
