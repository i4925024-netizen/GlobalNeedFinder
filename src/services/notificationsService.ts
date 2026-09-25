import {
  collection,
  doc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { AppNotification } from '../types';

export async function createNotification(
  data: Omit<AppNotification, 'id' | 'createdAt' | 'read'>
): Promise<string> {
  const notifRef = doc(collection(db, 'notifications'));
  const id = notifRef.id;

  const notif: AppNotification = {
    ...data,
    id,
    read: false,
    createdAt: serverTimestamp(),
  };

  try {
    await setDoc(notifRef, notif);
    return id;
  } catch (error) {
    // Best-effort notification creation; do not crash caller if notification fails
    console.warn('Notification create error:', error);
    return id;
  }
}

export function subscribeToUserNotifications(
  userId: string,
  onUpdate: (notifications: AppNotification[]) => void
): () => void {
  const path = 'notifications';
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const notifs = snapshot.docs.map((docSnap) => docSnap.data() as AppNotification);
        onUpdate(notifs);
      },
      (error) => {
        // Fallback simple query
        const qSimple = query(collection(db, 'notifications'), where('userId', '==', userId));
        onSnapshot(qSimple, (snap) => {
          const list = snap.docs.map((d) => d.data() as AppNotification);
          onUpdate(list.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)));
        });
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function markNotificationRead(id: string): Promise<void> {
  const path = `notifications/${id}`;
  try {
    await updateDoc(doc(db, 'notifications', id), {
      read: true,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}

export async function markAllNotificationsRead(userId: string): Promise<void> {
  const path = 'notifications';
  try {
    const q = query(
      collection(db, 'notifications'),
      where('userId', '==', userId),
      where('read', '==', false)
    );
    const snap = await getDocs(q);
    const batch = writeBatch(db);
    snap.docs.forEach((d) => {
      batch.update(d.ref, { read: true });
    });
    await batch.commit();
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
