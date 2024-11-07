'use client'
import React, { useEffect, useState } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { useCollection } from 'react-firebase-hooks/firestore'
import NewDocumentBtn from './NewDocumentBtn'
import { Menu } from 'lucide-react'
import { useUser } from '@clerk/nextjs'
import { collectionGroup, query, where, DocumentData } from 'firebase/firestore';
import { db } from '@/firebase';
import SidebarOption from './SidebarOption';

interface RoomDocument extends DocumentData {
    createdAt: string,
    role: "owner" | "editor",
    roomId: string,
    userId: string
}


const Sidebar = () => {
    const { user } = useUser();
    const [groupedData, setGroupedData] = useState<{
        owner: RoomDocument[];
        editor: RoomDocument[];
    }>({
        owner: [],
        editor: [],
    });

    const [data, loading, error] = useCollection(
        user && (
            query(collectionGroup(db, 'rooms'),
                where('userId', "==", user.emailAddresses[0].toString())
            )
        )

    );

    useEffect(() => {
        if (!data) {
            return;
        }

        const grouped = data.docs.reduce<{
            owner: RoomDocument[];
            editor: RoomDocument[];
        }>(
            (acc, curr) => {
                const roomData = curr.data() as RoomDocument;
                if (roomData.role === 'owner') {
                    acc.owner.push({
                        id: curr.id,
                        ...roomData,
                    });
                }
                else {
                    acc.editor.push({
                        id: curr.id,
                        ...roomData,
                    });
                }
                return acc;
            }, {
            owner: [],
            editor: [],
        }
        )
        setGroupedData(grouped);
    }, [data])


    const menuOptions = (
        <>
            <NewDocumentBtn />
            <div className='flex py-4 flex-col space-y-4 md:max-w-36 text-wrap  '>
                {
                    groupedData.owner.length === 0 ? (<h2 className='text-gray-500 font-semibold text-sm'>No documents founds!</h2>) : (
                        <>
                            <h2 className='text-gray-500 font-semibold text-sm'>My Documents</h2>
                            {
                                groupedData.owner.map((doc,i) => (
                                    <SidebarOption key={doc.id+i} id={doc.id} href={`/doc/${doc.id}`} />

                                ))
                            }
                        </>
                    )
                }

            {
                groupedData.editor.length > 0 && (
                    
                    <>
                        <h2 className='text-gray-500 font-semibold text-sm'>Shared with Me</h2>
                        {groupedData.editor.map((doc,i) => (
                            <SidebarOption key={doc.id+2*i} id={doc.id} href={`/doc/${doc.id}`} />
                        ))}
                    </>
                )
            }

            </div>

        </>
    )
    return (
        <>
            <div className='p-4  bg-slate-200 md:p-5 '>
                <div className='md:hidden'>
                    <Sheet>
                        <SheetTrigger >
                            <Menu />
                        </SheetTrigger>
                        <SheetContent side="left">
                            <SheetHeader>
                                <SheetTitle>Menu</SheetTitle>
                                <div>
                                    {menuOptions}
                                </div>
                            </SheetHeader>
                        </SheetContent>
                    </Sheet>
                </div>
                <div className='hidden md:inline'>
                    {/* <NewDocumentBtn /> */}
                    {menuOptions}
                </div>
            </div>

        </>
    )
}

export default Sidebar