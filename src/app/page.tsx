import Link from "next/link";
import Image from "next/image";
import {
  BrainCircuit,
  ImageIcon,
  Mic,
  Sparkles,
  Github,
  Zap,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
      {/* ヒーローセクション */}
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
            href="/conversation"
            className="bg-purple-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-purple-500 transition-all inline-block"
          >
            今すぐデモを体験する
          </Link>
        </div>
      </header>

      {/* 機能紹介セクション (新規追加) */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-sm font-bold text-purple-600 tracking-widest uppercase mb-3">
              Features
            </h2>
            <p className="text-4xl font-bold text-slate-900">
              マルチモーダルな体験
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* 機能1: 画像解析 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors group">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-6 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <BrainCircuit size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Vision Analysis</h3>
              <p className="text-slate-600 leading-relaxed">
                アップロードされた画像をAIが即座に解析。写真の内容を説明したり、画像内のテキストを読み取ることが可能です。
              </p>
            </div>

            {/* 機能2: 画像生成 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors group">
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <ImageIcon size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Image Generation</h3>
              <p className="text-slate-600 leading-relaxed">
                言葉だけで新しい画像を生成。DALL-E
                3との連携により、あなたの想像を高品質なビジュアルとして形にします。
              </p>
            </div>

            {/* 機能3: 音声対話 */}
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:border-purple-200 transition-colors group">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Mic size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">Voice Response</h3>
              <p className="text-slate-600 leading-relaxed">
                AIの回答を自然な音声で再生。テキストを読むだけでなく、耳で聴くことでより直感的な対話を実現しました。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* アプリ・スクリーンショット セクション */}
      <section className="py-20 px-6 bg-slate-50 border-y">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12">Application Interface</h2>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl border-8 border-white">
            <Image
              src="/screenshot.png"
              alt="Application Screenshot"
              width={1200}
              height={675}
              className="w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 自己紹介セクション */}
      <section className="py-20 px-6 bg-white">
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
                kousuke shimamoto
              </h3>
              <p className="text-slate-600 leading-relaxed">
                Next.js や TypeScript を中心に、最新の AI API
                を組み合わせたプロダクト開発を行っています。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* フッターセクション */}
      <footer className="py-12 px-6 bg-slate-900 text-white mt-auto">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-400">
            © 2026 kousuke shimamoto. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href="https://github.com/kousuke1989"
              className="hover:text-purple-400 transition-colors"
            >
              <Github size={24} />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
