import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  getFirestore, 
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
  serverTimestamp,
  Timestamp 
} from 'firebase/firestore';
import rawConfig from '../../firebase-applet-config.json';
import { AdminProfile } from '../types/admin';

// Support both static config file and environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || rawConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || rawConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || rawConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || rawConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || rawConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || rawConfig.appId,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || rawConfig.firestoreDatabaseId,
};

// Initialize Firebase App singleton
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore with specific database ID if configured
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  signInWithPopup,
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
  serverTimestamp,
  Timestamp 
};

export type { FirebaseUser };

/**
 * Format any Firebase Auth or Firestore error into actionable user feedback
 */
export function formatAuthError(err: any): { message: string; isEmailPasswordDisabled?: boolean; isUnauthorizedDomain?: boolean } {
  if (!err) return { message: 'An unknown error occurred.' };

  const code = err.code || '';
  const rawMsg = err.message || '';

  if (code === 'auth/operation-not-allowed' || rawMsg.includes('operation-not-allowed') || code === 'auth/admin-restricted-operation') {
    return {
      message: 'Email/Password sign-in is not enabled for Firebase project "cobalt-heading-d14dk". Please use "Continue with Google" (which is active) or enable the Email/Password provider in Firebase Console under Authentication > Sign-in method.',
      isEmailPasswordDisabled: true
    };
  }
  if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
    return { message: 'Invalid credentials. Please verify your email and password or sign in with Google.' };
  }
  if (code === 'auth/email-already-in-use') {
    return { message: 'An account with this email already exists. Please log in or use Google sign-in.' };
  }
  if (code === 'auth/weak-password') {
    return { message: 'Password is too weak. Please use at least 8 characters including letters and numbers.' };
  }
  if (code === 'auth/popup-closed-by-user') {
    return { message: 'Google sign-in popup was closed before completion. Please try again.' };
  }
  if (code === 'auth/popup-blocked') {
    return { message: 'Google sign-in popup was blocked by your browser. Please allow popups for this site and try again.' };
  }
  if (code === 'auth/too-many-requests') {
    return { message: 'Too many unsuccessful attempts. Access temporarily paused; please wait 2 minutes.' };
  }
  if (code === 'auth/network-request-failed') {
    return { message: 'Network connection issue connecting to Firebase. Check your internet connection.' };
  }
  if (code === 'auth/unauthorized-domain' || rawMsg.includes('unauthorized-domain')) {
    const currentDomain = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
    return {
      message: `Domain "${currentDomain}" is not in Firebase Authorized Domains list. Please add "${currentDomain}" in Firebase Console → Authentication → Settings tab → Authorized domains, or use the Master Key access below.`,
      isUnauthorizedDomain: true
    };
  }
  if (code === 'permission-denied' || rawMsg.includes('permission-denied') || rawMsg.includes('insufficient permissions')) {
    return { message: 'Firestore security rules rejected the request: Missing administrative role in database.' };
  }

  return { message: rawMsg || 'An error occurred during authentication.' };
}

/**
 * Check whether the Master Administrator lock document exists in Firestore
 */
export async function checkMasterLockStatus(): Promise<{ isLocked: boolean; masterUid?: string; masterEmail?: string }> {
  try {
    const lockRef = doc(db, 'admins', '_master_lock');
    const lockSnap = await getDoc(lockRef);
    if (lockSnap.exists()) {
      const data = lockSnap.data();
      return { isLocked: true, masterUid: data.masterUid, masterEmail: data.masterEmail };
    }
    return { isLocked: false };
  } catch (err) {
    console.warn('Could not read _master_lock (may be unauthenticated or rules restriction):', err);
    // If permission denied or other error, assume not locked so caller handles appropriately
    return { isLocked: false };
  }
}

/**
 * Checks whether a given Firebase UID is registered as an Admin/Manager/Master Admin in Firestore
 */
export async function verifyAdminStatus(uid: string): Promise<{ isAuthorized: boolean; profile?: AdminProfile }> {
  try {
    const adminDocRef = doc(db, 'admins', uid);
    const adminDoc = await getDoc(adminDocRef);
    if (adminDoc.exists()) {
      const data = adminDoc.data();
      const role = data.role;
      if (role === 'master_admin' || role === 'admin' || role === 'manager') {
        return {
          isAuthorized: true,
          profile: {
            uid,
            email: data.email || '',
            name: data.name || 'Administrator',
            role: role,
            isMasterAdmin: role === 'master_admin' || data.isMasterAdmin === true,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString()
          }
        };
      }
    }

    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
      const uData = userDoc.data();
      const role = uData.role;
      if (role === 'master_admin' || role === 'admin' || role === 'manager') {
        return {
          isAuthorized: true,
          profile: {
            uid,
            email: uData.email || '',
            name: uData.name || 'Administrator',
            role: role,
            isMasterAdmin: role === 'master_admin',
            createdAt: uData.registeredAt || new Date().toISOString(),
            updatedAt: uData.updatedAt || new Date().toISOString()
          }
        };
      }
    }

    return { isAuthorized: false };
  } catch (err) {
    console.error('Error verifying admin authorization:', err);
    return { isAuthorized: false };
  }
}

/**
 * Establish the Master Admin role for an authenticated Firebase user.
 * Writes to Firestore: `admins/{uid}`, `admins/_master_lock`, and `users/{uid}`.
 */
export async function establishMasterAdmin(user: FirebaseUser, displayName?: string): Promise<{ success: boolean; profile?: AdminProfile; error?: string }> {
  try {
    const lockStatus = await checkMasterLockStatus();
    if (lockStatus.isLocked && lockStatus.masterUid && lockStatus.masterUid !== user.uid) {
      return { 
        success: false, 
        error: `A Master Administrator is already established (${lockStatus.masterEmail || 'authorized account'}). Please sign in with the authorized account.` 
      };
    }

    const now = new Date().toISOString();
    const resolvedName = displayName?.trim() || user.displayName || user.email?.split('@')[0] || 'Master Administrator';

    const adminProfile: AdminProfile = {
      uid: user.uid,
      email: user.email || '',
      name: resolvedName,
      role: 'master_admin',
      isMasterAdmin: true,
      createdAt: now,
      updatedAt: now
    };

    // 1. Write the user's admin document in `admins/{uid}`
    await setDoc(doc(db, 'admins', user.uid), adminProfile);

    // 2. Write the master lock document in `admins/_master_lock`
    await setDoc(doc(db, 'admins', '_master_lock'), {
      masterUid: user.uid,
      masterEmail: user.email || '',
      establishedAt: now
    });

    // 3. Write/Update `users/{uid}`
    await setDoc(doc(db, 'users', user.uid), {
      id: user.uid,
      uid: user.uid,
      email: user.email || '',
      name: resolvedName,
      role: 'master_admin',
      accountStatus: 'Active',
      isAgeVerified: true,
      kycStatus: 'Verified',
      referralCode: 'VEL-MASTER',
      walletBalanceUSDT: 100.00,
      totalOrdersCount: 0,
      totalDepositAmount: 0,
      totalWithdrawalAmount: 0,
      registeredAt: now,
      updatedAt: now
    }, { merge: true });

    // 4. Log audit record safely
    try {
      await addDoc(collection(db, 'admin_audit_logs'), {
        adminEmail: user.email || 'unknown',
        action: 'Master Administrator Established',
        targetType: 'admin',
        targetId: user.uid,
        details: { email: user.email, name: resolvedName },
        timestamp: now
      });
    } catch {
      // Ignore if audit rule blocks
    }

    return { success: true, profile: adminProfile };
  } catch (err: any) {
    console.error('Failed to establish master admin:', err);
    return { success: false, error: formatAuthError(err).message };
  }
}

/**
 * Log admin action helper
 */
export async function logAdminAction(adminEmail: string, action: string, targetType: string, targetId: string, details?: any) {
  try {
    await addDoc(collection(db, 'admin_audit_logs'), {
      adminEmail,
      action,
      targetType,
      targetId,
      details: details || {},
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.warn('Audit logging failed:', err);
  }
}
