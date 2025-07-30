// lib/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDxyEm1b0gp7mjpQ__CBB53r8Lv9fFuxIQ",
  authDomain: "anon-message-firebase.firebaseapp.com",
  projectId: "anon-message-firebase",
  storageBucket: "anon-message-firebase.firebasestorage.app",
  messagingSenderId: "788186255205",
  appId: "1:788186255205:web:0f75d80f128caf94e51b8c"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
