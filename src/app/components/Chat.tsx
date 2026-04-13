"use client";

import React from "react";
import ChatMessage from "@/app/components/ChatMessage";
import ChatForm from "@/app/components/ChatForm";
import Panel from "@/app/components/Panel";
import { ChatType } from "@/types";

interface ChatProps {
  chatId?: string;
  chatType: ChatType;
}

export default function Chat({ chatId, chatType }: ChatProps) {
  return (
    // 💡 背景色を bg-blue-300 に変更
    <div className="flex flex-col h-full w-full bg-blue-300 relative z-10">
      {/* メッセージ表示エリア */}
      <div className="flex-1 overflow-y-auto min-h-0 relative">
        {/* 💡 max-w-5xl を削除して横幅いっぱいに */}
        <div className="w-full h-full">
          {chatId ? (
            <ChatMessage key={chatId} chatId={chatId} chatType={chatType} />
          ) : (
            <div className="h-full w-full flex items-center justify-center p-4">
              <Panel chatType={chatType} />
            </div>
          )}
        </div>
      </div>

      {/* 入力フォームエリア */}
      {/* 💡 border-t を消すか、色を調整すると背景と馴染みます */}
      <div className="shrink-0 bg-white/90 backdrop-blur-md relative z-20">
        {/* 💡 ここも max-w-5xl を削除して w-full に */}
        <div className="w-full">
          <ChatForm chatId={chatId} chatType={chatType} />
        </div>
      </div>
    </div>
  );
}
