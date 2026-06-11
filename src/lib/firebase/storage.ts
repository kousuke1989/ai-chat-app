import { bucket } from "@/lib/firebase/firebaseAdmin";

/**
 * サーバーサイドでデータをStorageに保存し、署名付きURLを返す
 */
export const uploadToStorage = async (
  buffer: Buffer,
  path: string,
  contentType: string,
) => {
  try {
    const file = bucket.file(path);

    await file.save(buffer, {
      metadata: { contentType },
      resumable: false,
    });

    // 署名付きURL（image_analysis と同じパターン）
    const [url] = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2050",
    });

    return url;
  } catch (error) {
    console.error("Storage upload error:", error);
    throw error;
  }
};
