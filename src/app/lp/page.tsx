import Link from "next/link";
import Image from "next/image";
import {
  BrainCircuit,
  Image as ImageIcon,
  Mic,
  Sparkles,
  Github,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* ヒーローセクション：落ち着いたミッドナイトパープル */}
      <header className="py-24 px-6 text-center bg-gradient-to-br from-slate-900 via-purple-950 to-indigo-950 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-8 border border-white/20">
            <Sparkles size={16} className="text-purple-300" />
            <span>Next.js 15 & OpenAI API を活用した実戦的アプリ</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-8 leading-tight">
            AI Multi-Modal Chat
          </h1>
          <p className="text-xl md:text-2xl mb-12 opacity-80 leading-relaxed max-w-2xl mx-auto font-light">
            画像解析・画像生成・音声対話。最新のAI技術を一つのインターフェースに集約したマルチモーダル・チャットアプリ。
          </p>
          <Link
            href="/login"
            className="bg-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-purple-500 transition-all inline-block"
          >
            今すぐデモを体験する
          </Link>
        </div>
      </header>

      {/* 自己紹介セクション：my-photo.jpegを表示 */}
      <section className="py-20 px-6 bg-white border-b">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row items-center gap-10 bg-slate-50 p-8 md:p-12 rounded-[2.5rem] border shadow-sm">
            <div className="shrink-0">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full shadow-lg border-4 border-white overflow-hidden relative">
                <Image
                  src="/my-photo.jpeg"
                  alt="Developer Profile"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
            <div className="text-center md:text-left">
              <h2 className="text-sm font-bold text-purple-700 tracking-widest uppercase mb-2">
                Developer Profile
              </h2>
              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                嶋本 幸将
              </h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Next.js や TypeScript を中心に、最新の AI API
                を組み合わせたプロダクト開発を行っています。
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
