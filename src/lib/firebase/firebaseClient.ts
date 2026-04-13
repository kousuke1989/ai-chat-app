import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCfbufaSHgRdXgNOQChLgYNVjgE-X2uOAo",
  authDomain: "ai-chat-app-17f68.firebaseapp.com",
  projectId: "ai-chat-app-17f68",
  storageBucket: "ai-chat-app-17f68.firebasestorage.app",
  messagingSenderId: "353052425114",
  appId: "1:353052425114:web:4934cd20456d743f59d823",
  measurementId: "G-7TJ2HMJV0Q",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
export { auth, db, provider, app };
// const app = initializeApp(firebaseConfig);
