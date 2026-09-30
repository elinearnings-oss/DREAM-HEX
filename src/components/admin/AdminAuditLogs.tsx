import React, { useEffect, useState } from 'react';
import { ShieldAlert, RefreshCw, Clock, Search, History } from 'lucide-react';
import { AdminAuditRecord } from '../../types/admin';
import { getAdminAuditLogs } from '../../lib/adminService';

export const AdminAuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AdminAuditRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const data = await getAdminAuditLogs(50);
      setLogs(data);
    } catch (err) {
      console.error('Failed to load audit logs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.adminEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.targetType.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.targetId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-rose-500" />
            <span>Administrative Security & Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable log trail of staff logins, status modifications, deposit approvals, and system changes.
          </p>
        </div>

        <button
          onClick={loadLogs}
          disabled={loading}
          className="px-3 py-1.5 bg-[#121620] hover:bg-[#181e2b] border border-[#232c3c] text-slate-300 text-xs font-medium rounded-lg transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-slate-400 ${loading ? 'animate-spin text-rose-500' : ''}`} />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-xl p-4 flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by admin, action, target..."
            className="w-full bg-[#121620] border border-[#212b3c] rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
          />
        </div>
        <span className="text-xs font-mono text-slate-400">
          Showing last 50 events
        </span>
      </div>

      {/* Logs Table */}
      <div className="bg-[#0b0e14] border border-[#1b2332] rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-[#0e121a] border-b border-[#1b2332] text-slate-400 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Admin Email</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Target Type</th>
                <th className="py-3 px-4">Target Identifier</th>
                <th className="py-3 px-4">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#151c27] text-slate-300">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No audit logs recorded yet.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(l => (
                  <tr key={l.id} className="hover:bg-[#11151f] transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-400 whitespace-nowrap">
                      {new Date(l.timestamp).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 font-mono text-white font-medium">
                      {l.adminEmail}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
                        {l.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400 uppercase text-[10px]">
                      {l.targetType}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {l.targetId}
                    </td>
                    <td className="py-3 px-4 text-slate-400 max-w-[200px] truncate font-mono text-[11px]">
                      {JSON.stringify(l.details || {})}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
