'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "./ui/button"
import { useState, useTransition } from "react"
import { DialogClose } from "@radix-ui/react-dialog";
import { usePathname } from "next/navigation";
import { deleteDocumnent } from "@/actions/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";






export default function DeleteDocument() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();
    const router=useRouter();
    
    
    
    const handelDelete = async () => {
        const roomId = pathname.split("/").pop();
        if (!roomId) return;
        startTransition(async () => {
            const { success } = await deleteDocumnent(roomId);
            if (success) {
                setIsOpen(false);
                router.replace("/");
                toast.success("Room Deleted successfully");
            } else {

                toast.error("Fail to  Deleted Room");
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger><Button variant="destructive">Delete</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete your Document.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="sm:justify-end gap-2">
                    <Button
                   
                        variant="destructive"
                        onClick={handelDelete}
                        disabled={isPending}
                    >{isPending ? "Deleting..." : "Delete"}</Button>
                    <DialogClose asChild>
                        <Button
                            variant="secondary"
                       

                        >Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    )
}
