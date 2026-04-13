"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// プロパティの型を定義
interface UserAvatarProps {
  user?: any; // 引数として user を受け取れるようにする
  className?: string; // スタイル調整用の className も受け取れるようにすると便利
}

const UserAvatar = ({ user, className }: UserAvatarProps) => {
  // 渡された user (currentUser) から画像URLを取得
  const photoURL = user?.photoURL || undefined;

  // 表示名の最初の1文字をフォールバック（画像がない時の文字）にする
  const fallbackText = user?.displayName
    ? user.displayName.slice(0, 2).toUpperCase()
    : "CN";

  return (
    <Avatar className={className}>
      {" "}
      {/* 呼び出し側の className (h-8 w-8 など) を反映 */}
      <AvatarImage src={photoURL} />
      <AvatarFallback className="bg-slate-200 text-[10px] font-bold">
        {fallbackText}
      </AvatarFallback>
    </Avatar>
  );
};

export default UserAvatar;
