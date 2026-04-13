import { db } from "@/lib/firebase/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import OpenAI from "openai";

// 💡 実行時に API KEY がない場合のエラーを防ぐ
if (!process.env.OPENAI_API_KEY) {
  throw new Error("Missing OPENAI_API_KEY environment variable");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, chatId } = await req.json();

    // chatId が空の場合のエラーハンドリング
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

    // --- A. ユーザーの質問を保存 ---
    // Firestore のドキュメントIDを自動生成して追加
    await messagesRef.add({
      content: prompt,
      sender: "user",
      type: "text",
      created_at: FieldValue.serverTimestamp(),
    });

    // --- B. OpenAI APIを呼び出す ---
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // 実在する最新モデルを指定
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
    });

    const aiResponseText =
      response.choices[0].message.content ||
      "申し訳ありません、回答を生成できませんでした。";

    // --- C. AIの回答を保存 ---
    await messagesRef.add({
      content: aiResponseText,
      sender: "ai", // フロントエンドの判定ロジック(m.sender === "ai")に合わせる
      type: "text",
      created_at: FieldValue.serverTimestamp(),
    });

    // 💡 最後に chats ドキュメントの最終更新時間を更新する（Sidebarの並び替え用）
    await db.collection("chats").doc(chatId).update({
      last_updated: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true, text: aiResponseText });
  } catch (error: any) {
    console.error("APIエラー:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
