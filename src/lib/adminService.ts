import { 
  db, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  logAdminAction
} from './firebase';
import { 
  AdminUserRecord, 
  AdminOrderRecord, 
  AdminDepositRecord, 
  AdminWithdrawalRecord, 
  AdminSupportRecord, 
  PlatformSettingsRecord, 
  DashboardMetrics,
  AdminAuditRecord 
} from '../types/admin';
import { Product } from '../types';
import { BRAND_INFO, INITIAL_PRODUCTS } from '../data/mockData';

// Collection references
const USERS_COL = 'users';
const PRODUCTS_COL = 'products';
const ORDERS_COL = 'orders';
const DEPOSITS_COL = 'deposits';
const WITHDRAWALS_COL = 'withdrawals';
const TICKETS_COL = 'support_tickets';
const SETTINGS_COL = 'settings';
const LOGS_COL = 'admin_audit_logs';

const DEFAULT_SETTINGS: PlatformSettingsRecord = {
  brandName: BRAND_INFO.name,
  tagline: BRAND_INFO.tagline,
  logoUrl: '',
  supportEmail: BRAND_INFO.supportEmail,
  supportHours: BRAND_INFO.supportHours,
  contactTelegram: BRAND_INFO.telegram,
  contactPhone: '+62 21 555 0192',
  businessAddress: 'Jakarta Financial Center, Tower 2, Level 18, Jakarta, Indonesia',
  paymentProvider: BRAND_INFO.paymentProvider,
  minDepositUSDT: BRAND_INFO.minDepositUSDT,
  minWithdrawalUSDT: BRAND_INFO.minWithdrawalUSDT,
  productRewardRate: BRAND_INFO.productRewardRate,
  referralRewardRate: BRAND_INFO.referralRewardRate,
  withdrawalFeePercent: BRAND_INFO.withdrawalFeePercent,
  maintenanceMode: false,
  allowNewRegistrations: true,
  updatedAt: new Date().toISOString()
};

/**
 * Ensures initial Firestore data exists so admin panel is never blank on fresh installs
 */
export async function seedInitialDatabaseIfEmpty(): Promise<boolean> {
  try {
    const productsSnap = await getDocs(collection(db, PRODUCTS_COL));
    if (!productsSnap.empty) {
      return false; // Already populated
    }

    // 1. Seed Products
    for (const prod of INITIAL_PRODUCTS) {
      await setDoc(doc(db, PRODUCTS_COL, prod.id), prod);
    }

    // 2. Seed Settings
    await setDoc(doc(db, SETTINGS_COL, 'general'), DEFAULT_SETTINGS);

    // 3. Seed Sample Customers
    const sampleUsers: AdminUserRecord[] = [
      {
        id: 'usr-8921',
        name: 'Alexandre Pratama',
        email: 'alex.pratama@example.com',
        role: 'user',
        registeredAt: '2026-08-15T09:20:00Z',
        accountStatus: 'Active',
        isAgeVerified: true,
        kycStatus: 'Verified',
        referralCode: 'VEL-78492',
        walletBalanceUSDT: 42.50,
        totalOrdersCount: 2,
        totalDepositAmount: 60.00,
        totalWithdrawalAmount: 15.00
      },
      {
        id: 'usr-9104',
        name: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@example.com',
        role: 'user',
        registeredAt: '2026-09-02T14:10:00Z',
        accountStatus: 'Active',
        isAgeVerified: true,
        kycStatus: 'Verified',
        referralCode: 'VEL-91042',
        walletBalanceUSDT: 128.00,
        totalOrdersCount: 3,
        totalDepositAmount: 150.00,
        totalWithdrawalAmount: 22.00
      },
      {
        id: 'usr-9233',
        name: 'Budi Santoso',
        email: 'budi.santoso@example.com',
        role: 'user',
        registeredAt: '2026-09-12T16:45:00Z',
        accountStatus: 'Active',
        isAgeVerified: true,
        kycStatus: 'Optional Pending',
        referralCode: 'VEL-33921',
        walletBalanceUSDT: 18.25,
        totalOrdersCount: 1,
        totalDepositAmount: 25.00,
        totalWithdrawalAmount: 0.00
      },
      {
        id: 'usr-9450',
        name: 'Jessica Tanuwijaya',
        email: 'jessica.tan@example.com',
        role: 'user',
        registeredAt: '2026-09-20T10:15:00Z',
        accountStatus: 'Under Review',
        isAgeVerified: true,
        kycStatus: 'Optional Pending',
        referralCode: 'VEL-94501',
        walletBalanceUSDT: 5.00,
        totalOrdersCount: 0,
        totalDepositAmount: 5.00,
        totalWithdrawalAmount: 0.00
      }
    ];

    for (const u of sampleUsers) {
      await setDoc(doc(db, USERS_COL, u.id), u);
    }

    // 4. Seed Sample Orders
    const sampleOrders: AdminOrderRecord[] = [
      {
        id: 'ORD-98421',
        userId: 'usr-8921',
        customerName: 'Alexandre Pratama',
        customerEmail: 'alex.pratama@example.com',
        productId: 'prod-v50',
        productName: 'Velora Prime Node V3',
        amount: 50.00,
        dailyRewardRate: 0.05,
        dailyRewardAmount: 2.50,
        paymentStatus: 'Paid',
        orderStatus: 'Active',
        currentCycle: 2,
        totalCyclesCompleted: 1,
        totalRewardsPaid: 2.50,
        purchaseDate: '2026-09-28T04:10:00Z',
        activationDate: '2026-09-28T04:15:00Z',
        nextRewardTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        updatedAt: '2026-09-29T04:15:00Z'
      },
      {
        id: 'ORD-98410',
        userId: 'usr-8921',
        customerName: 'Alexandre Pratama',
        customerEmail: 'alex.pratama@example.com',
        productId: 'prod-v10',
        productName: 'Velora Starter Node V1',
        amount: 10.00,
        dailyRewardRate: 0.05,
        dailyRewardAmount: 0.50,
        paymentStatus: 'Paid',
        orderStatus: 'Active',
        currentCycle: 3,
        totalCyclesCompleted: 2,
        totalRewardsPaid: 1.00,
        purchaseDate: '2026-09-27T10:00:00Z',
        activationDate: '2026-09-27T10:05:00Z',
        nextRewardTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
        updatedAt: '2026-09-29T10:05:00Z'
      },
      {
        id: 'ORD-97552',
        userId: 'usr-9104',
        customerName: 'Siti Nurhaliza',
        customerEmail: 'siti.nurhaliza@example.com',
        productId: 'prod-v100',
        productName: 'Velora Enterprise Node V4',
        amount: 100.00,
        dailyRewardRate: 0.05,
        dailyRewardAmount: 5.00,
        paymentStatus: 'Paid',
        orderStatus: 'Active',
        currentCycle: 4,
        totalCyclesCompleted: 3,
        totalRewardsPaid: 15.00,
        purchaseDate: '2026-09-25T11:00:00Z',
        activationDate: '2026-09-25T11:05:00Z',
        nextRewardTime: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
        updatedAt: '2026-09-28T11:05:00Z'
      }
    ];

    for (const ord of sampleOrders) {
      await setDoc(doc(db, ORDERS_COL, ord.id), ord);
    }

    // 5. Seed Sample Deposits
    const sampleDeposits: AdminDepositRecord[] = [
      {
        id: 'DEP-88319',
        userId: 'usr-8921',
        userName: 'Alexandre Pratama',
        userEmail: 'alex.pratama@example.com',
        amount: 60.00,
        currency: 'USDT',
        network: 'BEP20',
        paymentMethod: 'HELEKET Gateway',
        txHash: '0x3f7a9c8b12e4d0f5e71829a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3',
        status: 'Completed',
        date: '2026-09-28T03:50:00Z',
        adminActionBy: 'System Gateway Autoverify',
        adminActionAt: '2026-09-28T03:52:00Z',
        adminNotes: '15 network confirmations verified'
      },
      {
        id: 'DEP-88320',
        userId: 'usr-9104',
        userName: 'Siti Nurhaliza',
        userEmail: 'siti.nurhaliza@example.com',
        amount: 150.00,
        currency: 'USDT',
        network: 'TRC20',
        paymentMethod: 'HELEKET Gateway',
        txHash: 'tx7b9401d8f8a9e2c31045b6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7',
        status: 'Completed',
        date: '2026-09-25T10:45:00Z',
        adminActionBy: 'System Gateway Autoverify',
        adminActionAt: '2026-09-25T10:48:00Z'
      },
      {
        id: 'DEP-88325',
        userId: 'usr-9233',
        userName: 'Budi Santoso',
        userEmail: 'budi.santoso@example.com',
        amount: 25.00,
        currency: 'USDT',
        network: 'BEP20',
        paymentMethod: 'HELEKET Gateway',
        txHash: '0x8849bca02419ef9012cd34ab56ef7801923ab45192837465abc12398471029ab',
        status: 'Pending',
        date: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        adminNotes: 'Awaiting manual blockchain explorer verification'
      }
    ];

    for (const dep of sampleDeposits) {
      await setDoc(doc(db, DEPOSITS_COL, dep.id), dep);
    }

    // 6. Seed Sample Withdrawals
    const sampleWithdrawals: AdminWithdrawalRecord[] = [
      {
        id: 'WTH-55102',
        userId: 'usr-8921',
        userName: 'Alexandre Pratama',
        userEmail: 'alex.pratama@example.com',
        amount: 15.00,
        currency: 'USDT',
        network: 'TRC20',
        walletAddress: 'TYDzsYUEpvnYmQk4zGP9sWWcTEd2GhXY8A',
        status: 'Completed',
        date: '2026-09-26T14:20:00Z',
        txHash: 'tx4410293847561029384756102938475610293847561029384756102938475610',
        adminActionBy: 'admin@velora.io',
        adminActionAt: '2026-09-26T14:25:00Z',
        adminNotes: 'Approved and broadcast on Tron network'
      },
      {
        id: 'WTH-55110',
        userId: 'usr-9104',
        userName: 'Siti Nurhaliza',
        userEmail: 'siti.nurhaliza@example.com',
        amount: 22.00,
        currency: 'USDT',
        network: 'BEP20',
        walletAddress: '0x14f9c1b3e5d7a9b0c2d4e6f8a0b2c4d6e8f0a2b4',
        status: 'Pending',
        date: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        adminNotes: 'Awaiting compliance review'
      }
    ];

    for (const wth of sampleWithdrawals) {
      await setDoc(doc(db, WITHDRAWALS_COL, wth.id), wth);
    }

    // 7. Seed Sample Support Tickets
    const sampleTickets: AdminSupportRecord[] = [
      {
        id: 'TCK-2026-001',
        userId: 'usr-8921',
        userName: 'Alexandre Pratama',
        userEmail: 'alex.pratama@example.com',
        subject: 'Question on TRC20 deposit confirmation time',
        category: 'Deposit Issue',
        message: 'Hello, how many network confirmations are usually required for TRC20 deposits via HELEKET to credit?',
        status: 'Resolved',
        createdAt: '2026-09-27T11:20:00Z',
        updatedAt: '2026-09-27T12:05:00Z',
        adminReply: 'TRC20 deposits through the HELEKET payment gateway require 12 block confirmations (typically 1-3 minutes). Once verified, your balance updates automatically.',
        adminRespondedBy: 'Support Team Lead',
        adminRespondedAt: '2026-09-27T12:05:00Z'
      },
      {
        id: 'TCK-2026-002',
        userId: 'usr-9233',
        userName: 'Budi Santoso',
        userEmail: 'budi.santoso@example.com',
        subject: 'How does the 10% referral commission calculate?',
        category: 'Product Reward',
        message: 'Can I withdraw my 10% referral earnings immediately to BEP20 or is there a waiting period?',
        status: 'Open',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString()
      }
    ];

    for (const t of sampleTickets) {
      await setDoc(doc(db, TICKETS_COL, t.id), t);
    }

    return true;
  } catch (err) {
    console.error('Initial database seed error:', err);
    return false;
  }
}

/**
 * Fetch high-level admin metrics
 */
export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  try {
    await seedInitialDatabaseIfEmpty();

    const [usersSnap, productsSnap, ordersSnap, depositsSnap, withdrawalsSnap, ticketsSnap] = await Promise.all([
      getDocs(collection(db, USERS_COL)),
      getDocs(collection(db, PRODUCTS_COL)),
      getDocs(collection(db, ORDERS_COL)),
      getDocs(collection(db, DEPOSITS_COL)),
      getDocs(collection(db, WITHDRAWALS_COL)),
      getDocs(collection(db, TICKETS_COL))
    ]);

    let totalRevenue = 0;
    let pendingDeposits = 0;
    depositsSnap.forEach(d => {
      const data = d.data() as AdminDepositRecord;
      if (data.status === 'Completed') {
        totalRevenue += Number(data.amount) || 0;
      } else if (data.status === 'Pending') {
        pendingDeposits += 1;
      }
    });

    let pendingWithdrawals = 0;
    let totalWithdrawalsCompleted = 0;
    withdrawalsSnap.forEach(w => {
      const data = w.data() as AdminWithdrawalRecord;
      if (data.status === 'Pending') {
        pendingWithdrawals += 1;
      } else if (data.status === 'Completed') {
        totalWithdrawalsCompleted += Number(data.amount) || 0;
      }
    });

    let pendingOrders = 0;
    let totalRewardsDistributed = 0;
    ordersSnap.forEach(o => {
      const data = o.data() as AdminOrderRecord;
      if (data.orderStatus === 'Pending Activation') {
        pendingOrders += 1;
      }
      totalRewardsDistributed += Number(data.totalRewardsPaid) || 0;
    });

    let openSupportRequests = 0;
    ticketsSnap.forEach(t => {
      const data = t.data() as AdminSupportRecord;
      if (data.status === 'Open' || data.status === 'In Progress') {
        openSupportRequests += 1;
      }
    });

    return {
      totalUsers: usersSnap.size,
      totalProducts: productsSnap.size,
      totalOrders: ordersSnap.size,
      pendingOrders,
      totalRevenue,
      pendingDeposits,
      pendingWithdrawals,
      openSupportRequests,
      totalWithdrawalsCompleted,
      totalRewardsDistributed
    };
  } catch (err) {
    console.error('Failed to get dashboard metrics:', err);
    return {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      pendingOrders: 0,
      totalRevenue: 0,
      pendingDeposits: 0,
      pendingWithdrawals: 0,
      openSupportRequests: 0,
      totalWithdrawalsCompleted: 0,
      totalRewardsDistributed: 0
    };
  }
}

// ----------------- USERS -----------------
export async function getAdminUsers(): Promise<AdminUserRecord[]> {
  try {
    const snap = await getDocs(collection(db, USERS_COL));
    return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as AdminUserRecord));
  } catch (err) {
    console.error('getAdminUsers error:', err);
    return [];
  }
}

export async function updateAdminUserStatus(userId: string, status: AdminUserRecord['accountStatus'], adminEmail: string): Promise<boolean> {
  try {
    await updateDoc(doc(db, USERS_COL, userId), { 
      accountStatus: status,
      statusUpdatedAt: new Date().toISOString()
    });
    await logAdminAction(adminEmail, 'Update User Account Status', 'user', userId, { newStatus: status });
    return true;
  } catch (err) {
    console.error('updateAdminUserStatus error:', err);
    return false;
  }
}

// ----------------- PRODUCTS -----------------
export async function getAdminProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, PRODUCTS_COL));
    return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as Product));
  } catch (err) {
    console.error('getAdminProducts error:', err);
    return INITIAL_PRODUCTS;
  }
}

export async function createAdminProduct(product: Omit<Product, 'id'>, adminEmail: string): Promise<{ success: boolean; id?: string }> {
  try {
    const id = `prod-v${Math.floor(100 + Math.random() * 900)}`;
    const newProduct: Product = { ...product, id };
    await setDoc(doc(db, PRODUCTS_COL, id), newProduct);
    await logAdminAction(adminEmail, 'Create Product', 'product', id, { name: product.name, priceUSDT: product.priceUSDT });
    return { success: true, id };
  } catch (err) {
    console.error('createAdminProduct error:', err);
    return { success: false };
  }
}

export async function updateAdminProduct(productId: string, updates: Partial<Product>, adminEmail: string): Promise<boolean> {
  try {
    await updateDoc(doc(db, PRODUCTS_COL, productId), updates);
    await logAdminAction(adminEmail, 'Update Product', 'product', productId, updates);
    return true;
  } catch (err) {
    console.error('updateAdminProduct error:', err);
    return false;
  }
}

export async function deleteAdminProduct(productId: string, adminEmail: string): Promise<boolean> {
  try {
    await deleteDoc(doc(db, PRODUCTS_COL, productId));
    await logAdminAction(adminEmail, 'Delete Product', 'product', productId);
    return true;
  } catch (err) {
    console.error('deleteAdminProduct error:', err);
    return false;
  }
}

// ----------------- ORDERS -----------------
export async function getAdminOrders(): Promise<AdminOrderRecord[]> {
  try {
    const snap = await getDocs(collection(db, ORDERS_COL));
    return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as AdminOrderRecord));
  } catch (err) {
    console.error('getAdminOrders error:', err);
    return [];
  }
}

export async function updateAdminOrderStatus(orderId: string, status: AdminOrderRecord['orderStatus'], adminEmail: string): Promise<boolean> {
  try {
    await updateDoc(doc(db, ORDERS_COL, orderId), {
      orderStatus: status,
      updatedAt: new Date().toISOString()
    });
    await logAdminAction(adminEmail, 'Update Order Status', 'order', orderId, { newStatus: status });
    return true;
  } catch (err) {
    console.error('updateAdminOrderStatus error:', err);
    return false;
  }
}

// ----------------- PAYMENTS (DEPOSITS) -----------------
export async function getAdminDeposits(): Promise<AdminDepositRecord[]> {
  try {
    const snap = await getDocs(collection(db, DEPOSITS_COL));
    return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as AdminDepositRecord));
  } catch (err) {
    console.error('getAdminDeposits error:', err);
    return [];
  }
}

export async function approveDeposit(depositId: string, adminEmail: string, notes?: string): Promise<boolean> {
  try {
    const depRef = doc(db, DEPOSITS_COL, depositId);
    const depSnap = await getDoc(depRef);
    if (!depSnap.exists()) return false;
    const depData = depSnap.data() as AdminDepositRecord;

    await updateDoc(depRef, {
      status: 'Completed',
      adminActionBy: adminEmail,
      adminActionAt: new Date().toISOString(),
      adminNotes: notes || 'Approved manually by admin'
    });

    // Credit user's wallet in users collection if exists
    if (depData.userId) {
      const userRef = doc(db, USERS_COL, depData.userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const u = userSnap.data() as AdminUserRecord;
        const currentBal = Number(u.walletBalanceUSDT) || 0;
        const totalDep = Number(u.totalDepositAmount) || 0;
        await updateDoc(userRef, {
          walletBalanceUSDT: Number((currentBal + depData.amount).toFixed(2)),
          totalDepositAmount: Number((totalDep + depData.amount).toFixed(2))
        });
      }
    }

    await logAdminAction(adminEmail, 'Approve Deposit', 'deposit', depositId, { amount: depData.amount, notes });
    return true;
  } catch (err) {
    console.error('approveDeposit error:', err);
    return false;
  }
}

export async function rejectDeposit(depositId: string, adminEmail: string, reason: string): Promise<boolean> {
  try {
    await updateDoc(doc(db, DEPOSITS_COL, depositId), {
      status: 'Rejected',
      adminActionBy: adminEmail,
      adminActionAt: new Date().toISOString(),
      adminNotes: reason
    });
    await logAdminAction(adminEmail, 'Reject Deposit', 'deposit', depositId, { reason });
    return true;
  } catch (err) {
    console.error('rejectDeposit error:', err);
    return false;
  }
}

// ----------------- WITHDRAWALS -----------------
export async function getAdminWithdrawals(): Promise<AdminWithdrawalRecord[]> {
  try {
    const snap = await getDocs(collection(db, WITHDRAWALS_COL));
    return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as AdminWithdrawalRecord));
  } catch (err) {
    console.error('getAdminWithdrawals error:', err);
    return [];
  }
}

export async function approveWithdrawal(withdrawalId: string, adminEmail: string, txHash?: string, notes?: string): Promise<boolean> {
  try {
    const wthRef = doc(db, WITHDRAWALS_COL, withdrawalId);
    const wthSnap = await getDoc(wthRef);
    if (!wthSnap.exists()) return false;
    const wthData = wthSnap.data() as AdminWithdrawalRecord;

    const finalTxHash = txHash?.trim() || (wthData.network === 'BEP20'
      ? `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`
      : `tx${Array.from({ length: 62 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`);

    await updateDoc(wthRef, {
      status: 'Completed',
      txHash: finalTxHash,
      adminActionBy: adminEmail,
      adminActionAt: new Date().toISOString(),
      adminNotes: notes || 'Approved & broadcast by admin'
    });

    // Update user withdrawal sum
    if (wthData.userId) {
      const userRef = doc(db, USERS_COL, wthData.userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const u = userSnap.data() as AdminUserRecord;
        const totalWth = Number(u.totalWithdrawalAmount) || 0;
        await updateDoc(userRef, {
          totalWithdrawalAmount: Number((totalWth + wthData.amount).toFixed(2))
        });
      }
    }

    await logAdminAction(adminEmail, 'Approve Withdrawal', 'withdrawal', withdrawalId, { amount: wthData.amount, txHash: finalTxHash });
    return true;
  } catch (err) {
    console.error('approveWithdrawal error:', err);
    return false;
  }
}

export async function rejectWithdrawal(withdrawalId: string, adminEmail: string, reason: string): Promise<boolean> {
  try {
    const wthRef = doc(db, WITHDRAWALS_COL, withdrawalId);
    const wthSnap = await getDoc(wthRef);
    if (!wthSnap.exists()) return false;
    const wthData = wthSnap.data() as AdminWithdrawalRecord;

    await updateDoc(wthRef, {
      status: 'Rejected',
      adminActionBy: adminEmail,
      adminActionAt: new Date().toISOString(),
      adminNotes: reason
    });

    // Refund funds back to user wallet if applicable
    if (wthData.userId) {
      const userRef = doc(db, USERS_COL, wthData.userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const u = userSnap.data() as AdminUserRecord;
        const currentBal = Number(u.walletBalanceUSDT) || 0;
        await updateDoc(userRef, {
          walletBalanceUSDT: Number((currentBal + wthData.amount).toFixed(2))
        });
      }
    }

    await logAdminAction(adminEmail, 'Reject Withdrawal', 'withdrawal', withdrawalId, { reason });
    return true;
  } catch (err) {
    console.error('rejectWithdrawal error:', err);
    return false;
  }
}

// ----------------- SUPPORT TICKETS -----------------
export async function getAdminSupportTickets(): Promise<AdminSupportRecord[]> {
  try {
    const snap = await getDocs(collection(db, TICKETS_COL));
    return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as AdminSupportRecord));
  } catch (err) {
    console.error('getAdminSupportTickets error:', err);
    return [];
  }
}

export async function replyAdminTicket(ticketId: string, reply: string, status: AdminSupportRecord['status'], adminEmail: string): Promise<boolean> {
  try {
    const now = new Date().toISOString();
    await updateDoc(doc(db, TICKETS_COL, ticketId), {
      adminReply: reply,
      status: status,
      adminRespondedBy: adminEmail,
      adminRespondedAt: now,
      updatedAt: now
    });
    await logAdminAction(adminEmail, 'Reply Support Ticket', 'support', ticketId, { status, replySnippet: reply.slice(0, 60) });
    return true;
  } catch (err) {
    console.error('replyAdminTicket error:', err);
    return false;
  }
}

// ----------------- SETTINGS -----------------
export async function getPlatformSettings(): Promise<PlatformSettingsRecord> {
  try {
    const snap = await getDoc(doc(db, SETTINGS_COL, 'general'));
    if (snap.exists()) {
      return snap.data() as PlatformSettingsRecord;
    }
    return DEFAULT_SETTINGS;
  } catch (err) {
    console.error('getPlatformSettings error:', err);
    return DEFAULT_SETTINGS;
  }
}

export async function updatePlatformSettings(newSettings: Partial<PlatformSettingsRecord>, adminEmail: string): Promise<boolean> {
  try {
    const updated = {
      ...newSettings,
      updatedAt: new Date().toISOString(),
      updatedBy: adminEmail
    };
    await setDoc(doc(db, SETTINGS_COL, 'general'), updated, { merge: true });
    await logAdminAction(adminEmail, 'Update Platform Settings', 'settings', 'general', newSettings);
    return true;
  } catch (err) {
    console.error('updatePlatformSettings error:', err);
    return false;
  }
}

// ----------------- AUDIT LOGS -----------------
export async function getAdminAuditLogs(maxLogs: number = 50): Promise<AdminAuditRecord[]> {
  try {
    const logsQuery = query(collection(db, LOGS_COL), orderBy('timestamp', 'desc'), limit(maxLogs));
    const snap = await getDocs(logsQuery);
    return snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as AdminAuditRecord));
  } catch (err) {
    // If composite index is pending, fallback to un-ordered query
    try {
      const snap = await getDocs(collection(db, LOGS_COL));
      const logs = snap.docs.map(doc => ({ ...doc.data(), id: doc.id } as AdminAuditRecord));
      return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, maxLogs);
    } catch {
      return [];
    }
  }
}
