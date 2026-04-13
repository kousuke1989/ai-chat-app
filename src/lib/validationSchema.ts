import { z } from "zod";

export const conversationSchema = z.object({
  prompt: z.string().min(1, "Message cannot be empty."),
  resolution: z.string().optional(),
  amount: z.string().optional(),
});

export const imageGenerationSchema = z.object({
  prompt: z.string().min(1, "Message cannot be empty."),
  amount: z.string(),
  size: z.string(),
});

export const textToSpeechSchema = z.object({
  prompt: z.string().min(1, "Message cannot be empty."),
});
