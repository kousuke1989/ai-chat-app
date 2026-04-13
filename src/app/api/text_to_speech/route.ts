import { db, bucket } from "@/lib/firebase/firebaseAdmin";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import admin from "firebase-admin"; // FieldValueを使うために直接インポート

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { prompt, chatId } = await req.json();

    if (!chatId) {
      return new NextResponse("Chat ID missing", { status: 400 });
    }

    // 1. OpenAIで音声を生成
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: prompt,
    });

    // 2. 音声データをBuffer形式に変換
    const buffer = Buffer.from(await mp3.arrayBuffer());

    // 3. 保存先のパスを作成 (audio/チャットID/タイムスタンプ.mp3)
    const fileName = `audio/${chatId}/${Date.now()}.mp3`;
    const file = bucket.file(fileName);

    // 4. Firebase Storage にアップロード
    await file.save(buffer, {
      metadata: { contentType: "audio/mpeg" },
    });

    // 5. 再生用の署名付きURLを発行 (期限は約50年後)
    const [audioUrl] = await file.getSignedUrl({
      action: "read",
      expires: "01-01-2070",
    });

    // 6. Firestore の「messages」サブコレクションに保存
    // 💡 これで ChatMessage.tsx がリアルタイム検知して画面が更新されます
    await db.collection("chats").doc(chatId).collection("messages").add({
      content: audioUrl,
      sender: "ai",
      type: "audio",
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[TTS_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
