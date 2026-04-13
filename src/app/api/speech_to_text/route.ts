import { db } from "@/lib/firebase/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const chatId = formData.get("chatId") as string;

    if (!file || !chatId) {
      return NextResponse.json(
        { error: "ファイルとchatIdが必要です" },
        { status: 400 },
      );
    }

    // 1. Whisperでユーザーの声をテキスト化
    const transcription = await openai.audio.transcriptions.create({
      file: file,
      model: "whisper-1",
      language: "ja",
    });
    const userText = transcription.text;

    // 2. GPTでAIの返答を生成
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 高速なモデルを選択
      messages: [
        {
          role: "system",
          content: "あなたは親切なアシスタントです。簡潔に短く答えてください。",
        },
        { role: "user", content: userText },
      ],
    });
    const aiText = completion.choices[0].message.content || "";

    // 3. TTSでAIの返答を音声化
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy", // alloy, echo, fable, onyx, nova, shimmer から選択可能
      input: aiText,
    });

    // 4. Firestoreにログを保存（バックグラウンドで実行）
    const messagesRef = db
      .collection("chats")
      .doc(chatId)
      .collection("messages");
    await messagesRef.add({
      content: userText,
      sender: "user",
      type: "text",
      created_at: FieldValue.serverTimestamp(),
    });
    await messagesRef.add({
      content: aiText,
      sender: "ai",
      type: "text",
      created_at: FieldValue.serverTimestamp(),
    });

    // 5. 音声データをバイナリとしてフロントに返す
    const buffer = Buffer.from(await mp3.arrayBuffer());

    return new Response(buffer, {
      headers: {
        "Content-Type": "audio/mpeg",
        "X-AI-Text": encodeURIComponent(aiText), // テキストもヘッダーに入れて渡すと便利
      },
    });
  } catch (error: any) {
    console.error("Voice Chat Error:", error);
    return NextResponse.json(
      { error: "エラーが発生しました" },
      { status: 500 },
    );
  }
}
