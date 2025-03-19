// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getDatabase, ref, onValue, set, push, remove, get } from "firebase/database";
import { getVertexAI, getGenerativeModel } from "firebase/vertexai";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDaszx_UDm9whSiLr-wrN-PbNsu6-C1GW4",
  authDomain: "portfolio-70566.firebaseapp.com",
  projectId: "portfolio-70566",
  databaseURL: "https://portfolio-70566-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "portfolio-70566.firebasestorage.app",
  messagingSenderId: "YOUR_CORRECT_SENDER_ID",  // <--- Replace with the correct Sender ID
  appId: "1:439313410628:web:2e283375fd52d38461aa11",
  measurementId: "G-XMN8G6130R"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const database = getDatabase(app);
export const provider = new GoogleAuthProvider();
export const db = getDatabase(app);
export const vertexAI = getVertexAI(app);
export const geminiModel = getGenerativeModel(vertexAI, { model: "gemini-2.0-flash" });