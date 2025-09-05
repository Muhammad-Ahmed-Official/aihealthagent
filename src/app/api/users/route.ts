import { db } from "@/config/db";
import { usersTable } from "@/config/schema";
import { asyncHandler } from "@/utils/AsyncHandler";
import { nextResponse } from "@/utils/Responses";
import { currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

export const POST = asyncHandler(async (request:NextRequest):Promise<NextResponse> => {
    const user = await currentUser();

    const users = await db.select().from(usersTable)
    .where(eq(usersTable?.email, user?.primaryEmailAddress?.emailAddress!))
    if(users?.length === 0){
        const result = await db?.insert(usersTable).values({
            name: user?.fullName!,
            email: user?.primaryEmailAddress?.emailAddress!,
            credits: 10,
        }).returning()
        return nextResponse(201, "Account created Successfully", result)
    }
    return nextResponse(200, '', users[0]);
})