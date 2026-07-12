import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDkC34jfhFxU-sG1iaauXvvh5bSoTpIlH4",
  authDomain: "gen-lang-client-0117467730.firebaseapp.com",
  projectId: "gen-lang-client-0117467730",
  storageBucket: "gen-lang-client-0117467730.firebasestorage.app",
  messagingSenderId: "74229860831",
  appId: "1:74229860831:web:d5e694b288865a1a781c6a"
};

const app = initializeApp(firebaseConfig);

const databaseId = "ai-studio-celostnpekateina-7decc2cd-0d5c-4ed6-99d2-156e3fcdfb97" as string;

export const db = databaseId && databaseId !== '(default)'
  ? getFirestore(app, databaseId)
  : getFirestore(app);
