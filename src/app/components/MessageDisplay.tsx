import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MessageDisplayProps {
  markdown: string; // テキスト内容
  type?: string; // メッセージの種類
  imageUrls?: string[]; // 💡 追加: 複数画像のURL配列
}

const MessageDisplay = ({ markdown, type, imageUrls }: MessageDisplayProps) => {
  // 1. 音声 (audio) の場合
  if (type === "audio") {
    return (
      <div className="flex flex-col gap-2 p-2 bg-secondary/30 rounded-lg">
        <audio src={markdown} controls className="w-full max-w-[280px] h-10" />
        <span className="text-[10px] text-muted-foreground ml-1">
          AI Voice Response
        </span>
      </div>
    );
  }

  // 2. 画像 (image) の場合
  if (type === "image") {
    return (
      <div className="flex flex-col gap-y-2">
        {/* 💡 複数枚の画像をグリッドで表示 */}
        {imageUrls && imageUrls.length > 0 && (
          <div
            className={`grid gap-2 ${imageUrls.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}
          >
            {imageUrls.map((url, index) => (
              <div
                key={index}
                className="rounded-lg overflow-hidden border border-slate-200 shadow-sm"
              >
                <img
                  src={url}
                  alt={`Uploaded ${index + 1}`}
                  className="w-full h-auto object-cover aspect-square bg-slate-100"
                />
              </div>
            ))}
          </div>
        )}

        {/* 💡 画像と一緒に送ったテキスト（プロンプト）も表示 */}
        {markdown && (
          <div className="prose prose-sm dark:prose-invert max-w-none wrap-break-word mt-1">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {markdown}
            </ReactMarkdown>
          </div>
        )}
      </div>
    );
  }

  // 3. テキスト (text) またはそれ以外の場合
  return (
    <div className="prose prose-sm dark:prose-invert max-w-none wrap-break-word">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown || ""}
      </ReactMarkdown>
    </div>
  );
};

export default MessageDisplay;
