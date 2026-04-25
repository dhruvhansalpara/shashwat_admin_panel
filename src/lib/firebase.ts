import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfigRaw from '../../firebase-applet-config.json';
import { OperationType, FirestoreErrorInfo } from '../types';

// Ensure config is correctly extracted from JSON module
const firebaseConfig = (firebaseConfigRaw as any).default || firebaseConfigRaw;

const app = initializeApp(firebaseConfig);

// Use the explicit database ID from config or fall back to default
const dbId = firebaseConfig.firestoreDatabaseId || '(default)';
export const db = getFirestore(app, dbId);
export const auth = getAuth(app);
// Normalize storage bucket value so both `appspot.com` and `firebasestorage.app` styles work.
const storageBucketRaw = String(firebaseConfig.storageBucket || '').trim();
const normalizedStorageBucket = storageBucketRaw
  ? storageBucketRaw.startsWith('gs://')
    ? storageBucketRaw
    : storageBucketRaw.includes('.firebasestorage.app')
      ? `gs://${storageBucketRaw.replace('.firebasestorage.app', '.appspot.com')}`
      : `gs://${storageBucketRaw}`
  : undefined;

export const storage = getStorage(app, normalizedStorageBucket);

/**
 * Validates connection to Firestore as required by integration guidelines.
 * This is now non-blocking to allow the app to start even if Firebase is unreachable.
 */
async function testConnection() {
  if (!db) return;
  try {
    // Attempt to fetch a dummy document to verify connectivity
    // Using a timeout or just catching errors to prevent app hang
    const promise = getDocFromServer(doc(db, 'test', 'connection'));
    await Promise.race([
      promise,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Firebase timeout')), 5000))
    ]);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('offline') || error.message.includes('timeout')) {
        console.warn("Firestore is operating in offline mode. This is normal if Firebase is not fully configured.");
      } else {
        console.warn("Firebase connection notice:", error.message);
      }
    }
  }
}
testConnection();

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  
  const errorMessage = JSON.stringify(errInfo);
  console.error('Firestore Error: ', errorMessage);
  throw new Error(errorMessage);
}
