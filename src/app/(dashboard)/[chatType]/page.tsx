"use client";

import React, { use } from "react";
import Chat from "@/app/components/Chat";
import { notFound } from "next/navigation";
import { ChatType } from "@/types";

const ALLOWED_CHAT_TYPES = [
  "conversation",
  "image_generation",
  "text_to_speech",
  "speech_to_text",
  "image_analysis",
] as const;

export default function ChatTypePage({
  params,
}: {
  params: Promise<{ chatType: string }>;
}) {
  const resolvedParams = use(params);
  const chatTypeRaw = (resolvedParams.chatType || "").toLowerCase();

  // 1. バリデーション：許可されていないモードなら404
  if (!(ALLOWED_CHAT_TYPES as readonly string[]).includes(chatTypeRaw)) {
    return notFound();
  }

  const chatType = chatTypeRaw as ChatType;

  /**
   * 💡 ポイント：
   * このページ（親）では chatId を渡さずに <Chat /> を表示します。
   * これにより、サイドバーからチャットを選ぶ前の「初期画面」が正常に表示されます。
   */
  return <Chat chatType={chatType} chatId={undefined} />;
}
