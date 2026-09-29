import React from 'react';
import { useApp } from '../../context/AppContext';
import { Home, Layers, ArrowDownToLine, Users, LayoutDashboard } from 'lucide-react';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView } = useApp();

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'products', label: 'Products', icon: Layers },
    { id: 'deposit', label: 'Deposit', icon: ArrowDownToLine },
    { id: 'referral', label: 'Referral', icon: Users },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  ];

  return (
    <nav 
      aria-label="Mobile navigation" 
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#090b0e]/95 backdrop-blur-lg border-t border-[#1a222e] h-14 px-2 flex items-center justify-around"
    >
      {navItems.map(item => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as any)}
            className={`flex flex-col items-center justify-center w-full py-1 text-[10px] font-medium transition-colors ${
              isActive ? 'text-rose-400' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-rose-500' : 'text-slate-400'}`} />
            <span className="truncate max-w-[60px]">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
