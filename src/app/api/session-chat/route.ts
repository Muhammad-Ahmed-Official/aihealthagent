import { db } from "@/config/db";
import { sessionChatTable } from "@/config/schema";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { currentUser } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const { notes, selectedDocter } = await request.json();
    const user = await currentUser();

    const result = await db.insert(sessionChatTable).values({
        sessionId: crypto.randomUUID(),
        createdBy: user?.primaryEmailAddress?.emailAddress,
        notes,
        selectedDocter,
        createdOn: (new Date()).toString(),
    }).returning();

    return nextResponse(200, '', result[0]);
})

export const GET = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    if(!sessionId) return nextError(400, 'Params is Empty');

    const user = await currentUser();
    if(!user) return nextError(401, "Unauthorized");

    if(sessionId === "all"){
        const result = await db.select().from(sessionChatTable)
        .where(eq(sessionChatTable?.createdBy, user?.primaryEmailAddress?.emailAddress!))
        .orderBy(desc(sessionChatTable.id))
        return nextResponse(200, '', result);
    } else {
        const result = await db.select().from(sessionChatTable)
        .where(eq(sessionChatTable.sessionId, sessionId))
        return nextResponse(200, '', result[0]);
    }

})