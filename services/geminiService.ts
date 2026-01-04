import { GoogleGenAI, Type } from "@google/genai";
import { GameConfig, GeneratedContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTypingContent = async (config: GameConfig): Promise<GeneratedContent> => {
  const { language, difficulty, topic } = config;

  let prompt = "";
  
  if (language === 'code') {
     prompt = `Generate a code snippet for typing practice.
      Topic: ${topic} (e.g., if nature, maybe a class about Animals).
      Difficulty: ${difficulty}.
      Language: TypeScript or Python.
      Length: approx 15-25 lines.
      Structure: Valid syntax, clean indentation.
      Return strictly a JSON object with 'text' (the code string) and 'title' (a short name for the snippet).`;
  } else {
    prompt = `Generate a paragraph of text for a typing tutor application.
      Language: ${language === 'spanish' ? 'Spanish (Español)' : 'English'}.
      Topic: ${topic}.
      Difficulty: ${difficulty}.
      - Beginner: Simple words, short sentences, no complex punctuation.
      - Intermediate: Standard vocabulary, mixed sentence lengths.
      - Expert: Complex vocabulary, scientific/literary terms, varied punctuation.
      Length: Approximately 60-100 words.
      The text must be plain text, no markdown formatting (like **bold** or *italics*), just raw text to type.
      Return strictly a JSON object with properties:
      - 'text': The content paragraph.
      - 'title': A short catchy title for this lesson.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            text: { type: Type.STRING },
            title: { type: Type.STRING }
          },
          required: ["text", "title"]
        }
      }
    });

    const jsonStr = response.text;
    if (!jsonStr) throw new Error("No response from AI");
    
    return JSON.parse(jsonStr) as GeneratedContent;
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    // Fallback in case of API error/quota limits
    return {
      title: "Fallback Lesson",
      text: language === 'spanish' 
        ? "El veloz murciélago hindú comía feliz cardillo y kiwi. La cigüeña tocaba el saxofón detrás del palenque de paja." 
        : "The quick brown fox jumps over the lazy dog. Programming is the art of telling another human what one wants the computer to do."
    };
  }
};
