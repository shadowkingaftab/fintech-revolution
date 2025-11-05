// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAOFidaYTaipufy-igQ5k-zBLqJ0J_UCio",
  authDomain: "fintech-revolution.firebaseapp.com",
  projectId: "fintech-revolution",
  storageBucket: "fintech-revolution.firebasestorage.app",
  messagingSenderId: "380406848205",
  appId: "1:380406848205:web:72583cea072ac718732784"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});
export const db = getFirestore(app);