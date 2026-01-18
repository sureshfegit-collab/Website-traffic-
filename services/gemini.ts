
import { GoogleGenAI } from "@google/genai";
import { TrafficStats } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeTraffic = async (url: string): Promise<TrafficStats> => {
  const prompt = `
    Analyze the website traffic for: ${url}.
    Find the most recent estimated monthly traffic volume and the percentage breakdown of visitors by country.
    
    Format your response strictly as follows:
    1. A natural language summary of the findings.
    2. A structured JSON block at the end of your response inside triple backticks (\`\`\`json ... \`\`\`) with the following fields:
       - monthlyVisits (string, e.g., "1.2M")
       - bounceRate (string, e.g., "45%")
       - avgDuration (string, e.g., "02:45")
       - countries (array of objects with { "name": string, "percentage": number })
    
    Use Google Search to ensure data is accurate and up-to-date.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const text = response.text || "";
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  // Extract URLs from grounding chunks
  const sources = groundingChunks
    .filter(chunk => chunk.web)
    .map(chunk => ({
      title: chunk.web?.title || "Search Result",
      uri: chunk.web?.uri || ""
    }));

  // Parse JSON from text
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  let parsedData = {
    monthlyVisits: "N/A",
    bounceRate: "N/A",
    avgDuration: "N/A",
    countries: []
  };

  if (jsonMatch && jsonMatch[1]) {
    try {
      parsedData = JSON.parse(jsonMatch[1]);
    } catch (e) {
      console.error("Failed to parse JSON from response", e);
    }
  }

  return {
    url,
    summary: text.split('```')[0].trim(),
    monthlyVisits: parsedData.monthlyVisits,
    bounceRate: parsedData.bounceRate,
    avgDuration: parsedData.avgDuration,
    countries: parsedData.countries.map((c, i) => ({
      ...c,
      color: ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981'][i % 5]
    })),
    sources: sources.slice(0, 5)
  };
};
