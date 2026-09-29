import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { BRAND_INFO } from '../data/mockData';
import { SupportTicket } from '../types';
import { Mail, Send, Clock, MessageSquare, AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react';

export const SupportPage: React.FC = () => {
  const { submitSupportTicket, supportTickets, user, setActiveView, showToast } = useApp();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('General');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      showToast('error', 'Incomplete Form', 'Please provide a subject and detailed message.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      submitSupportTicket(subject.trim(), category, message.trim());
      setSubject('');
      setMessage('');
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-10">
      
      {/* Title */}
      <div className="pb-6 border-b border-[#1b2332]">
        <div className="flex items-center gap-2 text-xs font-mono text-rose-500 uppercase tracking-widest mb-1">
          <span>Official Help Desk</span>
          <span aria-hidden="true">·</span>
          <span>GMT+7 Support Window</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Customer Support
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
          Get in touch with the VELORA support desk for assistance with deposits, reward settlements, or account inquiries.
        </p>
      </div>

      {/* Contact Channels Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Email Support */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-500 flex items-center justify-center">
            <Mail className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Email Desk</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct your inquiries to our primary customer support inbox:
          </p>
          <a
            href={`mailto:${BRAND_INFO.supportEmail}`}
            className="text-xs font-mono text-rose-400 hover:text-rose-300 break-all block font-semibold transition-colors"
          >
            {BRAND_INFO.supportEmail}
          </a>
        </div>

        {/* Telegram Desk */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-500 flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Official Telegram</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Direct messaging for active operational queries:
          </p>
          <span className="text-xs font-mono text-rose-400 font-semibold block">
            {BRAND_INFO.telegram}
          </span>
          <span className="text-[11px] text-slate-500 block">WhatsApp: {BRAND_INFO.whatsapp}</span>
        </div>

        {/* Working Hours */}
        <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600/10 text-rose-500 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-white">Desk Operating Hours</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our specialized team responds during working hours:
          </p>
          <span className="text-xs font-mono text-white font-semibold block">
            {BRAND_INFO.supportHours}
          </span>
          <span className="text-[11px] text-slate-500 block">Indonesia Timezone (Western Indonesia Time)</span>
        </div>

      </div>

      {/* Main Form & FAQ Link */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Support Ticket Form */}
        <div className="lg:col-span-7 bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-8 space-y-5">
          <div>
            <h3 className="text-base font-bold text-white">Submit a Support Inquiry</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Submit your ticket below and our support team will review within operational hours.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full bg-[#121620] border border-[#212b3c] rounded-xl px-3.5 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-rose-500"
              >
                <option value="Deposit Issue">Deposit Issue (HELEKET Gateway)</option>
                <option value="Withdrawal Query">Withdrawal Query (BEP20 / TRC20)</option>
                <option value="Product Reward">Product Reward / Cycle Calculation (5%)</option>
                <option value="Account Security">Account Security & Credentials</option>
                <option value="General">General Platform Information</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={e => setSubject(e.target.value)}
                placeholder="e.g. Deposit confirmation verification for TRC20"
                className="w-full bg-[#121620] border border-[#212b3c] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1.5">Detailed Message</label>
              <textarea
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe your issue with relevant transaction hash or cycle information..."
                className="w-full bg-[#121620] border border-[#212b3c] rounded-xl px-3.5 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-500"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition-colors whitespace-nowrap"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Support Ticket'}
            </button>
          </form>
        </div>

        {/* Right: FAQ Quick Access & Address notice */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-4">
            <h4 className="text-sm font-bold text-white">Frequently Asked Answers</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find quick, clear answers on 5% cycle mechanics, 10% referral payouts, and deposit verifications.
            </p>
            <button
              onClick={() => setActiveView('faq')}
              className="w-full py-2.5 px-4 bg-[#141a24] hover:bg-[#1c2434] border border-[#273245] text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center justify-between"
            >
              <span>Explore FAQ Knowledge Base</span>
              <ChevronRight className="w-4 h-4 text-rose-500" />
            </button>
          </div>

          <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 space-y-2 text-xs">
            <h4 className="font-semibold text-slate-200">Legal Business Profile</h4>
            <p className="text-slate-400">Legal Business Name: <span className="text-slate-200">{BRAND_INFO.legalName}</span></p>
            <p className="text-slate-400">Country of Business: <span className="text-slate-200">{BRAND_INFO.country}</span></p>
            <p className="text-slate-400">Physical Address: <span className="text-slate-500">{BRAND_INFO.businessAddress}</span></p>
            <p className="text-slate-400 text-[11px] pt-1">
              VELORA operates strictly in accordance with verified electronic platform guidelines in Indonesia.
            </p>
          </div>

        </div>

      </div>

      {/* Your Submitted Tickets */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-6 sm:p-8 space-y-4">
        <h3 className="text-sm font-bold text-white">Your Submitted Support Tickets</h3>
        
        {supportTickets.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-500">
            You have no open support tickets.
          </div>
        ) : (
          <div className="space-y-3">
            {supportTickets.map(tck => (
              <div key={tck.id} className="p-4 bg-[#121620] border border-[#1f2738] rounded-xl space-y-2 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-rose-400 font-semibold">{tck.id}</span>
                    <span aria-hidden="true" className="text-slate-600">·</span>
                    <span className="text-slate-300 font-medium">{tck.subject}</span>
                  </div>
                  <span className={`font-mono text-xs ${tck.status === 'Resolved' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {tck.status}
                  </span>
                </div>

                <p className="text-slate-400 text-[11px] leading-relaxed">{tck.message}</p>

                {tck.adminReply && (
                  <div className="mt-2 p-3 bg-[#0d1017] border border-[#1a212e] rounded-lg">
                    <span className="text-rose-400 font-semibold text-[11px] block mb-0.5">Support Desk Response:</span>
                    <p className="text-slate-300 text-[11px] leading-relaxed">{tck.adminReply}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
