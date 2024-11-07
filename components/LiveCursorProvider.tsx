'use client'
import { useMyPresence, useOthers } from '@liveblocks/react/suspense';
import React, { PointerEvent } from 'react'
import FollowPointer from './FollowPointer'

const LiveCursorProvider = ({
    children
}: {
    children: React.ReactNode
}) => {

    const [myPresence, updateMyPresence] = useMyPresence();
    const others = useOthers();

    function handelPointerMove(e: PointerEvent<HTMLDivElement>) {
        const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
        updateMyPresence({ cursor })
    }

    function handelPointerLeave() {
        updateMyPresence({
            cursor: null
        })
    }
    return (
        <div  onPointerMove={handelPointerMove}  onPointerLeave={handelPointerLeave} >
            {others.filter((other) => other.presence.cursor !== null).map(({ connectionId, info, presence }) => (
                <FollowPointer key={connectionId} info={info} x={presence.cursor!.x} y={presence.cursor!.y} />
            ))}
            {children}
        </div>
    )
}

export default LiveCursorProvider;
