import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB3OnDboTvEK1iLwlJGy0x0RwOu4F0pga0",
  authDomain: "info-6132-3a292.firebaseapp.com",
  databaseURL: "https://info-6132-3a292-default-rtdb.firebaseio.com",
  projectId: "info-6132-3a292",
  storageBucket: "info-6132-3a292.firebasestorage.app",
  messagingSenderId: "778409130828",
  appId: "1:778409130828:web:334e3b03582da4d139ade9",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
