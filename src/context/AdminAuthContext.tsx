import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  auth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  signOut, 
  verifyAdminStatus, 
  hasRegisteredAdmins,
  setupFirstAdminAccount,
  logAdminAction,
  FirebaseUser 
} from '../lib/firebase';
import { AdminProfile } from '../types/admin';

interface AdminAuthContextType {
  admin: AdminProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  needsInitialSetup: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  createFirstAdmin: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  refreshAdminStatus: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export const AdminAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<AdminProfile | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [needsInitialSetup, setNeedsInitialSetup] = useState<boolean>(false);

  const checkInitialAdminState = async () => {
    try {
      const hasAdmins = await hasRegisteredAdmins();
      setNeedsInitialSetup(!hasAdmins);
    } catch {
      setNeedsInitialSetup(false);
    }
  };

  const verifyAndSetAdmin = async (user: FirebaseUser | null) => {
    setLoading(true);
    if (!user) {
      setAdmin(null);
      setFirebaseUser(null);
      await checkInitialAdminState();
      setLoading(false);
      return;
    }

    try {
      const isAuthorized = await verifyAdminStatus(user.uid);
      if (isAuthorized) {
        setAdmin({
          uid: user.uid,
          email: user.email || '',
          name: user.displayName || user.email?.split('@')[0] || 'Administrator',
          role: 'admin',
          createdAt: user.metadata.creationTime || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
        setFirebaseUser(user);
        setNeedsInitialSetup(false);
      } else {
        // Logged into Firebase Auth, but not an admin in Firestore
        console.warn(`User ${user.email} is not authorized for Admin Console.`);
        await signOut(auth);
        setAdmin(null);
        setFirebaseUser(null);
        await checkInitialAdminState();
      }
    } catch (err) {
      console.error('Error verifying admin permissions:', err);
      setAdmin(null);
      setFirebaseUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      await verifyAndSetAdmin(user);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), pass);
      const user = userCredential.user;

      const isAuthorized = await verifyAdminStatus(user.uid);
      if (!isAuthorized) {
        await signOut(auth);
        setLoading(false);
        return { 
          success: false, 
          error: 'Access Denied: This account does not have administrative privileges. Contact your supervisor.' 
        };
      }

      setAdmin({
        uid: user.uid,
        email: user.email || '',
        name: user.displayName || user.email?.split('@')[0] || 'Administrator',
        role: 'admin',
        createdAt: user.metadata.creationTime || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setFirebaseUser(user);
      setNeedsInitialSetup(false);

      await logAdminAction(user.email || 'unknown', 'Admin Login', 'auth', user.uid);
      return { success: true };
    } catch (err: any) {
      let message = 'Failed to authenticate admin.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        message = 'Invalid email or password. Please re-check your credentials.';
      } else if (err.code === 'auth/too-many-requests') {
        message = 'Too many failed login attempts. Please wait a few moments and try again.';
      } else if (err.message) {
        message = err.message;
      }
      return { success: false, error: message };
    } finally {
      setLoading(false);
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
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const createFirstAdmin = async (email: string, pass: string, name: string) => {
    setLoading(true);
    const result = await setupFirstAdminAccount(email.trim(), pass, name.trim());
    if (result.success) {
      setNeedsInitialSetup(false);
      // Auto login
      await login(email.trim(), pass);
    }
    setLoading(false);
    return result;
  };

  const refreshAdminStatus = async () => {
    if (firebaseUser) {
      await verifyAndSetAdmin(firebaseUser);
    } else {
      await checkInitialAdminState();
    }
  };

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        firebaseUser,
        loading,
        needsInitialSetup,
        login,
        logout,
        createFirstAdmin,
        refreshAdminStatus
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
