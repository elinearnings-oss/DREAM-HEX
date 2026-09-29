import { Product, User, UserActiveProduct, Transaction, ReferralRecord, SupportTicket } from '../types';

export const BRAND_INFO = {
  name: 'VELORA',
  tagline: 'Smart Products. Real Rewards',
  country: 'Indonesia',
  legalName: 'VELORA',
  domain: 'Not purchased yet',
  supportEmail: 'amansharma16003@gmail.com',
  supportHours: '9:00 AM – 5:00 PM (GMT+7)',
  telegram: '@velorasupport0',
  whatsapp: 'N/A',
  instagram: 'N/A',
  twitter: 'N/A',
  businessAddress: 'N/A',
  paymentProvider: 'HELEKET',
  minDepositUSDT: 3,
  minWithdrawalUSDT: 0.5,
  withdrawalFeePercent: 0,
  productRewardRate: 0.05, // 5% per 24-hour cycle
  referralRewardRate: 0.10, // 10%
  supportedNetworks: ['BEP20', 'TRC20'] as const,
  minimumAge: 18,
};

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-v10',
    name: 'Velora Starter Node V1',
    tier: 'Tier 1 - Starter',
    priceUSDT: 10,
    dailyRewardRate: 0.05,
    cycleHours: 24,
    description: 'Entry-level digital computing slot with automated 24-hour cycle settlement and 5% allocation rewards.',
    features: [
      'Value: 10 USDT',
      'Daily 24h reward rate: 5% (0.50 USDT)',
      'Direct wallet credit per completed cycle',
      'Standard automated activation within 10 minutes',
      'Real-time cycle countdown telemetry'
    ],
    allocationLimit: 50,
    availableSlots: 38,
    minDurationDays: 1,
    badge: 'Popular Starter'
  },
  {
    id: 'prod-v25',
    name: 'Velora Core Node V2',
    tier: 'Tier 2 - Core',
    priceUSDT: 25,
    dailyRewardRate: 0.05,
    cycleHours: 24,
    description: 'Mid-tier node tier designed for enhanced digital product computing allocations with 5% rewards every 24 hours.',
    features: [
      'Value: 25 USDT',
      'Daily 24h reward rate: 5% (1.25 USDT)',
      'Automated 24h reward crediting',
      'Full cycle ledger tracking',
      'Integrated referral reward eligibility'
    ],
    allocationLimit: 40,
    availableSlots: 26,
    minDurationDays: 1
  },
  {
    id: 'prod-v50',
    name: 'Velora Prime Node V3',
    tier: 'Tier 3 - Prime',
    priceUSDT: 50,
    dailyRewardRate: 0.05,
    cycleHours: 24,
    description: 'High-capacity computing node allocation for active digital reward participants, featuring 5% reward distribution per 24h cycle.',
    features: [
      'Value: 50 USDT',
      'Daily 24h reward rate: 5% (2.50 USDT)',
      '24h cycle auto-settlement to available balance',
      'Detailed cycle execution timestamp logs',
      'Priority node activation queue'
    ],
    allocationLimit: 30,
    availableSlots: 19,
    minDurationDays: 1,
    badge: 'Recommended'
  },
  {
    id: 'prod-v100',
    name: 'Velora Enterprise Node V4',
    tier: 'Tier 4 - Enterprise',
    priceUSDT: 100,
    dailyRewardRate: 0.05,
    cycleHours: 24,
    description: 'Top-tier product allocation for high-throughput digital service participation with consistent 5% reward rate per 24-hour cycle.',
    features: [
      'Value: 100 USDT',
      'Daily 24h reward rate: 5% (5.00 USDT)',
      'Instant settlement upon cycle completion',
      'Comprehensive product performance analytics',
      'Dedicated support priority queue'
    ],
    allocationLimit: 20,
    availableSlots: 11,
    minDurationDays: 1,
    badge: 'Maximum Allocation'
  }
];

export const INITIAL_USER: User = {
  id: 'usr-8921',
  name: 'Alexandre Pratama',
  email: 'alex.pratama@example.com',
  role: 'user',
  registeredAt: '2026-08-15T09:20:00Z',
  accountStatus: 'Active',
  isAgeVerified: true,
  kycStatus: 'Not Required',
  referralCode: 'VEL-78492',
  notifications: {
    emailAlerts: true,
    rewardAlerts: true,
    securityAlerts: true
  }
};

export const INITIAL_ACTIVE_PRODUCTS: UserActiveProduct[] = [
  {
    id: 'act-101',
    productId: 'prod-v50',
    productName: 'Velora Prime Node V3',
    productValue: 50,
    purchaseDate: '2026-09-28T04:10:00Z',
    activationDate: '2026-09-28T04:15:00Z',
    activationStatus: 'Active',
    currentCycle: 2,
    totalCyclesCompleted: 1,
    dailyRewardAmount: 2.50,
    totalRewardsReceived: 2.50,
    lastRewardTime: '2026-09-29T04:15:00Z',
    // Next reward time is 24 hours from last reward (or 2 hours remaining for demonstration)
    nextRewardTime: new Date(Date.now() + 2 * 60 * 60 * 1000 + 42 * 60 * 1000).toISOString()
  },
  {
    id: 'act-102',
    productId: 'prod-v10',
    productName: 'Velora Starter Node V1',
    productValue: 10,
    purchaseDate: '2026-09-27T10:00:00Z',
    activationDate: '2026-09-27T10:05:00Z',
    activationStatus: 'Active',
    currentCycle: 3,
    totalCyclesCompleted: 2,
    dailyRewardAmount: 0.50,
    totalRewardsReceived: 1.00,
    lastRewardTime: '2026-09-29T10:05:00Z',
    nextRewardTime: new Date(Date.now() + 5 * 60 * 60 * 1000 + 15 * 60 * 1000).toISOString()
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-98041',
    type: 'Product Reward',
    amount: 2.50,
    currency: 'USDT',
    date: '2026-09-29T04:15:00Z',
    status: 'Completed',
    note: 'Cycle 1 completed for Velora Prime Node V3 (5% of 50 USDT)'
  },
  {
    id: 'TX-97812',
    type: 'Referral Reward',
    amount: 2.50,
    currency: 'USDT',
    date: '2026-09-28T18:40:00Z',
    status: 'Completed',
    note: '10% referral reward from user ref-390 (25 USDT product)'
  },
  {
    id: 'TX-97420',
    type: 'Product Purchase',
    amount: 50.00,
    currency: 'USDT',
    date: '2026-09-28T04:10:00Z',
    status: 'Completed',
    note: 'Purchase: Velora Prime Node V3'
  },
  {
    id: 'TX-96992',
    type: 'Deposit',
    amount: 60.00,
    currency: 'USDT',
    network: 'BEP20',
    txHash: '0x3f7a9c8b12e4d0f5e71829a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
    date: '2026-09-28T03:50:00Z',
    status: 'Completed',
    note: 'Deposit via HELEKET Gateway (BEP20)'
  },
  {
    id: 'TX-95110',
    type: 'Withdrawal',
    amount: 15.00,
    currency: 'USDT',
    network: 'TRC20',
    walletAddress: 'TYDzsYUEpvnYmQk4zGP9sWWcTEd2GhXY8A',
    date: '2026-09-26T14:20:00Z',
    status: 'Completed',
    note: 'Withdrawal to external TRC20 wallet (0% fee applied)'
  }
];

export const INITIAL_REFERRALS: ReferralRecord[] = [
  {
    id: 'ref-390',
    userId: 'usr-1049',
    userName: 'Budi Santoso',
    joinedDate: '2026-09-28',
    status: 'Active',
    totalContributedUSDT: 25.00,
    commissionEarnedUSDT: 2.50
  },
  {
    id: 'ref-391',
    userId: 'usr-1052',
    userName: 'Rini Wijaya',
    joinedDate: '2026-09-25',
    status: 'Active',
    totalContributedUSDT: 10.00,
    commissionEarnedUSDT: 1.00
  },
  {
    id: 'ref-392',
    userId: 'usr-1088',
    userName: 'Dedi Kurniawan',
    joinedDate: '2026-09-22',
    status: 'Inactive',
    totalContributedUSDT: 0.00,
    commissionEarnedUSDT: 0.00
  }
];

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'TCK-2026-001',
    userId: 'usr-8921',
    userEmail: 'alex.pratama@example.com',
    subject: 'Question on TRC20 deposit confirmation time',
    category: 'Deposit Issue',
    message: 'Hello, how many network confirmations are usually required for TRC20 deposits via HELEKET to credit?',
    status: 'Resolved',
    createdAt: '2026-09-27T11:20:00Z',
    updatedAt: '2026-09-27T12:05:00Z',
    adminReply: 'TRC20 deposits through the HELEKET payment gateway require 12 block confirmations (typically 1-3 minutes). Once verified, your balance updates automatically.'
  }
];
