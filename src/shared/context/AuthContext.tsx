/**
 * AuthContext.tsx — authentication state for the entire app.
 *
 * Web flow: Google Sign-In → Firestore role check → isAdmin gate.
 * Android (IS_NATIVE): skips auth entirely, always grants admin access.
 * Roles: 'admin' (full access) | 'pending' (default) | 'blocked'.
 */

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import { IS_NATIVE } from '@/config/auth.config';

export type UserRole = 'admin' | 'pending' | 'blocked';

interface AuthContextValue {
  user: User | null;
  role: UserRole | null;
  isAdmin: boolean;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Android (native): skip auth entirely — always admin, no login screen
    if (IS_NATIVE) {
      setRole('admin');
      setLoading(false);
      return;
    }

    // Web: Firebase Auth with Google Sign-In + Firestore role check
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      setUser(u);

      if (!u) {
        setRole(null);
        setLoading(false);
        return;
      }

      try {
        const userRef = doc(db, 'users', u.uid);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          // First sign-in — create pending user document
          await setDoc(userRef, {
            uid: u.uid,
            email: u.email,
            displayName: u.displayName,
            photoURL: u.photoURL,
            role: 'pending',
            createdAt: new Date(),
            lastLoginAt: new Date(),
          });
          setRole('pending');
        } else {
          // Existing user — update last login, read role
          await updateDoc(userRef, { lastLoginAt: new Date() });
          setRole((userSnap.data().role as UserRole) ?? 'pending');
        }
      } catch (err) {
        console.error('Error fetching user role:', err);
        setRole('pending');
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
    setRole(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAdmin: IS_NATIVE ? true : role === 'admin',
        loading,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
