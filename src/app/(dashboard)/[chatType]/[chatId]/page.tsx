import Chat from "@/app/components/Chat";
import { notFound } from "next/navigation";
import { ChatType } from "@/types";

const allowedChatType = [
  "conversation",
  "image_generation",
  "text_to_speech",
  "speech_to_text",
  "image_analysis",
] as const;

export default async function ChatRoomPage({
  params,
}: {
  params: Promise<{ chatType: string; chatId: string }>;
}) {
  const { chatType, chatId } = await params;

  console.log("Rendering ChatRoom:", { chatType, chatId });

  if (!(allowedChatType as readonly string[]).includes(chatType)) {
    return notFound();
  }

  const validatedChatType = chatType as ChatType;

  // 💡 修正ポイント
  // 1. 全体を <div> で包み、bg-blue-300 と h-screen (または h-full) を指定
  // 2. key={chatId} によりチャット切り替え時の整合性を確保
  return (
    <div className="flex flex-col h-screen bg-blue-300 overflow-hidden">
      <Chat key={chatId} chatId={chatId} chatType={validatedChatType} />
    </div>
  );
}
