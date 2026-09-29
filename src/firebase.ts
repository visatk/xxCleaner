import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCYTaQ14pkILfZtJ8MbEe7iWtLojcKQzOk",
  authDomain: "xxcleaner.firebaseapp.com",
  projectId: "xxcleaner",
  storageBucket: "xxcleaner.firebasestorage.app",
  messagingSenderId: "532692251802",
  appId: "1:532692251802:web:ddc8bd08287e028d78db23",
  measurementId: "G-J7FB7ZL2MB"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
export const db = getFirestore(app);
