"use client";
import { Button } from "@/app/components/ui/button";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { auth, provider } from "@/lib/firebase/firebaseClient";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      router.push("/conversation");
    }
  }, [currentUser, router]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      router.push("/conversation");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/conversation");
    } catch (err: any) {
      setError("メールアドレスまたはパスワードが正しくありません");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-300">
      <div className="p-8 bg-white rounded-lg shadow-xl w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-slate-800 text-center">
          AI Chat App ログイン
        </h1>

        {/* メール/パスワードフォーム */}
        <form onSubmit={handleEmailLogin} className="flex flex-col gap-3 mb-4">
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400"
          />
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:border-blue-400"
          />
          {error && (
            <p className="text-red-500 text-xs text-center">{error}</p>
          )}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg"
          >
            {isLoading ? "ログイン中..." : "ログイン"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <hr className="flex-1 border-slate-200" />
          <span className="text-xs text-slate-400">または</span>
          <hr className="flex-1 border-slate-200" />
        </div>

        {/* Google ログイン */}
        <Button
          onClick={handleGoogleLogin}
          className="w-full bg-black text-white hover:bg-slate-800 py-2.5 rounded-lg"
        >
          Googleでログイン
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
