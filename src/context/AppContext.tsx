import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Product, 
  UserActiveProduct, 
  Transaction, 
  ReferralRecord, 
  SupportTicket, 
  NetworkType, 
  WalletState 
} from '../types';
import { 
  INITIAL_USER, 
  INITIAL_PRODUCTS, 
  INITIAL_ACTIVE_PRODUCTS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_REFERRALS, 
  INITIAL_SUPPORT_TICKETS,
  BRAND_INFO 
} from '../data/mockData';

export type PageView = 
  | 'home'
  | 'products'
  | 'product-details'
  | 'deposit'
  | 'withdraw'
  | 'referral'
  | 'dashboard'
  | 'profile'
  | 'transactions'
  | 'my-products'
  | 'support'
  | 'faq'
  | 'privacy'
  | 'terms'
  | 'disclaimer'
  | 'admin';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  user: User | null;
  isAdmin: boolean;
  activeView: PageView;
  selectedProductId: string | null;
  authModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot' | 'reset';
  products: Product[];
  activeProducts: UserActiveProduct[];
  transactions: Transaction[];
  referrals: ReferralRecord[];
  supportTickets: SupportTicket[];
  wallet: WalletState;
  toasts: ToastMessage[];
  
  // Navigation & UI
  setActiveView: (view: PageView) => void;
  openProductDetails: (productId: string) => void;
  openAuthModal: (mode?: 'login' | 'register' | 'forgot' | 'reset') => void;
  closeAuthModal: () => void;
  showToast: (type: 'success' | 'error' | 'info', title: string, message: string) => void;
  dismissToast: (id: string) => void;
  
  // Auth
  login: (email: string, password?: string) => boolean;
  register: (name: string, email: string, isAgeVerified: boolean, refCode?: string) => boolean;
  logout: () => void;
  toggleAdminRole: () => void;
  updateUserProfile: (updates: Partial<User>) => void;
  
  // Financial & Product Actions
  purchaseProduct: (productId: string) => { success: boolean; message: string };
  triggerCycleReward: (userActiveProductId: string) => void;
  createDeposit: (amount: number, network: NetworkType, txHash?: string) => { success: boolean; message: string };
  requestWithdrawal: (amount: number, network: NetworkType, address: string) => { success: boolean; message: string };
  submitSupportTicket: (subject: string, category: SupportTicket['category'], message: string) => void;
  
  // Admin Operations
  adminApproveDeposit: (txId: string) => void;
  adminApproveWithdrawal: (txId: string) => void;
  adminReplyTicket: (ticketId: string, reply: string) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY_PREFIX = 'velora_v1_';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Read state from localStorage or use initial mock data
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'isAdmin');
    return saved ? JSON.parse(saved) : false;
  });

  const [activeView, setActiveView] = useState<PageView>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>('prod-v50');
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot' | 'reset'>('login');

  const [products] = useState<Product[]>(INITIAL_PRODUCTS);

  const [activeProducts, setActiveProducts] = useState<UserActiveProduct[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'activeProducts');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVE_PRODUCTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [referrals, setReferrals] = useState<ReferralRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'referrals');
    return saved ? JSON.parse(saved) : INITIAL_REFERRALS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'tickets');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_TICKETS;
  });

  // Calculate wallet dynamically from transactions or base
  const [wallet, setWallet] = useState<WalletState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_PREFIX + 'wallet');
    if (saved) return JSON.parse(saved);
    return {
      availableUSDT: 42.50, // Available balance for testing purchases and withdrawals
      pendingUSDT: 0.00,
      totalProductRewardsUSDT: 3.50,
      totalReferralRewardsUSDT: 3.50,
      totalBalanceUSDT: 42.50
    };
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // LocalStorage persist
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'isAdmin', JSON.stringify(isAdmin));
  }, [isAdmin]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'activeProducts', JSON.stringify(activeProducts));
  }, [activeProducts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'referrals', JSON.stringify(referrals));
  }, [referrals]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'tickets', JSON.stringify(supportTickets));
  }, [supportTickets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_PREFIX + 'wallet', JSON.stringify(wallet));
  }, [wallet]);

  // Window scroll to top on page view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message: string) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const openProductDetails = (productId: string) => {
    setSelectedProductId(productId);
    setActiveView('product-details');
  };

  const openAuthModal = (mode: 'login' | 'register' | 'forgot' | 'reset' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setAuthModalOpen(false);
  };

  // Auth actions
  const login = (email: string) => {
    const loggedUser: User = {
      ...INITIAL_USER,
      email: email || INITIAL_USER.email,
    };
    setUser(loggedUser);
    closeAuthModal();
    showToast('success', 'Logged In', `Welcome back, ${loggedUser.name}!`);
    return true;
  };

  const register = (name: string, email: string, isAgeVerified: boolean, refCode?: string) => {
    if (!isAgeVerified) {
      showToast('error', 'Age Requirement', 'You must be at least 18 years old to use VELORA.');
      return false;
    }
    const newUser: User = {
      id: `usr-${Math.floor(1000 + Math.random() * 9000)}`,
      name: name.trim() || 'New Member',
      email: email.trim(),
      role: 'user',
      registeredAt: new Date().toISOString(),
      accountStatus: 'Active',
      isAgeVerified: true,
      kycStatus: 'Not Required',
      referralCode: `VEL-${Math.floor(10000 + Math.random() * 90000)}`,
      referredBy: refCode || undefined,
      notifications: {
        emailAlerts: true,
        rewardAlerts: true,
        securityAlerts: true
      }
    };
    setUser(newUser);
    closeAuthModal();
    showToast('success', 'Account Created', 'Your VELORA account has been registered successfully.');
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAdmin(false);
    setActiveView('home');
    showToast('info', 'Logged Out', 'You have been securely signed out.');
  };

  const toggleAdminRole = () => {
    const nextAdmin = !isAdmin;
    setIsAdmin(nextAdmin);
    showToast('info', 'Role Switched', nextAdmin ? 'Admin mode enabled' : 'Switched back to standard user mode');
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (!user) return;
    setUser({ ...user, ...updates });
    showToast('success', 'Profile Updated', 'Your account settings have been saved.');
  };

  // Financial & Product actions
  const purchaseProduct = (productId: string) => {
    if (!user) {
      openAuthModal('login');
      return { success: false, message: 'Please log in to purchase products.' };
    }

    const prod = products.find(p => p.id === productId);
    if (!prod) {
      return { success: false, message: 'Product not found.' };
    }

    if (wallet.availableUSDT < prod.priceUSDT) {
      showToast('error', 'Insufficient Balance', `You need ${prod.priceUSDT} USDT available. Current balance: ${wallet.availableUSDT.toFixed(2)} USDT.`);
      return { success: false, message: 'Insufficient USDT available balance.' };
    }

    // Deduct balance
    const updatedAvailable = wallet.availableUSDT - prod.priceUSDT;
    setWallet(prev => ({
      ...prev,
      availableUSDT: updatedAvailable,
      totalBalanceUSDT: updatedAvailable + prev.pendingUSDT
    }));

    // Create Active Product record
    const now = new Date();
    const activationDate = new Date(now.getTime() + 5 * 60 * 1000); // Activated 5 minutes after purchase
    const nextReward = new Date(activationDate.getTime() + 24 * 60 * 60 * 1000); // 24h cycle
    const dailyRewardAmount = Number((prod.priceUSDT * BRAND_INFO.productRewardRate).toFixed(2));

    const newActiveProduct: UserActiveProduct = {
      id: `act-${Date.now().toString().slice(-4)}`,
      productId: prod.id,
      productName: prod.name,
      productValue: prod.priceUSDT,
      purchaseDate: now.toISOString(),
      activationDate: activationDate.toISOString(),
      activationStatus: 'Active',
      currentCycle: 1,
      totalCyclesCompleted: 0,
      dailyRewardAmount,
      totalRewardsReceived: 0,
      nextRewardTime: nextReward.toISOString()
    };

    setActiveProducts(prev => [newActiveProduct, ...prev]);

    // Create transaction record
    const newTx: Transaction = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'Product Purchase',
      amount: prod.priceUSDT,
      currency: 'USDT',
      date: now.toISOString(),
      status: 'Completed',
      note: `Purchase of ${prod.name} (${prod.priceUSDT} USDT)`
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast('success', 'Purchase Confirmed', `${prod.name} purchased! 24h reward cycle initiated (5% per cycle).`);

    return { success: true, message: 'Product successfully purchased and active.' };
  };

  // 24h Cycle Reward Trigger (Allows user or simulator to calculate and credit 5% reward)
  const triggerCycleReward = (userActiveProductId: string) => {
    const target = activeProducts.find(p => p.id === userActiveProductId);
    if (!target) return;

    const rewardAmount = target.dailyRewardAmount;
    const now = new Date();
    const nextReward = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Update active product
    setActiveProducts(prev => prev.map(p => {
      if (p.id === userActiveProductId) {
        return {
          ...p,
          currentCycle: p.currentCycle + 1,
          totalCyclesCompleted: p.totalCyclesCompleted + 1,
          totalRewardsReceived: Number((p.totalRewardsReceived + rewardAmount).toFixed(2)),
          lastRewardTime: now.toISOString(),
          nextRewardTime: nextReward.toISOString()
        };
      }
      return p;
    }));

    // Credit wallet available balance
    setWallet(prev => {
      const nextAvailable = prev.availableUSDT + rewardAmount;
      const nextTotalRewards = prev.totalProductRewardsUSDT + rewardAmount;
      return {
        ...prev,
        availableUSDT: Number(nextAvailable.toFixed(2)),
        totalProductRewardsUSDT: Number(nextTotalRewards.toFixed(2)),
        totalBalanceUSDT: Number((nextAvailable + prev.pendingUSDT).toFixed(2))
      };
    });

    // Record reward transaction
    const rewardTx: Transaction = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'Product Reward',
      amount: rewardAmount,
      currency: 'USDT',
      date: now.toISOString(),
      status: 'Completed',
      note: `5% reward cycle credited for ${target.productName} (+${rewardAmount} USDT)`
    };

    setTransactions(prev => [rewardTx, ...prev]);
    showToast('success', 'Reward Credited', `+${rewardAmount.toFixed(2)} USDT (5% product reward) automatically added to available balance.`);
  };

  const createDeposit = (amount: number, network: NetworkType, txHash?: string) => {
    if (!user) {
      openAuthModal('login');
      return { success: false, message: 'Please log in to deposit.' };
    }

    if (amount < BRAND_INFO.minDepositUSDT) {
      showToast('error', 'Minimum Deposit', `The minimum deposit is ${BRAND_INFO.minDepositUSDT} USDT.`);
      return { success: false, message: `Minimum deposit is ${BRAND_INFO.minDepositUSDT} USDT.` };
    }

    const now = new Date();
    const hash = txHash || (network === 'BEP20' 
      ? `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
      : `tx${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`);

    // In production HELEKET integration, webhook confirms; in simulation we immediately complete deposit to available balance
    setWallet(prev => {
      const newAvailable = prev.availableUSDT + amount;
      return {
        ...prev,
        availableUSDT: Number(newAvailable.toFixed(2)),
        totalBalanceUSDT: Number((newAvailable + prev.pendingUSDT).toFixed(2))
      };
    });

    const newTx: Transaction = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'Deposit',
      amount: amount,
      currency: 'USDT',
      network: network,
      txHash: hash,
      date: now.toISOString(),
      status: 'Completed',
      note: `Deposit via HELEKET Gateway (${network})`
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast('success', 'Deposit Confirmed', `+${amount.toFixed(2)} USDT credited via HELEKET (${network}).`);
    return { success: true, message: 'Deposit completed successfully.' };
  };

  const requestWithdrawal = (amount: number, network: NetworkType, address: string) => {
    if (!user) {
      openAuthModal('login');
      return { success: false, message: 'Please log in to request a withdrawal.' };
    }

    if (amount < BRAND_INFO.minWithdrawalUSDT) {
      showToast('error', 'Minimum Withdrawal', `Minimum withdrawal is ${BRAND_INFO.minWithdrawalUSDT} USDT.`);
      return { success: false, message: `Minimum withdrawal is ${BRAND_INFO.minWithdrawalUSDT} USDT.` };
    }

    if (amount > wallet.availableUSDT) {
      showToast('error', 'Insufficient Funds', `Requested: ${amount} USDT, Available: ${wallet.availableUSDT.toFixed(2)} USDT.`);
      return { success: false, message: 'Insufficient available funds.' };
    }

    // Validate network address format
    if (network === 'BEP20' && (!address.startsWith('0x') || address.length !== 42)) {
      showToast('error', 'Invalid Address', 'BEP20 USDT address must begin with 0x and be 42 characters long.');
      return { success: false, message: 'Invalid BEP20 address.' };
    }

    if (network === 'TRC20' && (!address.startsWith('T') || address.length < 33 || address.length > 35)) {
      showToast('error', 'Invalid Address', 'TRC20 USDT address must begin with "T" and be ~34 characters long.');
      return { success: false, message: 'Invalid TRC20 address.' };
    }

    // Deduct available balance
    setWallet(prev => {
      const nextAvailable = prev.availableUSDT - amount;
      return {
        ...prev,
        availableUSDT: Number(nextAvailable.toFixed(2)),
        totalBalanceUSDT: Number((nextAvailable + prev.pendingUSDT).toFixed(2))
      };
    });

    const now = new Date();
    const newTx: Transaction = {
      id: `TX-${Math.floor(10000 + Math.random() * 90000)}`,
      type: 'Withdrawal',
      amount: amount,
      currency: 'USDT',
      network: network,
      walletAddress: address,
      date: now.toISOString(),
      status: 'Completed',
      note: `Withdrawal to ${address.slice(0, 6)}...${address.slice(-4)} (${network}) with 0% fee`
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast('success', 'Withdrawal Processed', `${amount.toFixed(2)} USDT sent to your ${network} address (0% fee).`);
    return { success: true, message: 'Withdrawal processed successfully.' };
  };

  const submitSupportTicket = (subject: string, category: SupportTicket['category'], message: string) => {
    const newTicket: SupportTicket = {
      id: `TCK-2026-${Math.floor(100 + Math.random() * 900)}`,
      userId: user?.id || 'guest',
      userEmail: user?.email || BRAND_INFO.supportEmail,
      subject,
      category,
      message,
      status: 'Open',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setSupportTickets(prev => [newTicket, ...prev]);
    showToast('success', 'Ticket Submitted', `Support ticket #${newTicket.id} received. Response within support hours (9:00 AM - 5:00 PM GMT+7).`);
  };

  // Admin actions
  const adminApproveDeposit = (txId: string) => {
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'Completed' } : t));
    showToast('success', 'Deposit Verified', `Transaction ${txId} marked Completed.`);
  };

  const adminApproveWithdrawal = (txId: string) => {
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'Completed' } : t));
    showToast('success', 'Withdrawal Processed', `Transaction ${txId} marked Completed.`);
  };

  const adminReplyTicket = (ticketId: string, reply: string) => {
    setSupportTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          status: 'Resolved',
          adminReply: reply,
          updatedAt: new Date().toISOString()
        };
      }
      return t;
    }));
    showToast('success', 'Ticket Updated', `Reply posted to ticket ${ticketId}.`);
  };

  const resetAllData = () => {
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'user');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'isAdmin');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'activeProducts');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'transactions');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'referrals');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'tickets');
    localStorage.removeItem(STORAGE_KEY_PREFIX + 'wallet');

    setUser(INITIAL_USER);
    setIsAdmin(false);
    setActiveProducts(INITIAL_ACTIVE_PRODUCTS);
    setTransactions(INITIAL_TRANSACTIONS);
    setReferrals(INITIAL_REFERRALS);
    setSupportTickets(INITIAL_SUPPORT_TICKETS);
    setWallet({
      availableUSDT: 42.50,
      pendingUSDT: 0.00,
      totalProductRewardsUSDT: 3.50,
      totalReferralRewardsUSDT: 3.50,
      totalBalanceUSDT: 42.50
    });
    showToast('info', 'Data Reset', 'Demo state reset to initial values.');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isAdmin,
        activeView,
        selectedProductId,
        authModalOpen,
        authModalMode,
        products,
        activeProducts,
        transactions,
        referrals,
        supportTickets,
        wallet,
        toasts,
        setActiveView,
        openProductDetails,
        openAuthModal,
        closeAuthModal,
        showToast,
        dismissToast,
        login,
        register,
        logout,
        toggleAdminRole,
        updateUserProfile,
        purchaseProduct,
        triggerCycleReward,
        createDeposit,
        requestWithdrawal,
        submitSupportTicket,
        adminApproveDeposit,
        adminApproveWithdrawal,
        adminReplyTicket,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
