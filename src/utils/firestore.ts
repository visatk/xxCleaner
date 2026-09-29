import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  FieldValue,
  Timestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import { CardBrand } from '../types/card';

// Interface for the parsing history/status we want to save
export interface ParsingHistoryRecord {
  id?: string;
  createdAt: FieldValue | Timestamp;
  totalCards: number;
  valid: number;
  expired: number;
  expiring: number;
  invalid: number;
  luhnFailed: number;
  duplicates: number;
  amex: number;
  brandCounts: Record<CardBrand | 'unknown', number>;
  language: string;
  topBins: Record<string, number>;
  countries: Record<string, number>;
  banks: Record<string, number>;
  levels: Record<string, number>;
}

// Collection reference
const historyCollection = collection(db, 'parsing_history');

/**
 * Save parsing status/history to Firestore (instead of saving individual cards)
 */
export async function saveParsingHistory(stats: Omit<ParsingHistoryRecord, 'id' | 'createdAt'>) {
  try {
    const docRef = await addDoc(historyCollection, {
      ...stats,
      createdAt: serverTimestamp(),
    });
    console.log("History saved with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error saving history: ", e);
    throw e;
  }
}

/**
 * Get recent parsing history
 */
export async function getRecentHistory(maxLimit: number = 10) {
  const q = query(
    historyCollection,
    orderBy("createdAt", "desc"),
    limit(maxLimit)
  );

  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ParsingHistoryRecord[];
}

/**
 * Get all parsing history
 */
export async function getAllHistory() {
  const querySnapshot = await getDocs(historyCollection);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as ParsingHistoryRecord[];
}
