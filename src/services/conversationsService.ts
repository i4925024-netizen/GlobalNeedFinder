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
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { Conversation, Message } from '../types';
import { createNotification } from './notificationsService';

export async function getOrCreateConversation(
  userId1: string,
  userId2: string,
  names: Record<string, string>,
  needId?: string,
  needTitle?: string,
  offerId?: string
): Promise<string> {
  const path = 'conversations';
  try {
    // Generate deterministic ID or query
    const sortedIds = [userId1, userId2].sort();
    const convCustomId = needId
      ? `${sortedIds[0]}_${sortedIds[1]}_${needId}`
      : `${sortedIds[0]}_${sortedIds[1]}`;

    const convRef = doc(db, 'conversations', convCustomId);
    const snap = await getDoc(convRef);

    if (snap.exists()) {
      return convCustomId;
    }

    const newConv: Conversation = {
      id: convCustomId,
      participants: [userId1, userId2],
      participantNames: names,
      needId: needId || undefined,
      needTitle: needTitle || undefined,
      offerId: offerId || undefined,
      lastMessageText: 'Conversation started',
      lastMessageSenderId: userId1,
      lastMessageTimestamp: serverTimestamp(),
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    await setDoc(convRef, newConv);
    return convCustomId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToUserConversations(
  userId: string,
  onUpdate: (conversations: Conversation[]) => void
): () => void {
  const path = 'conversations';
  try {
    const q = query(
      collection(db, 'conversations'),
      where('participants', 'array-contains', userId)
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const list = snapshot.docs.map((d) => d.data() as Conversation);
        list.sort((a, b) => (b.updatedAt?.seconds || 0) - (a.updatedAt?.seconds || 0));
        onUpdate(list);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export function subscribeToMessages(
  conversationId: string,
  onUpdate: (messages: Message[]) => void
): () => void {
  const path = `conversations/${conversationId}/messages`;
  try {
    const q = query(
      collection(db, 'conversations', conversationId, 'messages'),
      orderBy('createdAt', 'asc')
    );

    return onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((d) => d.data() as Message);
        onUpdate(msgs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, path);
      }
    );
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

export async function sendMessage(
  conversationId: string,
  senderId: string,
  senderName: string,
  text: string,
  recipientId: string
): Promise<void> {
  const path = `conversations/${conversationId}/messages`;
  try {
    const msgRef = doc(collection(db, 'conversations', conversationId, 'messages'));
    const newMsg: Message = {
      id: msgRef.id,
      conversationId,
      senderId,
      senderName,
      text: text.trim(),
      read: false,
      createdAt: serverTimestamp(),
    };

    await setDoc(msgRef, newMsg);

    // Update conversation snippet
    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessageText: text.trim(),
      lastMessageSenderId: senderId,
      lastMessageTimestamp: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    // Notify recipient
    if (recipientId && recipientId !== senderId) {
      await createNotification({
        userId: recipientId,
        type: 'NEW_MESSAGE',
        title: `Message from ${senderName}`,
        body: text.length > 80 ? text.substring(0, 80) + '...' : text,
        relatedId: conversationId,
        relatedType: 'conversation',
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}
