import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { Need, Listing, SavedNeed, SavedListing } from '../types';

export async function saveNeed(userId: string, need: Need): Promise<void> {
  const id = `${userId}_${need.id}`;
  const path = `savedNeeds/${id}`;
  try {
    const record: SavedNeed = {
      id,
      userId,
      needId: need.id,
      needTitle: need.title,
      category: need.category,
      country: need.country,
      city: need.city,
      budgetMax: need.budgetMax,
      currency: need.currency,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'savedNeeds', id), record);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function unsaveNeed(userId: string, needId: string): Promise<void> {
  const id = `${userId}_${needId}`;
  const path = `savedNeeds/${id}`;
  try {
    await deleteDoc(doc(db, 'savedNeeds', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function isNeedSaved(userId: string, needId: string): Promise<boolean> {
  const id = `${userId}_${needId}`;
  try {
    const snap = await getDoc(doc(db, 'savedNeeds', id));
    return snap.exists();
  } catch (error) {
    return false;
  }
}

export async function getUserSavedNeeds(userId: string): Promise<SavedNeed[]> {
  const path = 'savedNeeds';
  try {
    const q = query(
      collection(db, 'savedNeeds'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as SavedNeed);
  } catch (error) {
    try {
      const qSimple = query(collection(db, 'savedNeeds'), where('userId', '==', userId));
      const snap = await getDocs(qSimple);
      return snap.docs.map((d) => d.data() as SavedNeed);
    } catch (fallback) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
}

export async function saveListing(userId: string, listing: Listing): Promise<void> {
  const id = `${userId}_${listing.id}`;
  const path = `savedListings/${id}`;
  try {
    const record: SavedListing = {
      id,
      userId,
      listingId: listing.id,
      listingTitle: listing.title,
      category: listing.category,
      country: listing.country,
      city: listing.city,
      price: listing.price,
      currency: listing.currency,
      createdAt: serverTimestamp(),
    };
    await setDoc(doc(db, 'savedListings', id), record);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function unsaveListing(userId: string, listingId: string): Promise<void> {
  const id = `${userId}_${listingId}`;
  const path = `savedListings/${id}`;
  try {
    await deleteDoc(doc(db, 'savedListings', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function isListingSaved(userId: string, listingId: string): Promise<boolean> {
  const id = `${userId}_${listingId}`;
  try {
    const snap = await getDoc(doc(db, 'savedListings', id));
    return snap.exists();
  } catch (error) {
    return false;
  }
}

export async function getUserSavedListings(userId: string): Promise<SavedListing[]> {
  const path = 'savedListings';
  try {
    const q = query(
      collection(db, 'savedListings'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as SavedListing);
  } catch (error) {
    try {
      const qSimple = query(collection(db, 'savedListings'), where('userId', '==', userId));
      const snap = await getDocs(qSimple);
      return snap.docs.map((d) => d.data() as SavedListing);
    } catch (fallback) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
}
