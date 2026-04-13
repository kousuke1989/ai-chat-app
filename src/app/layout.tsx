import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AuthContextProvider } from "@/context/AuthContext";
import "./globals.css";

import Sidebar from "@/app/components/Sidebar";
import Navbar from "@/app/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Chat App",
  description: "Modern AI application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className="h-full">
      <body className={`${inter.className} h-full overflow-hidden`}>
        <AuthContextProvider>
          {/* 💡 修正ポイント1: bg-slate-50 を bg-blue-300 に変更 */}
          <div className="flex h-full w-full bg-blue-300">
            {/* 1. 左側サイドバー */}
            <Sidebar />

            {/* 2. 右側メインエリア */}
            <div className="flex flex-col flex-1 min-w-0 h-full">
              {/* 3. 上部ヘッダー */}
              <Navbar />

              {/* 4. チャット表示エリア */}
              {/* 💡 修正ポイント2: ここにも bg-blue-300 を念のため指定し、背景を透過させないようにする */}
              <main className="flex-1 overflow-y-auto relative bg-blue-300">
                {children}
              </main>
            </div>
          </div>
        </AuthContextProvider>
      </body>
    </html>
  );
}
