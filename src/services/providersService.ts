import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  limit,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { ProviderProfile } from '../types';
import { matchesKeywords } from '../utils/searchUtils';

export async function getProviderById(id: string): Promise<ProviderProfile | null> {
  const path = `providerProfiles/${id}`;
  try {
    const snap = await getDoc(doc(db, 'providerProfiles', id));
    if (!snap.exists()) return null;
    return snap.data() as ProviderProfile;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function getProviders(filters: {
  category?: string;
  country?: string;
  city?: string;
  searchQuery?: string;
  limitCount?: number;
} = {}): Promise<ProviderProfile[]> {
  const path = 'providerProfiles';
  try {
    let q = query(collection(db, 'providerProfiles'), limit(filters.limitCount || 50));

    if (filters.country && filters.country !== 'all' && filters.country !== 'GLOBAL') {
      q = query(q, where('country', '==', filters.country));
    }

    const snap = await getDocs(q);
    let results = snap.docs.map((d) => d.data() as ProviderProfile);

    if (filters.category && filters.category !== 'all') {
      results = results.filter((p) => p.categories?.includes(filters.category!));
    }

    if (filters.city?.trim()) {
      results = results.filter((p) =>
        p.city?.toLowerCase().includes(filters.city!.trim().toLowerCase())
      );
    }

    if (filters.searchQuery?.trim()) {
      results = results.filter(
        (p) =>
          matchesKeywords(p.businessName, filters.searchQuery!) ||
          matchesKeywords(p.bio || '', filters.searchQuery!)
      );
    }

    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
