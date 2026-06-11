import { db } from "@/lib/firebase/firebaseAdmin";
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
  // messagesRef を catch でも使えるようにスコープを外に出す
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

    // B. DALL-E 3 で画像を生成（n は仕様上 1 固定）
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: size || "1024x1024",
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("画像URLが取得できませんでした");
    }

    // C. 生成された画像 URL を AI の回答として保存
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

    // DALL-E が失敗した場合、エラー内容をチャットに表示する
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
