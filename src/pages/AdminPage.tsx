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
import { Shield, Lock, RefreshCw } from 'lucide-react';

export const AdminPage: React.FC = () => {
  const { admin, loading, needsInitialSetup } = useAdminAuth();
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

  // Listen to hash changes in case of browser back/forward
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

  // 1. Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07090d] flex flex-col items-center justify-center p-6 text-slate-100">
        <div className="w-10 h-10 border-2 border-rose-500 border-t-transparent rounded-full animate-spin mb-4" />
        <span className="text-xs font-mono text-slate-400">Verifying Administrative Authorization...</span>
      </div>
    );
  }

  // 2. Unauthenticated: Render Admin Login (or First Admin Setup)
  if (!admin) {
    return <AdminLogin onBackToCustomerSite={handleExitToCustomerSite} />;
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
    <AdminLayout
      currentSection={currentSection}
      onNavigate={setCurrentSection}
      onExitToCustomerSite={handleExitToCustomerSite}
    >
      {renderCurrentSection()}
    </AdminLayout>
  );
};
