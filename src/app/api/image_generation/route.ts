import { db } from "@/lib/firebase/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// 環境変数のチェック
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, chatId, amount, size } = await req.json();

    if (!chatId) {
      return NextResponse.json(
        { error: "chatId is required" },
        { status: 400 },
      );
    }

    const messagesRef = db
      .collection("chats")
      .doc(chatId)
      .collection("messages");

    // --- A. ユーザーのプロンプトを保存 ---
    // フロントエンドで保存を廃止したため、ここで確実に保存します
    await messagesRef.add({
      content: prompt,
      sender: "user",
      type: "text",
      created_at: FieldValue.serverTimestamp(),
    });

    // --- B. OpenAI DALL-E APIで画像を生成 ---
    // 💡 DALL-E 3の仕様に基づき、n は必ず 1 に固定します
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: size || "1024x1024",
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error("画像の生成に失敗しました（URLが取得できません）");
    }

    // --- C. 生成された画像のURLをAIの回答として保存 ---
    await messagesRef.add({
      content: imageUrl,
      sender: "ai", // フロントエンドの判定(m.sender === "ai")に合わせる
      type: "image",
      created_at: FieldValue.serverTimestamp(),
    });

    // チャットルームの最終更新時間を更新（並び替え用）
    await db.collection("chats").doc(chatId).update({
      last_updated: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, url: imageUrl });
  } catch (error: any) {
    // 💡 VS Codeのターミナルに詳細なエラーを出す
    console.error(
      "画像生成APIエラー詳細:",
      error.response?.data || error.message,
    );

    // OpenAI側から返ってきた具体的なエラーメッセージがあればそれを返す
    const errorMessage =
      error.response?.data?.error?.message ||
      error.message ||
      "Internal Server Error";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
