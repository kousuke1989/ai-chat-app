"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRef, useState, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { db } from "@/lib/firebase/firebaseClient";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Loader2, SendHorizontal, Mic, Square, Paperclip } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ChatType } from "@/types";
import { useAuth } from "@/context/AuthContext";

const formSchema = z.object({
  prompt: z.string().min(1),
});

interface ChatFormProps {
  chatId?: string;
  chatType: ChatType;
}

export default function ChatForm({ chatId, chatType }: ChatFormProps) {
  const router = useRouter();
  const { currentUser } = useAuth();
  const isLock = useRef(false);
  const [isPending, setIsPending] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { prompt: "" },
  });

  const ensureChatId = async (firstMsg: string) => {
    if (chatId) return chatId;
    const chatRef = await addDoc(collection(db, "chats"), {
      first_message: firstMsg,
      last_updated: serverTimestamp(),
      type: chatType,
      user_id: currentUser?.uid,
    });
    return chatRef.id;
  };

  // --- 1. テキスト送信 ---
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (isLock.current) return;
    try {
      isLock.current = true;
      setIsPending(true);
      const promptValue = values.prompt;
      form.reset({ prompt: "" });

      let currentId = await ensureChatId(promptValue);
      await axios.post(`/api/${chatType}`, {
        prompt: promptValue,
        chatId: currentId,
      });

      if (!chatId) router.push(`/${chatType}/${currentId}`);
    } catch (error) {
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsPending(false);
        isLock.current = false;
      }, 1000);
    }
  };

  // --- 2. 音声送信 ---
  const sendVoiceData = async (blob: Blob) => {
    if (isLock.current) return;
    try {
      isLock.current = true;
      setIsPending(true);
      let currentId = await ensureChatId("🎤 音声メッセージを送信しました");
      const formData = new FormData();
      formData.append("file", blob, "recording.webm");
      formData.append("chatId", currentId);

      const response = await axios.post("/api/speech_to_text", formData, {
        responseType: "arraybuffer",
        headers: { "Content-Type": "multipart/form-data" },
      });

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play().catch((e) => console.error("再生エラー:", e));

      if (!chatId) router.push(`/speech_to_text/${currentId}`);
      else router.refresh();
    } catch (error) {
      console.error("音声送信エラー:", error);
    } finally {
      setIsPending(false);
      isLock.current = false;
    }
  };

  // --- 3. 画像解析ロジック (複数枚対応) ---
  const sendImageData = async (files: FileList) => {
    if (isLock.current || files.length === 0) return;
    try {
      isLock.current = true;
      setIsPending(true);

      const promptValue =
        form.getValues("prompt") ||
        "これらの画像について詳しく教えてください。";
      let currentId = await ensureChatId(
        `📸 画像(${files.length}枚)を解析中...`,
      );

      const formData = new FormData();
      // 💡 複数ファイルを FormData に追加
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });
      formData.append("prompt", promptValue);
      formData.append("chatId", currentId);

      await axios.post("/api/image_analysis", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      form.reset({ prompt: "" });
      if (!chatId) router.push(`/image_analysis/${currentId}`);
      else router.refresh();
    } catch (error) {
      console.error("画像解析エラー:", error);
    } finally {
      setIsPending(false);
      isLock.current = false;
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (chatType === "image_analysis") {
      await sendImageData(files);
    } else if (chatType === "speech_to_text") {
      await sendVoiceData(files[0]); // 音声は最初の1つだけ
    }

    // 選択をリセット（同じファイルを再度選べるようにする）
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];
      mediaRecorder.ondataavailable = (event) =>
        audioChunksRef.current.push(event.data);
      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });
        await sendVoiceData(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("マイク失敗:", err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-x-3 p-4 bg-white border-t"
      >
        <div className="flex items-center gap-x-1">
          {(chatType === "speech_to_text" || chatType === "image_analysis") && (
            <div className="relative">
              <input
                type="file"
                // 💡 画像解析モードの時だけ複数選択を許可
                multiple={chatType === "image_analysis"}
                accept={chatType === "image_analysis" ? "image/*" : "audio/*"}
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isPending || isRecording}
                onClick={() => fileInputRef.current?.click()}
                className="text-slate-500 hover:text-blue-600 rounded-full"
              >
                <Paperclip className="w-5 h-5" />
              </Button>
            </div>
          )}

          {chatType === "speech_to_text" && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isPending}
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`rounded-full transition-all ${isRecording ? "bg-red-100 text-red-600 scale-125" : "text-slate-500 hover:text-blue-600"}`}
            >
              {isRecording ? (
                <Square className="w-5 h-5 fill-current" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </Button>
          )}
        </div>

        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <input
                  {...field}
                  placeholder={
                    chatType === "image_analysis"
                      ? "画像を複数選んで質問..."
                      : chatType === "speech_to_text"
                        ? "マイク長押しで録音..."
                        : "入力..."
                  }
                  disabled={isPending || isRecording}
                  autoComplete="off"
                  className="w-full px-4 py-2.5 bg-slate-100 rounded-full outline-none text-sm"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={isPending || isRecording || !form.watch("prompt")}
          className="bg-black rounded-full w-10 h-10 flex items-center justify-center hover:bg-blue-700 transition-colors"
        >
          {isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <SendHorizontal className="w-5 h-5" />
          )}
        </Button>
      </form>
    </Form>
  );
}
