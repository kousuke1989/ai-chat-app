"use client";

import React, { useState, useEffect } from "react";
import BotAvatar from "./BotAvatar";
import {
  Ellipsis,
  FileImage,
  FileOutput,
  FileSearch2,
  MessageCircle,
  Speech,
  Trash2, // 削除アイコン用に追加
} from "lucide-react";
import Link from "next/link";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { usePathname, useRouter } from "next/navigation"; // useRouterを追加
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  doc, // 追加
  deleteDoc, // 追加
} from "firebase/firestore";
import { db } from "@/lib/firebase/firebaseClient";
import { useAuth } from "@/context/AuthContext";
import { ChatRoom } from "@/types";

// Tailwindのクラスを結合するヘルパー関数
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const pathname = usePathname();
  const router = useRouter(); // 初期化
  const { currentUser } = useAuth();

  useEffect(() => {
    if (!currentUser) return;
    const q = query(
      collection(db, "chats"),
      where("user_id", "==", currentUser?.uid),
      orderBy("last_updated", "desc"),
    );

    const unsubscribe = onSnapshot(q, (snapShot) => {
      const fetchChatRooms = snapShot.docs.map((doc) => ({
        id: doc.id,
        type: doc.data().type || "conversation",
        user_id: doc.data().user_id,
        last_updated: doc.data().last_updated,
        first_message: doc.data().first_message,
      }));
      setChatRooms(fetchChatRooms);
    });
    return () => unsubscribe();
  }, [currentUser]);

  // --- 削除処理 ---
  const onDelete = async (e: React.MouseEvent, id: string) => {
    // 重要：Linkコンポーネントの遷移（クリックイベント）を止める
    e.preventDefault();
    e.stopPropagation();

    const ok = confirm("このチャットルームを削除してもよろしいですか？");
    if (!ok) return;

    try {
      // 1. Firestoreから削除
      await deleteDoc(doc(db, "chats", id));

      // 2. もし今消したチャットのページにいたら、トップへ戻す
      if (pathname.includes(id)) {
        router.push("/");
      }
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除に失敗しました。");
    }
  };

  const routes = [
    {
      label: "Conversation",
      href: "/conversation",
      color: "text-violet-500",
      Icon: MessageCircle,
    },
    {
      label: "Image_Generation",
      href: "/image_generation",
      color: "text-blue-500",
      Icon: FileImage,
    },
    {
      label: "Text to Speech",
      href: "/text_to_speech",
      color: "text-red-500",
      Icon: FileOutput,
    },
    {
      label: "Speech to text",
      href: "/speech_to_text",
      color: "text-green-500",
      Icon: Speech,
    },
    {
      label: "Image Analysis",
      href: "/image_analysis",
      color: "text-orange-500",
      Icon: FileSearch2,
    },
  ];

  return (
    <div className="space-y-4 bg-gray-900 text-white p-3 h-full flex flex-col">
      {/*タイトル&ロゴエリア*/}
      <Link href="/" className="flex items-center">
        <div className="mr-3 pl-3">
          <BotAvatar />
        </div>
        <h1 className="font-bold text-xl">AI Chat App</h1>
      </Link>

      {/*チャットタイプエリア*/}
      <div className="space-y-1">
        {routes.map((route) => (
          <Link
            href={route.href}
            key={route.href}
            className={cn(
              "block p-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition rounded-lg",
              pathname.startsWith(route.href) && "bg-white/10",
            )}
          >
            <div className="flex items-center">
              <route.Icon className={cn("h-5 w-5 mr-3", route.color)} />
              <p>{route.label}</p>
            </div>
          </Link>
        ))}
      </div>

      {/*チャットルームエリア*/}
      <div className="flex flex-1 flex-col overflow-hidden space-y-1">
        <h2 className="text-xs font-medium px-2 py-4 text-zinc-400">
          ChatRoom
        </h2>
        <div className="overflow-auto custom-scrollbar">
          {chatRooms.map((room) => (
            <Link
              href={`/${room.type}/${room.id}`}
              key={room.id}
              className={cn(
                "group block p-3 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 transition rounded-lg",
                pathname === `/${room.type}/${room.id}` &&
                  "bg-white/10 text-white",
              )}
            >
              <div className="flex items-center justify-between">
                <p className="font-medium truncate mr-2">
                  {room.first_message}
                </p>

                {/* 削除メニュー */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <div
                      className="p-1 hover:bg-gray-700 rounded-md transition"
                      onClick={(e) => {
                        e.preventDefault(); // 親のLinkが反応しないように
                        e.stopPropagation();
                      }}
                    >
                      <Ellipsis size={16} />
                    </div>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="bg-gray-800 border-gray-700 text-white"
                  >
                    <DropdownMenuItem
                      onClick={(e) => onDelete(e, room.id)}
                      className="text-red-500 cursor-pointer focus:bg-red-500/10 focus:text-red-500 flex items-center gap-2"
                    >
                      <Trash2 size={14} />
                      削除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
