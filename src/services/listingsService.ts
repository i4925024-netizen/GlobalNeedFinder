import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { Listing } from '../types';
import { generateSearchKeywords, matchesKeywords } from '../utils/searchUtils';

export interface ListingFilterOptions {
  category?: string;
  country?: string;
  city?: string;
  searchQuery?: string;
  activeOnly?: boolean;
  limitCount?: number;
}

export async function createListing(
  data: Omit<Listing, 'id' | 'createdAt' | 'updatedAt' | 'searchKeywords'>
): Promise<string> {
  const listingRef = doc(collection(db, 'listings'));
  const id = listingRef.id;

  const searchKeywords = generateSearchKeywords(
    `${data.title} ${data.description} ${data.category} ${data.country} ${data.city} ${data.providerName}`
  );

  const newListing: Listing = {
    ...data,
    id,
    searchKeywords,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(listingRef, newListing);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `listings/${id}`);
  }
}

export async function getListingById(id: string): Promise<Listing | null> {
  const path = `listings/${id}`;
  try {
    const snap = await getDoc(doc(db, 'listings', id));
    if (!snap.exists()) return null;
    return snap.data() as Listing;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function getListings(filters: ListingFilterOptions = {}): Promise<Listing[]> {
  const path = 'listings';
  try {
    let q = query(collection(db, 'listings'));

    if (filters.activeOnly !== false) {
      q = query(q, where('active', '==', true));
    }
    if (filters.category && filters.category !== 'all') {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.country && filters.country !== 'all' && filters.country !== 'GLOBAL') {
      q = query(q, where('country', '==', filters.country));
    }

    q = query(q, orderBy('createdAt', 'desc'), limit(filters.limitCount || 50));

    const snap = await getDocs(q);
    let results = snap.docs.map((d) => d.data() as Listing);

    if (filters.city?.trim()) {
      const cityLower = filters.city.trim().toLowerCase();
      results = results.filter((l) => l.city?.toLowerCase().includes(cityLower));
    }

    if (filters.searchQuery?.trim()) {
      results = results.filter(
        (l) =>
          matchesKeywords(l.title, filters.searchQuery!) ||
          matchesKeywords(l.description, filters.searchQuery!) ||
          matchesKeywords(l.providerName, filters.searchQuery!)
      );
    }

    return results;
  } catch (error) {
    try {
      const fallbackSnap = await getDocs(query(collection(db, 'listings'), limit(60)));
      let all = fallbackSnap.docs.map((d) => d.data() as Listing);
      if (filters.activeOnly !== false) {
        all = all.filter((l) => l.active);
      }
      if (filters.category && filters.category !== 'all') {
        all = all.filter((l) => l.category === filters.category);
      }
      if (filters.country && filters.country !== 'all' && filters.country !== 'GLOBAL') {
        all = all.filter((l) => l.country === filters.country);
      }
      if (filters.city?.trim()) {
        all = all.filter((l) =>
          l.city?.toLowerCase().includes(filters.city!.trim().toLowerCase())
        );
      }
      if (filters.searchQuery?.trim()) {
        all = all.filter((l) => matchesKeywords(l.title, filters.searchQuery!));
      }
      return all;
    } catch (fallbackErr) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
}

export async function getProviderListings(providerId: string): Promise<Listing[]> {
  const path = 'listings';
  try {
    const q = query(
      collection(db, 'listings'),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Listing);
  } catch (error) {
    try {
      const qSimple = query(collection(db, 'listings'), where('providerId', '==', providerId));
      const snap = await getDocs(qSimple);
      const list = snap.docs.map((d) => d.data() as Listing);
      return list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } catch (fallbackErr) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
}

export async function updateListing(id: string, data: Partial<Listing>): Promise<void> {
  const path = `listings/${id}`;
  try {
    await updateDoc(doc(db, 'listings', id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteListing(id: string): Promise<void> {
  const path = `listings/${id}`;
  try {
    await deleteDoc(doc(db, 'listings', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}
