import { openai } from "@/config/openAiModel";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextResponse } from "@/utils/Responses";
import { NextRequest, NextResponse } from "next/server";
import { AIDoctorAgents } from "../../../../shared/list";

export const POST = asyncHandler(
  async (request: NextRequest): Promise<NextResponse> => {
    const { notes } = await request.json();

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-pro",
      messages: [
        { role: "system", content: JSON.stringify(AIDoctorAgents) },
        {
          role: "user",
          content: `User Notes/Symptoms: ${notes}.
          Based on user notes, suggest list of doctors.

          ⚠️ IMPORTANT: Reply ONLY with a valid JSON array.
          Use double quotes for all keys and string values.
          Do not include explanations, comments, or markdown fences.
          `,
        },
      ],
      // This ensures API (if supported) forces JSON
      response_format: { type: "json_object" },
      max_tokens: 1000, // allow enough room for response
    });

    const rawResponse = completion.choices?.[0]?.message?.content ?? "";

    if (!rawResponse.trim()) {
      return nextResponse(500, "AI returned an empty response");
    }

    // Clean up content just in case the model adds fences
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

    return nextResponse(200, "Success", response);
  }
);
