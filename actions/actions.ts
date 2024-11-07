"use server";

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";




export async function createNewDocument() {
    auth.protect();

    const { sessionClaims } = await auth();
    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "New Doc"
    })
    await adminDb.collection('users').doc(sessionClaims?.email!).collection('rooms').doc(docRef.id).set({
        userId: sessionClaims?.email!,
        role: "owner",
        createdAt: new Date(),
        roomId: docRef.id,
    })
    return { docId: docRef.id };
}

export async function deleteDocumnent(roomId: string) {
    auth.protect();


    try {
        // delete the document reference itself 
        await adminDb.collection("documents").doc(roomId).delete();

        const query = await adminDb.collectionGroup("rooms")
            .where("roomId", "==", roomId)
            .get();

        const batch = adminDb.batch();

        // delete room reference in user collection for every user in the room

        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        })

        await batch.commit();

        // delete room from the live blocks 
        await liveblocks.deleteRoom(roomId);

        return { success: true }

    } catch (error) {
        console.error(error);
        return { success: false }
    }
}



export async function inviteUserToDocument(roomId: string, email: string) {
    auth.protect();
    console.log("inviteUserToDocument", roomId, email);
    try {

        await adminDb
            .collection("users")
            .doc(email)
            .collection("rooms")
            .doc(roomId)
            .set({
                userId: email,
                role: "editor",
                createdAt: new Date(),
                roomId,
            });
        return { success: true };

    } catch (error) {
        console.error(error);
        return { success: false };

    }
}



export default async function removeUserFromDocument(roomId:string,email:string) {
    auth.protect();
    console.log("removeUserFromDocument", roomId, email);
    try {

        await adminDb
            .collection("users")
            .doc(email)
            .collection("rooms")
            .doc(roomId)
            .delete();

        return { success: true };

    } catch (error) {
        console.error(error);
        return { success: false };

    }
}

 
