"use client";

import { createNewDocument } from "@/actions/actions";
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { useTransition } from "react"

function NewDocumentBtn() {
      const [isPending, startTransition] = useTransition();
      const router = useRouter();
      const handleCreateNewDocument = () => {
            startTransition(async () => {
                  const { docId } = await createNewDocument();
                  router.push(`/doc/${docId}`)
            });
      };


      return <Button onClick={handleCreateNewDocument} disabled={isPending}>
            {isPending ? "creating..." : "New Document"}
      </Button>
}

export default NewDocumentBtn;