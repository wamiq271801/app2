// Firebase Configuration
// Replace these values with your actual Firebase project credentials
// Get these from: Firebase Console > Project Settings > General > Your apps

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDOcuf88aVXFOlAQ8QuzPiwcbFa1kPdKMc",
  authDomain: "android-apikey.firebaseapp.com",
  projectId: "android-apikey",
  storageBucket: "android-apikey.firebasestorage.app",
  messagingSenderId: "1052862681471",
  appId: "1:1052862681471:web:5c36fcab0c43a9505b8a4a",
  measurementId: "G-YP2Q9MSF7S"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
