import { GoogleGenAI, Type } from "@google/genai";
import { StudyContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchExplanation = async (subject: string, topic: string): Promise<StudyContent> => {
  try {
    const prompt = `
      You are an expert high school tutor specializing in the Grade 12 curriculum. 
      Please provide a clear, concise, and educational explanation for the topic: "${topic}" 
      specifically within the subject of "${subject}".
      
      The output must strictly adhere to the following structure:
      1. Definition: A clear, academic definition suitable for a 12th-grade student.
      2. Key Points: A list of 3-5 crucial facts, formulas, or concepts related to the topic.
      3. Example: A short, concise practical example (maximum 2-3 sentences) with brief explanation.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are a helpful and precise educational assistant. Always respond with valid JSON.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            definition: {
              type: Type.STRING,
              description: "A comprehensive definition of the concept.",
            },
            keyPoints: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: "3 to 5 key bullet points summarizing the concept.",
            },
            example: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "A short title for the example.",
                },
                content: {
                  type: Type.STRING,
                  description: "The example scenario and explanation.",
                },
              },
              required: ["title", "content"],
              description: "A practical example illustrating the concept.",
            },
            imageUrl: {
              type: Type.STRING,
              description: "A simple educational diagram or illustration URL related to the topic.",
            },
          },
          required: ["definition", "keyPoints", "example"],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    return JSON.parse(text) as StudyContent;
  } catch (error) {
    console.error("Error fetching explanation:", error);
    throw error;
  }
};
