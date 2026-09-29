export type NetworkType = 'BEP20' | 'TRC20';

export type TransactionType = 
  | 'Deposit' 
  | 'Withdrawal' 
  | 'Product Purchase' 
  | 'Product Reward' 
  | 'Referral Reward';

export type TransactionStatus = 'Pending' | 'Completed' | 'Failed' | 'Cancelled';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  registeredAt: string;
  accountStatus: 'Active' | 'Under Review' | 'Suspended';
  isAgeVerified: boolean;
  kycStatus: 'Not Required' | 'Optional Pending' | 'Verified';
  referralCode: string;
  referredBy?: string;
  notifications: {
    emailAlerts: boolean;
    rewardAlerts: boolean;
    securityAlerts: boolean;
  };
}

export interface Product {
  id: string;
  name: string;
  tier: string;
  priceUSDT: number;
  dailyRewardRate: number; // 0.05 (5%)
  cycleHours: number; // 24 hours
  description: string;
  features: string[];
  allocationLimit: number;
  availableSlots: number;
  minDurationDays: number;
  badge?: string;
}

export interface UserActiveProduct {
  id: string;
  productId: string;
  productName: string;
  productValue: number;
  purchaseDate: string;
  activationDate: string;
  activationStatus: 'Pending Activation' | 'Active' | 'Completed' | 'Terminated';
  currentCycle: number;
  totalCyclesCompleted: number;
  dailyRewardAmount: number; // 5% of value
  totalRewardsReceived: number;
  lastRewardTime?: string;
  nextRewardTime: string; // ISO string
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  currency: 'USDT';
  network?: NetworkType;
  txHash?: string;
  walletAddress?: string;
  date: string;
  status: TransactionStatus;
  note?: string;
}

export interface ReferralRecord {
  id: string;
  userId: string;
  userName: string;
  joinedDate: string;
  status: 'Active' | 'Inactive';
  totalContributedUSDT: number;
  commissionEarnedUSDT: number; // 10%
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  subject: string;
  category: 'Deposit Issue' | 'Withdrawal Query' | 'Product Reward' | 'Account Security' | 'General';
  message: string;
  status: 'Open' | 'In Progress' | 'Resolved';
  createdAt: string;
  updatedAt: string;
  adminReply?: string;
}

export interface WalletState {
  totalBalanceUSDT: number;
  availableUSDT: number;
  pendingUSDT: number;
  totalProductRewardsUSDT: number;
  totalReferralRewardsUSDT: number;
}
