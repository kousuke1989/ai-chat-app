import { db, bucket } from "@/lib/firebase/firebaseAdmin"; // bucketを直接インポート
import { FieldValue } from "firebase-admin/firestore";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const prompt =
      (formData.get("prompt") as string) || "画像について教えてください。";
    const chatId = formData.get("chatId") as string;

    if (files.length === 0 || !chatId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const imageUrls: string[] = [];
    const openAiContents: any[] = [{ type: "text", text: prompt }];

    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `chats/${chatId}/${Date.now()}_${file.name}`;

      // 💡 firebaseAdmin.ts で定義した bucket をそのまま使用
      const fileRef = bucket.file(fileName);

      // 保存
      await fileRef.save(buffer, { contentType: file.type });

      // 署名付きURLの発行
      const [url] = await fileRef.getSignedUrl({
        action: "read",
        expires: "01-01-2050",
      });
      imageUrls.push(url);

      openAiContents.push({
        type: "image_url",
        image_url: {
          url: `data:${file.type};base64,${buffer.toString("base64")}`,
        },
      });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: openAiContents as any }],
    });

    const aiText =
      response.choices[0].message.content || "解析できませんでした。";

    const messagesRef = db
      .collection("chats")
      .doc(chatId)
      .collection("messages");

    // ユーザー側メッセージ（画像URL配列付き）
    await messagesRef.add({
      content: prompt,
      sender: "user",
      type: "image",
      imageUrls: imageUrls,
      created_at: FieldValue.serverTimestamp(),
    });

    // AI側メッセージ
    await messagesRef.add({
      content: aiText,
      sender: "ai",
      type: "text",
      created_at: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Storage/Analysis Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
