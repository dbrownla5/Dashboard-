import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

// Test Connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'system', 'connection_test'));
    console.log("Firebase Engine Connected: Ready for operations.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('offline')) {
      console.warn("Firebase is offline. Check net configuration.");
    }
  }
}
testConnection();
