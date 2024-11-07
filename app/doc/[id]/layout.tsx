
import React from 'react'
import { auth } from '@clerk/nextjs/server'
import RoomProvider from '@/components/RoomProvider';



const DocLayout = ({
    params, children
}: {
    params: Promise<{ id: string }>;
    children: React.ReactNode;
}) => {
    const { id } = React.use(params);
    auth.protect();
    return (
    <RoomProvider roomId={id}>{children}</RoomProvider>
    )
}

export default DocLayout
