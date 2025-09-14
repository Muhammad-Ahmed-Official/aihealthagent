import { openai } from "@/config/openAiModel";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { NextRequest, NextResponse } from "next/server";
import { AIDoctorAgents } from "../../../../shared/list";
import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";

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
Return the result in the JSON format: 
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
only include fields. Respond with nothing else.
`

export const POST = asyncHandler(async(request:NextRequest):Promise<NextResponse> => {
    const { messages, sessionDetail, sessionId } = await request.json();
    if(!messages || !sessionDetail || !sessionId) return nextError(400, "Missing fields");

    const userInput = `AI Docter Info: ${JSON.stringify(sessionDetail)}, Conversation: ${JSON.stringify(messages)}`;
    const completion = await openai.chat.completions.create({
        model: "google/gemini-2.5-pro",
        messages: [
        { role: "system", content: REPORT_GEN_PROMPT },
        {
            role: "user",
            content: userInput,
        },
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
    });

    const rawResponse = completion.choices?.[0]?.message?.content ?? "";

    if (!rawResponse.trim()) {
        return nextResponse(500, "AI returned an empty response");
    }

    const cleaned = rawResponse
        .trim()
        .replace(/```json/g, "")
        .replace(/```/g, "");

    let response;
    try {
        response = JSON.parse(cleaned);
    } catch (err) {
        console.error("Invalid JSON from AI:", cleaned);
        return nextResponse(500, "AI returned invalid JSON format");
    }

    const result = await db.update(sessionChatTable).set({
        report: response,
        conversation: messages,
    }).where(eq(sessionChatTable?.sessionId, sessionId));

    return nextResponse(200, '', response);
})