import { Timestamp } from "firebase/firestore";

export type ChatType =
  | "conversation"
  | "text_generation"
  | "image_generation"
  | "text_to_speech"
  | "speech_to_text"
  | "image_analysis";
export interface ChatRoom {
  id: string;

  type: string;
  user_id: string;
  first_message: string;
  last_updated: Timestamp;
}

export interface TextMessage {
  id: string;
  content: string;
  type: string;
  created_at: Timestamp;
  sender: "user" | "assistant";
}
