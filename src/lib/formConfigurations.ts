import { text } from "stream/consumers";
import {
  conversationSchema,
  imageGenerationSchema,
  textToSpeechSchema,
} from "./validationSchema";
import { ChatType } from "@/types";

export const amountOptions = [
  {
    value: "1",
    label: "1枚",
  },
  {
    value: "2",
    label: "2枚",
  },
  {
    value: "3",
    label: "3枚",
  },
  {
    value: "4",
    label: "4枚",
  },
];

// gpt-image-2 対応サイズ
export const sizeOptions = [
  {
    value: "1024x1024",
    label: "1024x1024 (正方形)",
  },
  {
    value: "1536x1024",
    label: "1536x1024 (横長)",
  },
  {
    value: "1024x1536",
    label: "1024x1536 (縦長)",
  },
];

const formConfig = {
  conversation: { schema: conversationSchema, defaultValues: { prompt: "" } },
  image_generation: {
    schema: imageGenerationSchema,
    defaultValues: { prompt: "", amount: "1", size: "1024x1024" },
  },
  text_to_speech: {
    schema: textToSpeechSchema,
    defaultValues: { prompt: "" },
  },
  speech_to_text: {
    schema: conversationSchema,
    defaultValues: { prompt: "" },
  },
  image_analysis: {
    schema: conversationSchema,
    defaultValues: { prompt: "" },
  },
  text_generation: {
    schema: conversationSchema,
    defaultValues: { prompt: "" },
  },
};

export const getFormConfig = (chatType: ChatType) => {
  return formConfig[chatType];
};
