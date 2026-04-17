"use client";
import { Button } from "@/app/components/ui/button";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/lib/firebase/firebaseClient";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const LoginPage = () => {
  const { currentUser } = useAuth();
  const router = useRouter();

  // 💡 既にログインしている場合はチャット画面へ
  useEffect(() => {
    if (currentUser) {
      router.push("/conversation");
    }
  }, [currentUser, router]);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
      // 💡 ログイン成功後にチャット画面へ遷移
      router.push("/conversation");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-300">
      <div className="p-8 bg-white rounded-lg shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-6 text-slate-800">
          AI Chat App ログイン
        </h1>
        <Button
          onClick={handleLogin}
          className="bg-black text-white hover:bg-slate-800 px-8 py-4 text-lg rounded-full"
        >
          Googleでログイン
        </Button>
      </div>
    </div>
  );
};

export default LoginPage;
