import React, { useEffect, useState } from 'react';
import { 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  Clock, 
  Send, 
  RefreshCw, 
  X, 
  Check, 
  CornerDownRight, 
  User, 
  Mail,
  Tag
} from 'lucide-react';
import { AdminSupportRecord } from '../../types/admin';
import { getAdminSupportTickets, replyAdminTicket } from '../../lib/adminService';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminSupport: React.FC = () => {
  const { admin } = useAdminAuth();
  const [tickets, setTickets] = useState<AdminSupportRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');

  // Reply modal
  const [replyTicket, setReplyTicket] = useState<AdminSupportRecord | null>(null);
  const [replyText, setReplyText] = useState<string>('');
  const [ticketStatus, setTicketStatus] = useState<AdminSupportRecord['status']>('Resolved');

  const [submitting, setSubmitting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await getAdminSupportTickets();
      setTickets(data);
    } catch (err) {
      console.error('Failed to load support tickets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const openReplyModal = (t: AdminSupportRecord) => {
    setReplyTicket(t);
    setReplyText(t.adminReply || '');
    setTicketStatus(t.status === 'Open' ? 'Resolved' : t.status);
  };

  const handlePostReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyTicket || !replyText.trim()) return;

    setSubmitting(true);
    const success = await replyAdminTicket(
      replyTicket.id, 
      replyText.trim(), 
      ticketStatus, 
      admin?.email || 'admin@velora.io'
    );
    setSubmitting(false);

    if (success) {
      setTickets(prev => prev.map(t => t.id === replyTicket.id ? {
        ...t,
        adminReply: replyText.trim(),
        status: ticketStatus,
        adminRespondedBy: admin?.email,
        adminRespondedAt: new Date().toISOString()
      } : t));
      setToastMessage(`Response posted to ticket #${replyTicket.id}.`);
      setTimeout(() => setToastMessage(null), 3500);
    }

    setReplyTicket(null);
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = 
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.userName && t.userName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'All' || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-cyan-400" />
            <span>Support Desk & Customer Queries</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Resolve member inquiries, answer withdrawal/deposit queries, and publish official responses.
          </p>
        </div>

        <button
          onClick={loadTickets}
          disabled={loading}
          className="px-3 py-1.5 bg-[#121620] hover:bg-[#181e2b] border border-[#232c3c] text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin text-rose-500' : ''}`} />
          <span>Refresh Tickets</span>
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
            placeholder="Search tickets by subject, message, email..."
            className="w-full bg-[#121620] border border-[#212b3c] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto text-xs pb-1 md:pb-0">
          {(['All', 'Open', 'In Progress', 'Resolved'] as const).map(tab => (
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

      {/* Tickets List */}
      <div className="space-y-4">
        {filteredTickets.length === 0 ? (
          <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl p-12 text-center text-slate-500 text-xs">
            No support inquiries found matching criteria.
          </div>
        ) : (
          filteredTickets.map(t => (
            <div 
              key={t.id} 
              className="bg-[#0b0e14] border border-[#1b2332] hover:border-[#28354c] rounded-2xl p-5 space-y-3.5 transition-all text-xs"
            >
              
              {/* Ticket Top bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#161c28] pb-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-rose-400 font-bold">{t.id}</span>
                  <span className="text-slate-500">·</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#161c28] text-slate-300 border border-[#212b3c]">
                    {t.category}
                  </span>
                  <span className="text-slate-500">·</span>
                  <span className="text-slate-400 text-[11px]">{new Date(t.createdAt).toLocaleString()}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-semibold ${
                    t.status === 'Resolved'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : t.status === 'In Progress'
                      ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-pulse'
                  }`}>
                    {t.status}
                  </span>
                </div>
              </div>

              {/* User and Subject */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <h3 className="text-sm font-bold text-white">
                  {t.subject}
                </h3>
                <div className="flex items-center gap-2 text-slate-400 text-[11px]">
                  <span>From: <strong className="text-slate-200">{t.userName || t.userEmail}</strong></span>
                  <span className="text-slate-600">({t.userEmail})</span>
                </div>
              </div>

              {/* Customer Message */}
              <div className="p-3.5 bg-[#10141d] rounded-xl border border-[#1b2230] text-slate-300 text-[11px] leading-relaxed">
                {t.message}
              </div>

              {/* Admin Reply Box if present */}
              {t.adminReply && (
                <div className="p-3.5 bg-[#151c27] rounded-xl border border-[#232f42] text-[11px] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-rose-400 font-semibold flex items-center gap-1.5">
                      <CornerDownRight className="w-3.5 h-3.5" />
                      <span>Staff Response:</span>
                    </span>
                    {t.adminRespondedBy && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        By {t.adminRespondedBy}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-200 pl-5">{t.adminReply}</p>
                </div>
              )}

              {/* Actions */}
              <div className="pt-1 flex items-center justify-end gap-2">
                <button
                  onClick={() => openReplyModal(t)}
                  className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t.adminReply ? 'Edit Response' : 'Reply & Update'}</span>
                </button>
              </div>

            </div>
          ))
        )}
      </div>

      {/* REPLY MODAL */}
      {replyTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-[#0e121a] border border-[#232d3f] rounded-2xl p-6 text-slate-100 space-y-4 shadow-2xl relative">
            
            <button
              onClick={() => setReplyTicket(null)}
              className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              <span>Respond to Support Ticket #{replyTicket.id}</span>
            </h3>

            <div className="p-3 bg-[#121620] rounded-xl border border-[#20293b] text-xs space-y-1">
              <span className="text-slate-400 block font-medium">Customer Question:</span>
              <p className="text-white">{replyTicket.subject}</p>
              <p className="text-slate-300 text-[11px] pt-1">{replyTicket.message}</p>
            </div>

            <form onSubmit={handlePostReply} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Official Response *</label>
                <textarea
                  rows={4}
                  required
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder="Type clear resolution or guidance for the member..."
                  className="w-full bg-[#121620] border border-[#212b3c] rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1.5">Update Ticket Status</label>
                <div className="flex items-center gap-2">
                  {(['In Progress', 'Resolved', 'Open'] as const).map(st => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setTicketStatus(st)}
                      className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                        ticketStatus === st
                          ? 'bg-rose-600 text-white font-semibold'
                          : 'bg-[#121620] text-slate-400 hover:text-white border border-[#212b3c]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#1b2332]">
                <button
                  type="button"
                  onClick={() => setReplyTicket(null)}
                  className="px-3.5 py-1.5 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  {submitting ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Send className="w-3.5 h-3.5" />
                  )}
                  <span>Publish Response</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
