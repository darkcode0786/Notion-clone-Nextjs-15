
import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDitVZkVcifqLr4GK-dst4pmnLXX6NvgU0",
  authDomain: "notion-clone-b25d7.firebaseapp.com",
  projectId: "notion-clone-b25d7",
  storageBucket: "notion-clone-b25d7.firebasestorage.app",
  messagingSenderId: "279797141465",
  appId: "1:279797141465:web:0db1ed5baf5168741c13c8",
  measurementId: "G-7S01L9XCDN"
};


const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);

export { db };