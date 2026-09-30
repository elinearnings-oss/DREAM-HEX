import { Product, Transaction, SupportTicket, NetworkType } from './index';

export type AdminRole = 'admin' | 'manager' | 'superadmin';

export interface AdminProfile {
  uid: string;
  email: string;
  name: string;
  role: AdminRole;
  isMasterAdmin?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserRecord {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin' | 'manager';
  registeredAt: string;
  accountStatus: 'Active' | 'Under Review' | 'Suspended';
  isAgeVerified: boolean;
  kycStatus: 'Not Required' | 'Optional Pending' | 'Verified';
  referralCode: string;
  referredBy?: string;
  walletBalanceUSDT: number;
  totalOrdersCount: number;
  totalDepositAmount: number;
  totalWithdrawalAmount: number;
}

export interface AdminOrderRecord {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  productId: string;
  productName: string;
  amount: number;
  dailyRewardRate: number; // e.g. 0.05
  dailyRewardAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Failed' | 'Refunded';
  orderStatus: 'Active' | 'Completed' | 'Pending Activation' | 'Suspended' | 'Cancelled';
  currentCycle: number;
  totalCyclesCompleted: number;
  totalRewardsPaid: number;
  purchaseDate: string;
  activationDate: string;
  nextRewardTime: string;
  updatedAt: string;
}

export interface AdminDepositRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  currency: 'USDT';
  network: NetworkType;
  paymentMethod: 'HELEKET Gateway';
  txHash?: string;
  status: 'Pending' | 'Completed' | 'Rejected' | 'Cancelled';
  date: string;
  adminActionBy?: string;
  adminActionAt?: string;
  adminNotes?: string;
}

export interface AdminWithdrawalRecord {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  amount: number;
  currency: 'USDT';
  network: NetworkType;
  walletAddress: string;
  status: 'Pending' | 'Completed' | 'Rejected' | 'Cancelled';
  date: string;
  txHash?: string;
  adminActionBy?: string;
  adminActionAt?: string;
  adminNotes?: string;
}

export interface AdminSupportRecord extends SupportTicket {
  userName?: string;
  adminRespondedBy?: string;
  adminRespondedAt?: string;
}

export interface AdminAuditRecord {
  id: string;
  adminEmail: string;
  action: string;
  targetType: 'user' | 'product' | 'order' | 'deposit' | 'withdrawal' | 'support' | 'settings' | 'auth';
  targetId: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface PlatformSettingsRecord {
  id?: string;
  brandName: string;
  tagline: string;
  logoUrl: string;
  supportEmail: string;
  supportHours: string;
  contactTelegram: string;
  contactPhone: string;
  businessAddress: string;
  paymentProvider: string;
  minDepositUSDT: number;
  minWithdrawalUSDT: number;
  productRewardRate: number; // 0.05
  referralRewardRate: number; // 0.10
  withdrawalFeePercent: number; // 0
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  updatedAt: string;
  updatedBy?: string;
}

export interface DashboardMetrics {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  pendingDeposits: number;
  pendingWithdrawals: number;
  openSupportRequests: number;
  totalWithdrawalsCompleted: number;
  totalRewardsDistributed: number;
}
