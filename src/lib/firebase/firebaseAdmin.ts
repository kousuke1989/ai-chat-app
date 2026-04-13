// src/lib/firebase/firebaseAdmin.ts
import { initializeApp, getApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import serviceAccount from "./serviceAccountKey.json";

const BUCKET_NAME = "ai-chat-app-17f68.firebasestorage.app";

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount as any),
      storageBucket: BUCKET_NAME,
    })
  : getApp();

export const db = getFirestore(app);
// .bucket() に名前を渡すことで、初期化漏れを防ぎます
export const bucket = getStorage(app).bucket(BUCKET_NAME);
