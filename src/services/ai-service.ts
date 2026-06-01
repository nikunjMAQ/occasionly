import { GoogleGenerativeAI } from "@google/generative-ai";
import { buildWishPrompt } from "./ai-prompt-builder";
import { OccasionEvent } from "@/types/event";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

const genAI = new GoogleGenerativeAI(env.geminiApiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

export async function generateWish(
  event: OccasionEvent
) {
  try {
    const prompt =
      buildWishPrompt(event);

    const result =
      await model.generateContent(
        prompt
      );

    const response =
      await result.response;

    return response.text();
  } catch (error) {
    logger.log("ai", `Gemini wish generation failed for connection ${event.personName} (${event.id})`, error, { event });

    return `Wishing ${event.personName} a wonderful ${event.eventType}! 🎉`;
  }
}
