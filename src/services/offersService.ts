import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { Offer, OfferStatus } from '../types';
import { incrementNeedOffersCount, updateNeedStatus } from './needsService';
import { createNotification } from './notificationsService';

export async function createOffer(
  data: Omit<Offer, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<string> {
  const offersRef = doc(collection(db, 'offers'));
  const id = offersRef.id;

  const newOffer: Offer = {
    ...data,
    id,
    status: 'PENDING',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(offersRef, newOffer);
    await incrementNeedOffersCount(data.needId, 1);

    // Send notification to customer
    await createNotification({
      userId: data.customerId,
      type: 'NEW_OFFER',
      title: 'New Offer Received',
      body: `${data.providerName} submitted an offer of ${data.currency} ${data.proposedPrice} for "${data.needTitle}"`,
      relatedId: data.needId,
      relatedType: 'need',
    });

    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `offers/${id}`);
  }
}

export async function getOffersByNeedId(needId: string): Promise<Offer[]> {
  const path = 'offers';
  try {
    const q = query(
      collection(db, 'offers'),
      where('needId', '==', needId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Offer);
  } catch (error) {
    // Fallback if index on needId + createdAt is pending
    try {
      const qSimple = query(collection(db, 'offers'), where('needId', '==', needId));
      const snap = await getDocs(qSimple);
      const list = snap.docs.map((d) => d.data() as Offer);
      return list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } catch (fallbackErr) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
}

export async function getOffersByProviderId(providerId: string): Promise<Offer[]> {
  const path = 'offers';
  try {
    const q = query(
      collection(db, 'offers'),
      where('providerId', '==', providerId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Offer);
  } catch (error) {
    try {
      const qSimple = query(collection(db, 'offers'), where('providerId', '==', providerId));
      const snap = await getDocs(qSimple);
      const list = snap.docs.map((d) => d.data() as Offer);
      return list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } catch (fallbackErr) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
}

export async function getOffersByCustomerId(customerId: string): Promise<Offer[]> {
  const path = 'offers';
  try {
    const q = query(
      collection(db, 'offers'),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Offer);
  } catch (error) {
    try {
      const qSimple = query(collection(db, 'offers'), where('customerId', '==', customerId));
      const snap = await getDocs(qSimple);
      const list = snap.docs.map((d) => d.data() as Offer);
      return list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    } catch (fallbackErr) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
}

export async function acceptOffer(offer: Offer): Promise<void> {
  const path = `offers/${offer.id}`;
  try {
    await updateDoc(doc(db, 'offers', offer.id), {
      status: 'ACCEPTED',
      updatedAt: serverTimestamp(),
    });

    // Update Need status to IN_PROGRESS
    await updateNeedStatus(offer.needId, 'IN_PROGRESS');

    // Notify Provider
    await createNotification({
      userId: offer.providerId,
      type: 'OFFER_ACCEPTED',
      title: 'Offer Accepted! 🎉',
      body: `Your offer for "${offer.needTitle}" was accepted. Start communication now!`,
      relatedId: offer.needId,
      relatedType: 'need',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function rejectOffer(offer: Offer): Promise<void> {
  const path = `offers/${offer.id}`;
  try {
    await updateDoc(doc(db, 'offers', offer.id), {
      status: 'REJECTED',
      updatedAt: serverTimestamp(),
    });

    // Notify Provider
    await createNotification({
      userId: offer.providerId,
      type: 'OFFER_REJECTED',
      title: 'Offer Update',
      body: `Your offer for "${offer.needTitle}" was not selected.`,
      relatedId: offer.needId,
      relatedType: 'need',
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function withdrawOffer(offer: Offer): Promise<void> {
  const path = `offers/${offer.id}`;
  try {
    await updateDoc(doc(db, 'offers', offer.id), {
      status: 'WITHDRAWN',
      updatedAt: serverTimestamp(),
    });
    await incrementNeedOffersCount(offer.needId, -1);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
