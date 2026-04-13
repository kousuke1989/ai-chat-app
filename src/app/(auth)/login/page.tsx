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

  useEffect(() => {
    if (currentUser) {
      router.push("/conversation");
    }
  }, [currentUser]);

  // ログイン処理
  const handleLogin = () => {
    signInWithPopup(auth, provider)
      .then(() => {
        // router.push("/conversation");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return <Button onClick={handleLogin}>Login</Button>;
};

export default LoginPage;
