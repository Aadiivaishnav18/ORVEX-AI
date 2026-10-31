import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

const MODEL = "gemini-3.5-flash";


const toGeminiHistory = (messages) =>
  messages
    .filter((m) => m.text)
    .map((m) => ({ role: m.role, parts: [{ text: m.text }] }));


export async function* streamReply(previousMessages, text) {
  const chat = ai.chats.create({
    model: MODEL,
    history: toGeminiHistory(previousMessages),
    config: {
      systemInstruction:
        "You are Orvex-AI, a friendly and accurate assistant. Give clear, correct answers.",
    },
  });

  const stream = await chat.sendMessageStream({ message: text });

  for await (const chunk of stream) {
    if (chunk.text) yield chunk.text;
  }
}