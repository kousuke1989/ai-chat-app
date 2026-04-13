"use client";

import React from "react";
import Image from "next/image";

interface PanelProps {
  chatType: string;
}

const Panel = ({ chatType }: PanelProps) => {
  // チャットタイプごとの設定（ここから影やデバッグ情報を消しました）
  const getPanelContent = (type: string) => {
    switch (type) {
      case "conversation":
        return {
          imageUrl: "/conversation_panel.svg",
          message: "会話を始めよう",
        };
      case "image_generation":
        return {
          imageUrl: "/image_generation_panel.svg",
          message: "画像を生成しよう",
        };
      case "text_to_speech":
        return {
          imageUrl: "/text_to_speech_panel.svg",
          message: "テキストを音声に変換しよう",
        };
      case "speech_to_text":
        return {
          imageUrl: "/speech_to_text_panel.svg",
          message: "音声をテキストに変換しよう",
        };
      case "image_analysis":
        return {
          imageUrl: "/image_analysis_panel.svg",
          message: "画像を分析しよう",
        };
      default:
        return { imageUrl: "", message: "チャットを始めましょう" };
    }
  };

  const { imageUrl, message } = getPanelContent(chatType);

  return (
    <div className="flex-1 w-full min-h-[400px] flex flex-col items-center justify-center space-y-4">
      {/* 1. Debug用の黄色いラベルを削除しました */}

      {/* 2. 影(shadow-inner)を削除し、清潔感のある表示に */}
      {imageUrl ? (
        <div className="relative w-48 h-48 md:w-64 md:h-64">
          <Image
            src={imageUrl}
            alt={message}
            fill
            className="object-contain opacity-80"
          />
        </div>
      ) : (
        <div className="w-48 h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-400">
          No Image
        </div>
      )}

      <p className="text-xl font-medium text-gray-500 ">{message}</p>
    </div>
  );
};

export default Panel;
