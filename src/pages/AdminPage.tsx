import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useApp } from '../context/AppContext';
import { AdminLayout, AdminSection } from '../components/admin/AdminLayout';
import { AdminLogin } from '../components/admin/AdminLogin';
import { AdminDashboard } from '../components/admin/AdminDashboard';
import { AdminUsers } from '../components/admin/AdminUsers';
import { AdminProducts } from '../components/admin/AdminProducts';
import { AdminOrders } from '../components/admin/AdminOrders';
import { AdminPayments } from '../components/admin/AdminPayments';
import { AdminWithdrawals } from '../components/admin/AdminWithdrawals';
import { AdminSupport } from '../components/admin/AdminSupport';
import { AdminSettings } from '../components/admin/AdminSettings';
import { AdminAuditLogs } from '../components/admin/AdminAuditLogs';
import { Shield, AlertCircle, RefreshCw, RotateCcw } from 'lucide-react';

interface AdminErrorBoundaryProps {
  children: React.ReactNode;
  onReset: () => void;
}

interface AdminErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class AdminErrorBoundary extends React.Component<AdminErrorBoundaryProps, AdminErrorBoundaryState> {
  constructor(props: AdminErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Admin component error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07090d] flex items-center justify-center p-6 text-slate-100">
          <div className="max-w-md w-full bg-[#0e121a] border border-[#232d3f] rounded-2xl p-8 space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-600/20 text-rose-500 mx-auto flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-base font-bold text-white">Admin Console Render Notice</h2>
              <p className="text-xs text-slate-400">
                An unexpected exception was caught while displaying this console component.
              </p>
            </div>
            {this.state.error?.message && (
              <div className="p-3 bg-[#131722] rounded-xl border border-[#1f283a] text-[11px] font-mono text-rose-300 text-left overflow-x-auto">
                {this.state.error.message}
              </div>
            )}
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: undefined });
                  this.props.onReset();
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Console</span>
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export const AdminPage: React.FC = () => {
  const { admin, isInitializing } = useAdminAuth();
  const { setActiveView } = useApp();

  const [currentSection, setCurrentSection] = useState<AdminSection>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const match = window.location.hash.match(/#admin\/(dashboard|users|products|orders|payments|withdrawals|support|settings|audit-logs)/);
      if (match && match[1]) {
        return match[1] as AdminSection;
      }
    }
    return 'dashboard';
  });

  // Listen to hash changes in case of browser back/forward navigation
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash) {
        const match = window.location.hash.match(/#admin\/(dashboard|users|products|orders|payments|withdrawals|support|settings|audit-logs)/);
        if (match && match[1]) {
          setCurrentSection(match[1] as AdminSection);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleExitToCustomerSite = () => {
    setActiveView('home');
    try {
      window.location.hash = '';
    } catch {}
  };

  // 1. Initial Session Loading (Only during the initial startup load)
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#07090d] flex flex-col items-center justify-center p-6 text-slate-100">
        <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-mono text-slate-400">Verifying Administrative Authorization...</span>
      </div>
    );
  }

  // 2. Unauthenticated: Render Admin Login & Setup screen
  if (!admin) {
    return (
      <AdminErrorBoundary onReset={() => window.location.reload()}>
        <AdminLogin onBackToCustomerSite={handleExitToCustomerSite} />
      </AdminErrorBoundary>
    );
  }

  // 3. Authenticated Admin: Render Admin Console Layout & Section
  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'dashboard':
        return <AdminDashboard onNavigate={(sec) => setCurrentSection(sec as AdminSection)} />;
      case 'users':
        return <AdminUsers />;
      case 'products':
        return <AdminProducts />;
      case 'orders':
        return <AdminOrders />;
      case 'payments':
        return <AdminPayments />;
      case 'withdrawals':
        return <AdminWithdrawals />;
      case 'support':
        return <AdminSupport />;
      case 'settings':
        return <AdminSettings />;
      case 'audit-logs':
        return <AdminAuditLogs />;
      default:
        return <AdminDashboard onNavigate={(sec) => setCurrentSection(sec as AdminSection)} />;
    }
  };

  return (
    <AdminErrorBoundary onReset={() => setCurrentSection('dashboard')}>
      <AdminLayout
        currentSection={currentSection}
        onNavigate={setCurrentSection}
        onExitToCustomerSite={handleExitToCustomerSite}
      >
        {renderCurrentSection()}
      </AdminLayout>
    </AdminErrorBoundary>
  );
};
