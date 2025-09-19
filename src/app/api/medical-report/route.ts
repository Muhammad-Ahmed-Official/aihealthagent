import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { GoogleGenAI } from "@google/genai";

const REPORT_GEN_PROMPT = `You are an AI Medical Voice Agent that just finished a voice conversation with a user. Based on the docter AI agent info and Conversation between AI medical agent and user, generate a structured report with the following fields
1. sessionId: a unique session identifier
2. agent: the medical specialist name: (e.g., "General Physician AI")
3. user: name of the patient or "Anonymous" if not provided
4. timesstamp: current date and time in ISO format
5. chiefComplaint: one-sentence summary of the main health concern
6. summary: a 2-3 sentence summary of the main health concern
7. symptons: a 2-3 sentence summary of the conversation, symptons and recommandations 
8. duration: how long the user has experienced the symptons
9. severity: mild, moderate, or severe
10. recommandations: list of AI suggestions(e.g., rest, see a docter)
Return ONLY valid JSON, with no text, no code fences, no explanation.   
Required structure:
{
  "sessionId": "string",
  "agent": "string",
  "user": "string",
  "timestamp": "ISO Date string",
  "chiefComplaint": "string",
  "summary": "string",
  "symptoms": ["symptom1", "symptom2"],
  "duration": "string",
  "severity": "string",
  "medicationsMentioned": ["med1", "med2"],
  "recommandations": ["rec1", "rec2"],
}
`;

export const POST = asyncHandler(async (request: NextRequest): Promise<NextResponse> => {
  const { messages, sessionDetail, sessionId } = await request.json();
  if (!messages || !sessionDetail || !sessionId) {
    return nextError(400, "Missing fields");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const userInput = `AI Doctor Info: ${JSON.stringify(sessionDetail)}, Conversation: ${JSON.stringify(messages)}`;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash", 
    contents: `${REPORT_GEN_PROMPT}\n\n${userInput}`,
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
    await db
      .update(sessionChatTable)
      .set({
        report: jsonRes,
        conversation: messages
      })
      .where(eq(sessionChatTable.sessionId, sessionId));
  } catch (err) {
    console.error("Invalid JSON from AI:", cleanedText);
    return nextError(500, "AI returned invalid JSON");
  }
  return nextResponse(200, "", jsonRes);
});



export const DELETE = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  if(!sessionId) return nextError(400, "ID is required");

  const isDeleted = await db.delete(sessionChatTable)
  .where(eq(sessionChatTable.sessionId, sessionId))
  .returning();
  if(isDeleted.length === 0) return nextError(404, "No data found");

  return nextResponse(200, "Report deleted successfully");
})