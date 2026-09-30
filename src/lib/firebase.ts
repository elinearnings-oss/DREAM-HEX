import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
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

// Initialize Firestore with specific database ID if configured
export const db = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

export { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
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
 * Checks whether a given Firebase UID is registered as an Admin
 * First checks `admins/{uid}`, then `users/{uid}.role === 'admin'`
 */
export async function verifyAdminStatus(uid: string): Promise<boolean> {
  try {
    const adminDocRef = doc(db, 'admins', uid);
    const adminDoc = await getDoc(adminDocRef);
    if (adminDoc.exists()) {
      return true;
    }

    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists() && userDoc.data()?.role === 'admin') {
      return true;
    }

    return false;
  } catch (err) {
    console.error('Error verifying admin authorization:', err);
    return false;
  }
}

/**
 * Check if the admin collection has any registered admins.
 * If 0 admins exist, the system permits the Initial Admin Bootstrap wizard.
 */
export async function hasRegisteredAdmins(): Promise<boolean> {
  try {
    const adminsSnapshot = await getDocs(collection(db, 'admins'));
    if (!adminsSnapshot.empty) return true;

    const usersQuery = query(collection(db, 'users'), where('role', '==', 'admin'), limit(1));
    const usersSnapshot = await getDocs(usersQuery);
    return !usersSnapshot.empty;
  } catch (err) {
    console.warn('Could not query admin collection:', err);
    return false;
  }
}

/**
 * Creates the initial master Admin account in Firebase Auth + Firestore
 */
export async function setupFirstAdminAccount(email: string, password: string, displayName: string): Promise<{ success: boolean; error?: string }> {
  try {
    const alreadyHasAdmins = await hasRegisteredAdmins();
    if (alreadyHasAdmins) {
      return { success: false, error: 'An admin account is already registered. Please log in with your existing admin credentials.' };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const adminData = {
      uid,
      email,
      name: displayName || 'Master Administrator',
      role: 'admin',
      isMasterAdmin: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Store in both admins and users collections for high reliability
    await setDoc(doc(db, 'admins', uid), adminData);
    await setDoc(doc(db, 'users', uid), {
      ...adminData,
      accountStatus: 'Active',
      isAgeVerified: true,
      kycStatus: 'Verified',
      referralCode: 'VEL-ADMIN'
    });

    // Record audit log
    await addDoc(collection(db, 'admin_audit_logs'), {
      adminEmail: email,
      action: 'Initial Admin Account Setup',
      targetType: 'admin',
      targetId: uid,
      timestamp: new Date().toISOString(),
      details: { email, name: displayName }
    });

    return { success: true };
  } catch (err: any) {
    console.error('Failed to create first admin account:', err);
    return { success: false, error: err?.message || 'Failed to create initial admin account' };
  }
}

/**
 * Audit log helper
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
