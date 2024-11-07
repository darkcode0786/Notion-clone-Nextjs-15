"use client"

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { db } from '@/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import React, { FormEvent, useEffect, useState, useTransition } from 'react'
import { useDocumentData } from 'react-firebase-hooks/firestore'
import Editor from './Editor';
import useOwner from '@/lib/useOwner';
import DeleteDocument from './DeleteDocument';
import InviteUser from './InviteUser';
import ManageUser from './ManageUser';
import Avatars from './Avatars';

const Document = ({ id }: { id: string }) => {
    const [data, loading, error] = useDocumentData(doc(db, "documents", id));
    const [input, setInput] = useState("");
    const [isUpdating, startTransition] = useTransition()
    const isOwner = useOwner();

    useEffect(() => {
        if (data) {
            setInput(data.title)
        }
    }, [data])

    const updateTitle = (e: FormEvent) => {
        e.preventDefault();
        if (input.trim()) {
            startTransition(async () => {
                await updateDoc(doc(db, "documents", id), {
                    title: input
                });
            });
        }

    };




    return (
        <div className='flex-1 h-full bg-white p-5 rounded-md'>
            <div className='flex justify-between max-w-6xl mx-auto pb-5' >
                <form className='flex flex-1 space-x-2 ' onSubmit={updateTitle}>
                    <Input className='bg-white' value={input} onChange={(e) => setInput(e.target.value)} />
                    <Button disabled={isUpdating} type='submit'>
                        {isUpdating ? "Updating..." : "Update"}
                    </Button>

                    {
                        isOwner && (
                            <>
                                <InviteUser />
                                <DeleteDocument />
                            </>
                        )
                    }

                </form>
            </div>
            <div className='flex justify-between items-center max-w-6xl mx-auto mb-5'>
                <ManageUser />
                <Avatars/>
            </div>
            <hr className='pb-10' />
            <Editor />
        </div>
    )
}

export default Document
