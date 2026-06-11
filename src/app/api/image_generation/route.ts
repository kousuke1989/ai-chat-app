import { db } from "@/lib/firebase/firebaseAdmin";
import { uploadToStorage } from "@/lib/firebase/storage";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  let messagesRef: FirebaseFirestore.CollectionReference | null = null;

  try {
    const { prompt, chatId, size } = await req.json();

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId is required" },
        { status: 400 },
      );
    }

    messagesRef = db
      .collection("chats")
      .doc(chatId)
      .collection("messages");

    // A. ユーザーのプロンプトを保存
    await messagesRef.add({
      content: prompt,
      sender: "user",
      type: "text",
      created_at: FieldValue.serverTimestamp(),
    });

    // B. gpt-image-2 で画像を生成（base64形式で受け取る）
    const response = await openai.images.generate({
      model: "gpt-image-2",
      prompt: prompt,
      n: 1,
      size: (size || "1024x1024") as "1024x1024" | "1536x1024" | "1024x1536",
      response_format: "b64_json",
    });

    const b64 = response.data?.[0]?.b64_json;

    if (!b64) {
      throw new Error("画像データが取得できませんでした");
    }

    // C. base64 → Buffer に変換して Firebase Storage にアップロード
    const imageBuffer = Buffer.from(b64, "base64");
    const storagePath = `generated_images/${chatId}_${Date.now()}.png`;
    const imageUrl = await uploadToStorage(imageBuffer, storagePath, "image/png");

    // D. Firebase Storage の永続 URL を Firestore に保存
    await messagesRef.add({
      content: imageUrl,
      sender: "ai",
      type: "image",
      created_at: FieldValue.serverTimestamp(),
    });

    await db.collection("chats").doc(chatId).update({
      last_updated: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error: any) {
    const errorMessage =
      error.error?.message ||
      error.message ||
      "画像の生成に失敗しました";

    console.error("画像生成APIエラー:", errorMessage);

    if (messagesRef) {
      await messagesRef
        .add({
          content: `画像の生成に失敗しました。\nエラー: ${errorMessage}`,
          sender: "ai",
          type: "text",
          created_at: FieldValue.serverTimestamp(),
        })
        .catch(() => {});
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
