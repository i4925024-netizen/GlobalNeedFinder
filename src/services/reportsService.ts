import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase/config';
import { handleFirestoreError, OperationType } from '../firebase/errors';
import { Report, ReportStatus } from '../types';

export async function submitReport(
  data: Omit<Report, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): Promise<string> {
  const reportRef = doc(collection(db, 'reports'));
  const id = reportRef.id;

  const report: Report = {
    ...data,
    id,
    status: 'OPEN',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  try {
    await setDoc(reportRef, report);
    return id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `reports/${id}`);
  }
}

export async function getAllReports(): Promise<Report[]> {
  const path = 'reports';
  try {
    const q = query(collection(db, 'reports'), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as Report);
  } catch (error) {
    try {
      const snap = await getDocs(collection(db, 'reports'));
      return snap.docs.map((d) => d.data() as Report);
    } catch (fallback) {
      handleFirestoreError(error, OperationType.LIST, path);
    }
  }
}

export async function updateReportStatus(reportId: string, status: ReportStatus): Promise<void> {
  const path = `reports/${reportId}`;
  try {
    await updateDoc(doc(db, 'reports', reportId), {
      status,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
  }
}
