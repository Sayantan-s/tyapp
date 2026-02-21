import { z } from "zod";

// Enums and Literals
export const MessageTypeSchema = z.enum(["TEXT", "CODE", "SYSTEM", "REACTION"]);
export type MessageType = z.infer<typeof MessageTypeSchema>;

export const ChatModeSchema = z.enum(["CHILL", "DEV"]);
export type ChatMode = z.infer<typeof ChatModeSchema>;

// Shared Schemas
export const SenderSchema = z.object({
  handle: z.string(),
  publicKeyFingerprint: z.string(),
});
export type Sender = z.infer<typeof SenderSchema>;

export const PayloadSchema = z.object({
  type: MessageTypeSchema,
  body: z.string(),
  language: z.string().optional(),
});
export type Payload = z.infer<typeof PayloadSchema>;

export const MetadataSchema = z.object({
  spotifyTrack: z.string().optional(),
  gitBranch: z.string().optional(),
});
export type Metadata = z.infer<typeof MetadataSchema>;

export const ContextSchema = z.object({
  mode: ChatModeSchema,
  timestamp: z.number(),
  metadata: MetadataSchema.optional(),
});
export type Context = z.infer<typeof ContextSchema>;

// Core Message Schema
export const TTMessageSchema = z.object({
  id: z.string(),
  sender: SenderSchema,
  payload: PayloadSchema,
  context: ContextSchema,
});
export type TTMessage = z.infer<typeof TTMessageSchema>;

export const ChatMessageSchema = TTMessageSchema;
export type ChatMessage = TTMessage;

// Auth Schemas
export const AuthChallengeSchema = z.object({
  nonce: z.string(),
  expiresAt: z.number(),
});
export type AuthChallenge = z.infer<typeof AuthChallengeSchema>;

export const AuthResponseSchema = z.object({
  handle: z.string(),
  signature: z.string(),
  nonce: z.string(),
});
export type AuthResponse = z.infer<typeof AuthResponseSchema>;
