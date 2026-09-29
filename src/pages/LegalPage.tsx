import React, { useState } from 'react';
import { BRAND_INFO } from '../data/mockData';
import { ShieldAlert, FileText, Lock, AlertTriangle } from 'lucide-react';

interface LegalPageProps {
  initialTab?: 'privacy' | 'terms' | 'disclaimer';
}

export const LegalPage: React.FC<LegalPageProps> = ({ initialTab = 'disclaimer' }) => {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'disclaimer'>(initialTab);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-[#1b2332] pb-2 text-xs">
        <button
          onClick={() => setActiveTab('disclaimer')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'disclaimer'
              ? 'bg-rose-600 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Risk Disclosure & Disclaimer
        </button>
        <button
          onClick={() => setActiveTab('terms')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'terms'
              ? 'bg-rose-600 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Terms & Conditions
        </button>
        <button
          onClick={() => setActiveTab('privacy')}
          className={`px-3.5 py-2 rounded-lg font-medium transition-colors ${
            activeTab === 'privacy'
              ? 'bg-rose-600 text-white font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Privacy Policy
        </button>
      </div>

      {/* 1. RISK DISCLOSURE & DISCLAIMER */}
      {activeTab === 'disclaimer' && (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-10 space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-[#18202d]">
            <AlertTriangle className="w-6 h-6 text-rose-500 shrink-0" />
            <div>
              <h1 className="text-xl font-bold text-white">Risk Disclosure & Platform Disclaimer</h1>
              <p className="text-slate-400 text-[11px]">Last Updated: September 2026</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white">1. Nature of Product Rewards</h2>
            <p>
              Rewards offered on VELORA (5% per 24-hour cycle) are performance and computing incentives associated with 
              active digital product nodes. They do NOT represent guaranteed investment returns, fixed yield bonds, bank deposits, 
              or mutual fund returns. VELORA does not promise or guarantee profit of any kind.
            </p>

            <h2 className="text-sm font-bold text-white">2. Digital Asset & Crypto Volatility</h2>
            <p>
              Digital assets, stablecoins (USDT), and blockchain networks (BEP20, TRC20) involve inherent technical and protocol risks. 
              These include network congestion, smart contract vulnerabilities, market fluctuations, and regulatory shifts. 
              Users acknowledge that digital asset values and blockchain network fees may change unpredictably.
            </p>

            <h2 className="text-sm font-bold text-white">3. Regulatory & Licensing Status</h2>
            <p>
              VELORA operates as a digital products and rewards interface in Indonesia. VELORA is NOT a licensed bank, 
              insured depository institution, securities broker, or registered investment advisor. None of the products 
              offered are insured by government deposit insurance or regulatory protection schemes.
            </p>

            <h2 className="text-sm font-bold text-white">4. User Responsibility & Discretion</h2>
            <p>
              You should never allocate funds or purchase products using capital you cannot comfortably afford to lose. 
              All product purchase decisions and withdrawal operations are undertaken entirely at the user's sole risk and discretion.
            </p>

            <h2 className="text-sm font-bold text-white">5. Entity Information</h2>
            <div className="p-3 bg-[#111620] border border-[#1e2738] rounded-xl space-y-1 font-mono text-[11px] text-slate-400">
              <p>Legal Business Name: <span className="text-slate-200">{BRAND_INFO.legalName}</span></p>
              <p>Country of Business: <span className="text-slate-200">{BRAND_INFO.country}</span></p>
              <p>Business Address: <span className="text-slate-400">{BRAND_INFO.businessAddress}</span></p>
              <p>Official Support Email: <span className="text-slate-200">{BRAND_INFO.supportEmail}</span></p>
            </div>
          </div>
        </div>
      )}

      {/* 2. TERMS & CONDITIONS */}
      {activeTab === 'terms' && (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-10 space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-[#18202d]">
            <FileText className="w-6 h-6 text-rose-500 shrink-0" />
            <div>
              <h1 className="text-xl font-bold text-white">Terms & Conditions of Service</h1>
              <p className="text-slate-400 text-[11px]">Last Updated: September 2026</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white">1. Eligibility (Age 18+)</h2>
            <p>
              By accessing or registering on VELORA, you represent and warrant that you are at least eighteen (18) years of age 
              and have the legal capacity to enter into binding agreements under applicable laws in your jurisdiction.
            </p>

            <h2 className="text-sm font-bold text-white">2. Account Usage & Security</h2>
            <p>
              Users are solely responsible for maintaining the confidentiality of their credentials. Any activity occurring 
              under your account is your responsibility. You agree to notify VELORA immediately of any unauthorized access.
            </p>

            <h2 className="text-sm font-bold text-white">3. Product Purchases & Activation</h2>
            <p>
              Product slots are acquired using USDT available balance. Once purchased, products transition to active status 
              following internal node provisioning (typically within 5 to 10 minutes). Once active, each product adheres 
              to a 24-hour cycle duration.
            </p>

            <h2 className="text-sm font-bold text-white">4. Rewards & Calculation Protocol</h2>
            <p>
              Product rewards are calculated strictly at 5% of product value per completed 24-hour cycle. 
              Referral commissions are calculated at 10% on direct invited product purchases. Rewards are credited to the 
              user's available wallet balance. Rewards do not constitute guaranteed returns.
            </p>

            <h2 className="text-sm font-bold text-white">5. Deposits & Withdrawals</h2>
            <p>
              Deposits are facilitated through the HELEKET payment gateway on supported networks (BEP20 and TRC20). 
              The minimum deposit is 3 USDT. The minimum withdrawal is 0.5 USDT with a 0% withdrawal fee. Users must verify 
              their destination wallet address; blockchain transactions cannot be reversed once broadcast.
            </p>

            <h2 className="text-sm font-bold text-white">6. Prohibited Activities & Account Suspension</h2>
            <p>
              Users may not engage in wash trading, automated abuse, multiple fraudulent referral rings, balance manipulation, 
              or unlawful activities. VELORA reserves the right to suspend or terminate accounts in violation of these terms.
            </p>

            <h2 className="text-sm font-bold text-white">7. Limitation of Liability</h2>
            <p>
              To the fullest extent permitted by law, VELORA and its operators shall not be liable for indirect, incidental, 
              or consequential damages, including loss of profits or blockchain network delays.
            </p>
          </div>
        </div>
      )}

      {/* 3. PRIVACY POLICY */}
      {activeTab === 'privacy' && (
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-10 space-y-6 text-xs text-slate-300 leading-relaxed">
          <div className="flex items-center gap-3 pb-4 border-b border-[#18202d]">
            <Lock className="w-6 h-6 text-rose-500 shrink-0" />
            <div>
              <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
              <p className="text-slate-400 text-[11px]">Last Updated: September 2026</p>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-bold text-white">1. Information We Collect</h2>
            <p>
              We collect minimal information necessary to deliver platform services:
              account credentials (name, email address), transaction telemetry (cryptocurrency transfer amounts, public wallet addresses, 
              blockchain transaction hashes), and technical session logs.
            </p>

            <h2 className="text-sm font-bold text-white">2. Use of Information</h2>
            <p>
              Collected data is used strictly to process product purchases, calculate and credit 5% cycle rewards, attribute 10% 
              referral commissions, execute withdrawals, and maintain platform security. We never sell your personal data.
            </p>

            <h2 className="text-sm font-bold text-white">3. Third-Party Payment Integrations</h2>
            <p>
              Deposit and blockchain processing is supported by payment gateway providers including HELEKET. 
              Private merchant keys and sensitive backend communications are isolated server-side.
            </p>

            <h2 className="text-sm font-bold text-white">4. Cookies & Session Storage</h2>
            <p>
              We utilize essential browser storage and session cookies to persist authenticated login states, preferences, 
              and active product countdown telemetry.
            </p>

            <h2 className="text-sm font-bold text-white">5. Data Retention & User Rights</h2>
            <p>
              Users may request access to their transaction records or request deletion of inactive accounts by contacting our 
              customer support desk at <span className="font-mono text-slate-200">{BRAND_INFO.supportEmail}</span>.
            </p>
          </div>
        </div>
      )}

    </div>
  );
};
