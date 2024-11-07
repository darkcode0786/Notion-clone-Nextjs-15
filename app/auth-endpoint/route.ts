'use server'

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        // Protect the route (ensure user is authenticated)
        await auth.protect();

        // Get the session claims (user info)
        const { sessionClaims } = await auth();

        // Check if sessionClaims is available (important for type safety)
        if (!sessionClaims || !sessionClaims.email) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        // Get the room data from the request body
        const { room } = await req.json();

        // Prepare the session for the user in the liveblocks service
        const session = liveblocks.prepareSession(sessionClaims.email, {
            userInfo: {
                name: sessionClaims.fullName || '',
                email: sessionClaims.email,
                avatar: sessionClaims.image || '',
            }
        });

        // Fetch users in the room
        const usersInRoom = await adminDb
            .collectionGroup("rooms")
            .where("userId", "==", sessionClaims.email)
            .get();

        // Find if the user is in the specified room
        const userInRoom = usersInRoom.docs.find(doc => doc.id === room);

        // If the user is in the room, allow access
        if (userInRoom?.exists) {
            session.allow(room, session.FULL_ACCESS);
            const { body, status } = await session.authorize();

            return new Response(body, { status });
        } else {
            // If the user is not in the room, return an error
            return NextResponse.json(
                { message: "You are not in the room" },
                { status: 403 }
            );
        }

    } catch (error) {
        // Catch and return any error that occurs
        console.error(error);
        return NextResponse.json(
            { message: "Internal Server Error", error: "Unknown error occurred"},
            { status: 500 }
        );
    }
}
