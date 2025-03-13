import { initializeApp } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/10.4.0/firebase-auth.js";

import { getFirestore } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlZYl5QR9-B2NA-KBG9wjAj12TbxaNdYQ",
  authDomain: "logindemo-7f901.firebaseapp.com",
  projectId: "logindemo-7f901",
  storageBucket: "logindemo-7f901.firebasestorage.app",
  messagingSenderId: "705051436506",
  appId: "1:705051436506:web:545f430fa5d1671ddd8ce3",
  measurementId: "G-GEVTCPVTYZ",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export {
  auth,
  createUserWithEmailAndPassword,
  db,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
};
