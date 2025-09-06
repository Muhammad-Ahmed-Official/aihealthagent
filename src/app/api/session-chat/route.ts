import { db } from "@/config/db";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextError, nextResponse } from "@/utils/Responses";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const GET = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("sessionId");
    if(!sessionId) return nextError(400, 'Params is Empty');

    const user = await currentUser();
    const result = await db.select().from(SessionChartTable)
    .where(eq(SessionChartTable.sessionId, sessionId))

    return nextResponse(200, '', result);
})