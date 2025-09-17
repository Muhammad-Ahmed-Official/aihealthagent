import { asyncHandler } from "@/utils/AsyncHandler";
import { nextResponse } from "@/utils/Responses";
import { NextRequest, NextResponse } from "next/server";
import { AIDoctorAgents } from "../../../../shared/list";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export const POST = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
  const { notes } = await request.json();

  const prompt = `
User Notes/Symptoms: ${notes}.
Based on user notes, suggest list of doctors.

⚠️ IMPORTANT: Reply ONLY with a valid JSON array.
Use double quotes for all keys and string values.
Do not include explanations, comments, or markdown fences.
`;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: [
      {
        role: "system", 
        parts: [
          { text: JSON.stringify(AIDoctorAgents) }  
        ]
      },
      {
        role: "user",
        parts: [
          { text: prompt }
        ]
      }
    ],
    config: {
      maxOutputTokens: 500,
      responseMimeType: "application/json"
    }
  });

  const rawText = response.text;
  const cleanedText = rawText!
    .replace(/^```json\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  let jsonRes;
  try {
    jsonRes = JSON.parse(cleanedText);
  } catch (err) {
    console.error("Invalid JSON from AI:", cleanedText);
    return nextResponse(500, "AI returned invalid JSON format");
  }

  return nextResponse(200, "Success", jsonRes);
});