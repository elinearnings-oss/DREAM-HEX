import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  googleProvider,
  signOut, 
  verifyAdminStatus, 
  checkMasterLockStatus,
  establishMasterAdmin,
  formatAuthError,
  logAdminAction,
  FirebaseUser 
} from '../lib/firebase';
import { AdminProfile } from '../types/admin';

interface AdminAuthContextType {
  admin: AdminProfile | null;
  firebaseUser: FirebaseUser | null;
  isInitializing: boolean;
  isMasterLockPresent: boolean;
  isEligibleForMasterSetup: boolean;
  unauthorizedUser: FirebaseUser | null;
  authError: string | null;
  isEmailPasswordDisabled: boolean;
  
  // Actions
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  loginWithEmail: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerMasterAdminWithEmail: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  claimMasterAdmin: (name?: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  clearError: () => void;
  checkLockStatus: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [unauthorizedUser, setUnauthorizedUser] = useState<FirebaseUser | null>(null);
  const [isInitializing, setIsInitializing] = useState<boolean>(true);
  const [isMasterLockPresent, setIsMasterLockPresent] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isEmailPasswordDisabled, setIsEmailPasswordDisabled] = useState<boolean>(false);

  const checkLock = async () => {
    try {
      const lockRes = await checkMasterLockStatus();
      setIsMasterLockPresent(lockRes.isLocked);
    } catch {
      setIsMasterLockPresent(false);
    }
  };

  const verifyUserSession = async (user: FirebaseUser | null) => {
    if (!user) {
      setAdmin(null);
      setFirebaseUser(null);
      setUnauthorizedUser(null);
      await checkLock();
      setIsInitializing(false);
      return;
    }

    setFirebaseUser(user);

    try {
      // 1. Check if user is an existing authorized Admin/Manager/Master Admin in Firestore
      const authRes = await verifyAdminStatus(user.uid);
      if (authRes.isAuthorized && authRes.profile) {
        setAdmin(authRes.profile);
        setUnauthorizedUser(null);
        setIsMasterLockPresent(true);
      } else {
        // 2. Not currently an admin. Check if system has a master lock yet.
        const lockRes = await checkMasterLockStatus();
        setIsMasterLockPresent(lockRes.isLocked);

        if (!lockRes.isLocked) {
          // No master admin exists yet! This authenticated user can claim Master Admin!
          setAdmin(null);
          setUnauthorizedUser(null);
        } else {
          // Master admin already exists, and this user is NOT an admin
          setAdmin(null);
          setUnauthorizedUser(user);
        }
      }
    } catch (err: any) {
      console.error('Session verification error:', err);
      const formatted = formatAuthError(err);
      setAuthError(formatted.message);
      setAdmin(null);
    } finally {
      setIsInitializing(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      await verifyUserSession(user);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setIsEmailPasswordDisabled(false);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      await verifyUserSession(user);
      return { success: true };
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setAuthError(formatted.message);
      return { success: false, error: formatted.message };
    }
  };

  const loginWithEmail = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setIsEmailPasswordDisabled(false);
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = result.user;
      await verifyUserSession(user);
      return { success: true };
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setAuthError(formatted.message);
      if (formatted.isEmailPasswordDisabled) {
        setIsEmailPasswordDisabled(true);
      }
      return { success: false, error: formatted.message };
    }
  };

  const registerMasterAdminWithEmail = async (email: string, pass: string, name: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    setIsEmailPasswordDisabled(false);
    try {
      // 1. Create account in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      const user = userCredential.user;

      // 2. Establish Master Admin in Firestore
      const establishRes = await establishMasterAdmin(user, name);
      if (!establishRes.success) {
        setAuthError(establishRes.error || 'Failed to establish master admin in database.');
        return { success: false, error: establishRes.error };
      }

      await verifyUserSession(user);
      return { success: true };
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setAuthError(formatted.message);
      if (formatted.isEmailPasswordDisabled) {
        setIsEmailPasswordDisabled(true);
      }
      return { success: false, error: formatted.message };
    }
  };

  const claimMasterAdmin = async (name?: string): Promise<{ success: boolean; error?: string }> => {
    setAuthError(null);
    if (!firebaseUser) {
      return { success: false, error: 'You must authenticate before establishing the Master Administrator.' };
    }

    try {
      const res = await establishMasterAdmin(firebaseUser, name);
      if (!res.success) {
        setAuthError(res.error || 'Failed to establish master admin.');
        return { success: false, error: res.error };
      }

      await verifyUserSession(firebaseUser);
      return { success: true };
    } catch (err: any) {
      const formatted = formatAuthError(err);
      setAuthError(formatted.message);
      return { success: false, error: formatted.message };
    }
  };

  const logout = async () => {
    try {
      if (admin?.email) {
        await logAdminAction(admin.email, 'Admin Logout', 'auth', admin.uid);
      }
      await signOut(auth);
      setAdmin(null);
      setFirebaseUser(null);
      setUnauthorizedUser(null);
      setAuthError(null);
      setIsEmailPasswordDisabled(false);
      await checkLock();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const clearError = () => {
    setAuthError(null);
    setIsEmailPasswordDisabled(false);
  };

  const isEligibleForMasterSetup = Boolean(firebaseUser && !admin && !isMasterLockPresent);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        firebaseUser,
        isInitializing,
        isMasterLockPresent,
        isEligibleForMasterSetup,
        unauthorizedUser,
        authError,
        isEmailPasswordDisabled,
        loginWithGoogle,
        loginWithEmail,
        registerMasterAdminWithEmail,
        claimMasterAdmin,
        logout,
        clearError,
        checkLockStatus: checkLock
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return ctx;
};
