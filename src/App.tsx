/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/common/ToastContainer';
import { AuthModal } from './components/auth/AuthModal';

import { HomePage } from './pages/HomePage';
import { ProductsPage } from './pages/ProductsPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { DepositPage } from './pages/DepositPage';
import { WithdrawPage } from './pages/WithdrawPage';
import { ReferralPage } from './pages/ReferralPage';
import { DashboardPage } from './pages/DashboardPage';
import { MyProductsPage } from './pages/MyProductsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { ProfilePage } from './pages/ProfilePage';
import { SupportPage } from './pages/SupportPage';
import { FAQPage } from './pages/FAQPage';
import { LegalPage } from './pages/LegalPage';
import { AdminPage } from './pages/AdminPage';

const AppContent: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  // Detect URL path or hash like /admin, /admin/login, #admin on mount and hash changes
  useEffect(() => {
    const checkAdminRoute = () => {
      if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        const hash = window.location.hash;
        if (path.includes('/admin') || hash.startsWith('#admin')) {
          setActiveView('admin');
        }
      }
    };

    checkAdminRoute();
    window.addEventListener('hashchange', checkAdminRoute);
    window.addEventListener('popstate', checkAdminRoute);

    return () => {
      window.removeEventListener('hashchange', checkAdminRoute);
      window.removeEventListener('popstate', checkAdminRoute);
    };
  }, [setActiveView]);

  // If in Admin Console, render dedicated Admin Console without customer navbars
  if (activeView === 'admin') {
    return (
      <div className="min-h-screen bg-[#07090d] text-slate-100 selection:bg-rose-500/20 selection:text-rose-200">
        <AdminPage />
        <ToastContainer />
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (activeView) {
      case 'home':
        return <HomePage />;
      case 'products':
        return <ProductsPage />;
      case 'product-details':
        return <ProductDetailsPage />;
      case 'deposit':
        return <DepositPage />;
      case 'withdraw':
        return <WithdrawPage />;
      case 'referral':
        return <ReferralPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'my-products':
        return <MyProductsPage />;
      case 'transactions':
        return <TransactionsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'support':
        return <SupportPage />;
      case 'faq':
        return <FAQPage />;
      case 'privacy':
        return <LegalPage initialTab="privacy" />;
      case 'terms':
        return <LegalPage initialTab="terms" />;
      case 'disclaimer':
        return <LegalPage initialTab="disclaimer" />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#090b0e] text-slate-100 selection:bg-rose-500/20 selection:text-rose-200">
      <Header />
      
      <main className="flex-1 pb-16 md:pb-0">
        {renderCurrentView()}
      </main>

      <Footer />
      
      {/* Mobile Bottom Navigation respecting 15% sticky cap */}
      <MobileNav />

      {/* Global Toast Notifications */}
      <ToastContainer />

      {/* Global Auth Modal */}
      <AuthModal />
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('App error caught by ErrorBoundary:', error, errorInfo);
  }

  handleReload = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.clear();
      }
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#090b0e] text-slate-100 flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-[#0f131a] border border-[#232c3c] rounded-2xl p-8 space-y-4 shadow-2xl">
            <h1 className="text-xl font-bold font-mono tracking-tight text-white">VELORA</h1>
            <p className="text-xs text-slate-400">
              An unexpected render issue occurred. Click below to reload the platform.
            </p>
            <button
              onClick={this.handleReload}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors"
            >
              Reload Platform
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <AdminAuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AdminAuthProvider>
    </ErrorBoundary>
  );
}
