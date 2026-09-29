/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
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
  const { activeView } = useApp();

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
      case 'admin':
        return <AdminPage />;
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

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
