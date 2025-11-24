import { GoogleGenAI, Type } from "@google/genai";
import { StudyContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const fetchImage = async (subject: string, topic: string): Promise<string | undefined> => {
  try {
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrnamespace=6&gsrsearch=${encodeURIComponent(subject + " " + topic + " diagram")}&gsrlimit=1&prop=imageinfo&iiprop=url&format=json&origin=*`;
    const imageRes = await fetch(searchUrl);
    const imageData = await imageRes.json();
    
    if (imageData.query && imageData.query.pages) {
      const pages = Object.values(imageData.query.pages);
      if (pages.length > 0) {
        // @ts-ignore
        const imageInfo = pages[0].imageinfo;
        if (imageInfo && imageInfo.length > 0) {
          return imageInfo[0].url;
        }
      }
    }
  } catch (imgError) {
    console.warn("Failed to fetch image from Wikimedia:", imgError);
  }
  return undefined;
};

export const fetchExplanation = async (subject: string, topic: string): Promise<StudyContent> => {
  try {
    // Start image fetch immediately (non-blocking)
    const imagePromise = fetchImage(subject, topic);

    const prompt = `
      You are an expert high school tutor specializing in the Grade 12 curriculum. 
      Please provide a clear, concise, and educational explanation for the topic: "${topic}" 
      specifically within the subject of "${subject}".
      
      The output must strictly adhere to the following structure:
      1. Definition: A clear, academic definition suitable for a 12th-grade student.
      2. Key Points: A list of 3-5 crucial facts, formulas, or concepts related to the topic.
      3. Example: A short, concise practical example (maximum 2-3 sentences) with brief explanation.
    `;

    // Start AI generation
    const aiPromise = ai.models.generateContent({
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
          },
          required: ["definition", "keyPoints", "example"],
        },
      },
    });

    // Wait for both to complete
    const [response, imageUrl] = await Promise.all([aiPromise, imagePromise]);

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const parsedData = JSON.parse(text) as StudyContent;
    
    if (imageUrl) {
      parsedData.imageUrl = imageUrl;
    }
    
    return parsedData;
  } catch (error) {
    console.error("Error fetching explanation:", error);
    throw error;
  }
};
