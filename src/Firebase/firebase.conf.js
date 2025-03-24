// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, onValue, set, push, remove, get } from "firebase/database";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_GOOGLE_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_PROJECT_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREABSE_PROJECT_ID,
  databaseURL: import.meta.env.VITE_DATABASE_URL,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: "YOUR_CORRECT_SENDER_ID",  // <--- Replace with the correct Sender ID
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log(import.meta.env.VITE_GOOGLE_KEY);

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);
export const vertexAI = getVertexAI(app);
export const geminiModel = getGenerativeModel(vertexAI, { model: "gemini-2.0-flash" });
export const storage = getStorage(app); 