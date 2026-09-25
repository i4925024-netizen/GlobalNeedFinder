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
  increment,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { Need, NeedStatus } from '../types';
import { generateSearchKeywords, matchesKeywords } from '../utils/searchUtils';

export interface NeedFilterOptions {
  category?: string;
  country?: string;
  city?: string;
  status?: NeedStatus | 'ALL';
  searchQuery?: string;
  limitCount?: number;
}

export async function createNeed(
  data: Omit<Need, 'id' | 'createdAt' | 'updatedAt' | 'offersCount' | 'searchKeywords'>
): Promise<string> {
  const needsRef = doc(collection(db, 'needs'));
  const id = needsRef.id;

  const searchKeywords = generateSearchKeywords(
    `${data.title} ${data.description} ${data.category} ${data.country} ${data.city}`
  );

  const newNeed: Need = {
    ...data,
    id,
    status: 'OPEN',
    offersCount: 0,
    searchKeywords,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(needsRef, newNeed);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `needs/${id}`);
  }
}

export async function getNeedById(id: string): Promise<Need | null> {
  const path = `needs/${id}`;
  try {
    const snap = await getDoc(doc(db, 'needs', id));
    if (!snap.exists()) return null;
    return snap.data() as Need;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export async function getNeeds(filters: NeedFilterOptions = {}): Promise<Need[]> {
  const path = 'needs';
  try {
    let q = query(collection(db, 'needs'));

    if (filters.status && filters.status !== 'ALL') {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.category && filters.category !== 'all') {
      q = query(q, where('category', '==', filters.category));
    }
    if (filters.country && filters.country !== 'all' && filters.country !== 'GLOBAL') {
      q = query(q, where('country', '==', filters.country));
    }

    q = query(q, orderBy('createdAt', 'desc'), limit(filters.limitCount || 50));

    const snap = await getDocs(q);
    let results: Need[] = snap.docs.map((docSnap) => docSnap.data() as Need);

    // City and text query filtering in-memory
    if (filters.city?.trim()) {
      const cityLower = filters.city.trim().toLowerCase();
      results = results.filter((n) => n.city?.toLowerCase().includes(cityLower));
    }

    if (filters.searchQuery?.trim()) {
      results = results.filter(
        (n) =>
          matchesKeywords(n.title, filters.searchQuery!) ||
          matchesKeywords(n.description, filters.searchQuery!) ||
          matchesKeywords(n.category, filters.searchQuery!) ||
          matchesKeywords(n.city, filters.searchQuery!) ||
          matchesKeywords(n.country, filters.searchQuery!)
      );
    }

    return results;
  } catch (error) {
    // If composite index is not yet built, fallback to client-side sorting/filtering gracefully
    try {
      const fallbackSnap = await getDocs(query(collection(db, 'needs'), limit(60)));
      let allNeeds = fallbackSnap.docs.map((d) => d.data() as Need);

      if (filters.status && filters.status !== 'ALL') {
        allNeeds = allNeeds.filter((n) => n.status === filters.status);
      }
      if (filters.category && filters.category !== 'all') {
        allNeeds = allNeeds.filter((n) => n.category === filters.category);
      }
      if (filters.country && filters.country !== 'all' && filters.country !== 'GLOBAL') {
        allNeeds = allNeeds.filter((n) => n.country === filters.country);
      }
      if (filters.city?.trim()) {
        allNeeds = allNeeds.filter((n) =>
          n.city?.toLowerCase().includes(filters.city!.trim().toLowerCase())
        );
      }
      if (filters.searchQuery?.trim()) {
        allNeeds = allNeeds.filter(
          (n) =>
            matchesKeywords(n.title, filters.searchQuery!) ||
            matchesKeywords(n.description, filters.searchQuery!)
        );
      }
      return allNeeds;
    } catch (fallbackError) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
}

export async function getUserNeeds(userId: string): Promise<Need[]> {
  const path = 'needs';
  try {
    const q = query(
      collection(db, 'needs'),
      where('ownerId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Need);
  } catch (error) {
    // Fallback if index on ownerId+createdAt is pending
    try {
      const qSimple = query(collection(db, 'needs'), where('ownerId', '==', userId));
      const snap = await getDocs(qSimple);
      const list = snap.docs.map((d) => d.data() as Need);
      return list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } catch (fallbackError) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
}

export async function updateNeed(id: string, data: Partial<Need>): Promise<void> {
  const path = `needs/${id}`;
  try {
    const updateData: any = {
      ...data,
      updatedAt: serverTimestamp(),
    };
    if (data.title || data.description || data.country || data.city || data.category) {
      const cur = await getNeedById(id);
      if (cur) {
        updateData.searchKeywords = generateSearchKeywords(
          `${data.title || cur.title} ${data.description || cur.description} ${
            data.category || cur.category
          } ${data.country || cur.country} ${data.city || cur.city}`
        );
      }
    }
    await updateDoc(doc(db, 'needs', id), updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function updateNeedStatus(id: string, status: NeedStatus): Promise<void> {
  const path = `needs/${id}`;
  try {
    await updateDoc(doc(db, 'needs', id), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function deleteNeed(id: string): Promise<void> {
  const path = `needs/${id}`;
  try {
    await deleteDoc(doc(db, 'needs', id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
}

export async function incrementNeedOffersCount(needId: string, countChange: number): Promise<void> {
  const path = `needs/${needId}`;
  try {
    await updateDoc(doc(db, 'needs', needId), {
      offersCount: increment(countChange),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.warn('Could not update offersCount:', error);
  }
}
