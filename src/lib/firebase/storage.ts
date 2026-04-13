import { bucket } from "@/lib/firebase/firebaseAdmin";

/**
 * サーバーサイドでデータをStorageに保存し、公開URLを返す
 */
export const uploadToStorage = async (
  buffer: Buffer,
  path: string,
  contentType: string,
) => {
  try {
    const file = bucket.file(path);

    // resumable: false により、フォルダ作成と保存を即時に強制します
    await file.save(buffer, {
      metadata: { contentType },
      resumable: false,
    });

    // 公開URLの生成
    return `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(path)}?alt=media`;
  } catch (error) {
    console.error("Storage upload error:", error);
    throw error;
  }
};
