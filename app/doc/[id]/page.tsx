'use client';
import Document from "@/components/Document";
import React from 'react';

function DocumentPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    // Unwrap the params using React.use
    const { id } = React.use(params);

    if (!id) {
        return <div>Error: Document ID is required.</div>; // Handle missing ID case
    }

    return (
        <div className="flex flex-col flex-1 min-h-screen">
            <Document id={id} />
        </div>
    );
}

export default DocumentPage;
