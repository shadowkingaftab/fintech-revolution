// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// YOUR CONFIG FROM FIREBASE (YOU ALREADY HAVE THIS)
const firebaseConfig = {
  apiKey: "AIzaSyAOFidaYTaipufy-igQ5k-zBLqJ0J_UCio",
  authDomain: "fintech-revolution.firebaseapp.com",
  projectId: "fintech-revolution",
  storageBucket: "fintech-revolution.firebasestorage.app",
  messagingSenderId: "380406848205",
  appId: "1:380406848205:web:72583cea072ac718732784"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// EXPORT THESE — THIS IS WHAT WAS MISSING
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);