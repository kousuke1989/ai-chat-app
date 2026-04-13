import { redirect } from "next/navigation";

export default function RootPage() {
  // アクセスしてきた人を自動的にチャット画面へ飛ばす
  redirect("/conversation");
}
