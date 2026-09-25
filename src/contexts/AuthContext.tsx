import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut as firebaseSignOut,
  updateProfile as firebaseUpdateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { UserProfile, ProviderProfile, AccountType } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  providerProfile: ProviderProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (name: string, email: string, pass: string, accountType: AccountType) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  updateProviderProfile: (data: Partial<ProviderProfile>) => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [providerProfile, setProviderProfile] = useState<ProviderProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchProfiles = async (user: FirebaseUser) => {
    try {
      // 1. Fetch user doc
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        const uData = userSnap.data() as UserProfile;
        setUserProfile(uData);
      } else {
        // Create initial user doc
        const newProfile: UserProfile = {
          id: user.uid,
          displayName: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email || '',
          photoURL: user.photoURL || undefined,
          country: 'United States',
          city: '',
          accountType: 'both',
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(userRef, newProfile);
        setUserProfile(newProfile);
      }

      // 2. Fetch provider doc if exists
      const provRef = doc(db, 'providerProfiles', user.uid);
      const provSnap = await getDoc(provRef);
      if (provSnap.exists()) {
        setProviderProfile(provSnap.data() as ProviderProfile);
      } else {
        setProviderProfile(null);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchProfiles(user);
      } else {
        setUserProfile(null);
        setProviderProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const refreshProfile = async () => {
    if (currentUser) {
      await fetchProfiles(currentUser);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await fetchProfiles(result.user);
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      throw error;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, pass);
      if (result.user) {
        await fetchProfiles(result.user);
      }
    } catch (error) {
      console.error('Email sign-in error:', error);
      throw error;
    }
  };

  const signUpWithEmail = async (
    name: string,
    email: string,
    pass: string,
    accountType: AccountType
  ) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, pass);
      const user = result.user;
      await firebaseUpdateProfile(user, { displayName: name });

      const newProfile: UserProfile = {
        id: user.uid,
        displayName: name,
        email: email,
        country: 'United States',
        city: '',
        accountType: accountType,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'users', user.uid), newProfile);
      setUserProfile(newProfile);

      if (accountType === 'provider' || accountType === 'both') {
        const newProvider: ProviderProfile = {
          id: user.uid,
          userId: user.uid,
          businessName: name,
          bio: '',
          country: 'United States',
          city: '',
          categories: ['services'],
          email: email,
          showEmail: true,
          showPhone: false,
          isVerified: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };
        await setDoc(doc(db, 'providerProfiles', user.uid), newProvider);
        setProviderProfile(newProvider);
      }
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    setCurrentUser(null);
    setUserProfile(null);
    setProviderProfile(null);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) throw new Error('Not authenticated');
    const path = `users/${currentUser.uid}`;
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        ...data,
        updatedAt: serverTimestamp(),
      });
      setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  };

  const updateProviderProfile = async (data: Partial<ProviderProfile>) => {
    if (!currentUser) throw new Error('Not authenticated');
    const path = `providerProfiles/${currentUser.uid}`;
    try {
      const provRef = doc(db, 'providerProfiles', currentUser.uid);
      const exists = (await getDoc(provRef)).exists();
      if (!exists) {
        const fullProfile: ProviderProfile = {
          id: currentUser.uid,
          userId: currentUser.uid,
          businessName: data.businessName || userProfile?.displayName || 'Provider',
          bio: data.bio || '',
          country: data.country || userProfile?.country || 'United States',
          city: data.city || userProfile?.city || '',
          categories: data.categories || ['services'],
          email: currentUser.email || '',
          showEmail: data.showEmail ?? true,
          showPhone: data.showPhone ?? false,
          isVerified: false,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          ...data,
        };
        await setDoc(provRef, fullProfile);
        setProviderProfile(fullProfile);
      } else {
        await updateDoc(provRef, {
          ...data,
          updatedAt: serverTimestamp(),
        });
        setProviderProfile((prev) => (prev ? { ...prev, ...data } : null));
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const isAdmin =
    currentUser?.email === 'i4925024@gmail.com' ||
    userProfile?.isAdmin === true;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        providerProfile,
        loading,
        isAdmin,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        resetPassword,
        logout,
        updateUserProfile,
        updateProviderProfile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
