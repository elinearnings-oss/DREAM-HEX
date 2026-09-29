import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { BRAND_INFO } from '../data/mockData';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

export const FAQPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const faqs: FAQItem[] = [
    {
      category: 'General',
      question: 'What is VELORA?',
      answer: 'VELORA is a modern digital products and rewards platform based in Indonesia. It enables verified participants to allocate funds into modular digital computing products and receive 24-hour cycle rewards.'
    },
    {
      category: 'Products & Rewards',
      question: 'How do products work?',
      answer: 'Users acquire digital product tiers (ranging from 10 USDT to 100 USDT). Each product represents an allocated computing slot that participates in continuous operational cycles.'
    },
    {
      category: 'Products & Rewards',
      question: 'How are rewards calculated?',
      answer: 'Rewards are calculated strictly at a 5% rate per 24-hour cycle based on the product’s purchase value. For example, a 50 USDT product calculates a 2.50 USDT reward per completed 24-hour cycle. Rewards are not guaranteed investment returns or bank interest.'
    },
    {
      category: 'Products & Rewards',
      question: 'When does a product become active?',
      answer: 'Upon confirmation of your purchase with available USDT balance, internal slot provisioning and node binding complete within 5 to 10 minutes, after which the 24-hour cycle countdown begins immediately.'
    },
    {
      category: 'Products & Rewards',
      question: 'When are rewards credited?',
      answer: 'Rewards are automatically credited to your available VELORA wallet balance upon the completion of each 24-hour cycle (86,400 seconds). Users can also view real-time countdown telemetry on their dashboard.'
    },
    {
      category: 'Deposits & Withdrawals',
      question: 'How do deposits work?',
      answer: 'Deposits are handled securely via the HELEKET crypto payment gateway. Select your network (BEP20 or TRC20), transfer USDT to the designated deposit address, and once verified by blockchain block confirmations, the funds reflect in your available balance.'
    },
    {
      category: 'Deposits & Withdrawals',
      question: 'Which networks are supported?',
      answer: 'VELORA supports Tether (USDT) transfers on BNB Smart Chain (BEP20) and TRON (TRC20).'
    },
    {
      category: 'Deposits & Withdrawals',
      question: 'What is the minimum deposit?',
      answer: `The minimum deposit threshold is ${BRAND_INFO.minDepositUSDT} USDT. Transfers below this threshold cannot be processed by the payment gateway.`
    },
    {
      category: 'Deposits & Withdrawals',
      question: 'What is the minimum withdrawal?',
      answer: `The minimum withdrawal threshold is ${BRAND_INFO.minWithdrawalUSDT} USDT.`
    },
    {
      category: 'Deposits & Withdrawals',
      question: 'Is there a withdrawal fee?',
      answer: `No. VELORA charges a ${BRAND_INFO.withdrawalFeePercent}% withdrawal fee. You receive 100% of your requested withdrawal amount.`
    },
    {
      category: 'Referral Program',
      question: 'How does the referral system work?',
      answer: `VELORA offers a 10% direct referral commission. When an invited member registers with your unique link or code and purchases a product, 10% of that purchase value is instantly credited to your available wallet balance with no lockup period.`
    },
    {
      category: 'Account & Compliance',
      question: 'Is KYC required?',
      answer: 'KYC identity verification is not required initially for standard product operations and withdrawals. However, all participants must strictly verify that they are at least 18 years of age (18+).'
    },
    {
      category: 'Customer Support',
      question: 'How can I contact support?',
      answer: `You can reach our official customer support desk via email at ${BRAND_INFO.supportEmail} or via Telegram at ${BRAND_INFO.telegram}. Support hours are ${BRAND_INFO.supportHours} (Western Indonesia Time).`
    },
    {
      category: 'Risk Disclosure',
      question: 'What are the platform risks?',
      answer: 'Digital assets and crypto-related systems involve technological, market volatility, and protocol risks. Product rewards must never be regarded as guaranteed profits. VELORA is not an insured depository institution or government-backed entity. Only allocate funds that you can afford to risk.'
    }
  ];

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(search.toLowerCase()) || 
    f.answer.toLowerCase().includes(search.toLowerCase()) ||
    f.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      
      {/* Title */}
      <div className="pb-6 border-b border-[#1b2332]">
        <div className="flex items-center gap-2 text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">
          <span>Knowledge Base</span>
          <span aria-hidden="true">·</span>
          <span>Factual Platform Answers</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          Clear, transparent explanations regarding product cycles, reward distributions, and account security.
        </p>
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search questions (e.g. deposit, 5% reward, referral, withdrawal fee)..."
          className="w-full bg-[#0b0e14] border border-[#1b2332] rounded-xl px-4 py-3 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
        />
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-[#0b0e14] border border-[#1b2332] rounded-xl overflow-hidden transition-colors"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-[#111621] transition-colors"
              >
                <div>
                  <span className="text-[10px] font-mono text-rose-500 uppercase tracking-wider block mb-1">
                    {faq.category}
                  </span>
                  <span className="text-sm font-semibold text-slate-100">
                    {faq.question}
                  </span>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-4 h-4 text-rose-500 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-slate-300 leading-relaxed border-t border-[#18202d] pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
