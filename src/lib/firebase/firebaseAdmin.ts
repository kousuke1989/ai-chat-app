import { initializeApp, getApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

// ファイルからのインポートを削除し、環境変数から読み込むように変更
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

// 環境変数が正しく設定されているかチェック
if (!serviceAccountKey) {
  throw new Error(
    "FIREBASE_SERVICE_ACCOUNT_KEY is not defined in environment variables",
  );
}

// 文字列として入っているJSONをオブジェクトに変換
const serviceAccount = JSON.parse(serviceAccountKey);

const BUCKET_NAME = "ai-chat-app-17f68.firebasestorage.app";

const app = !getApps().length
  ? initializeApp({
      credential: cert(serviceAccount),
      storageBucket: BUCKET_NAME,
    })
  : getApp();

export const db = getFirestore(app);
export const bucket = getStorage(app).bucket(BUCKET_NAME);
