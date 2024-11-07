'use client'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "./ui/input";
import { Button } from "./ui/button"
import { FormEvent, useState, useTransition } from "react"
import { usePathname } from "next/navigation";
import { inviteUserToDocument } from "@/actions/actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";






export default function InviteUser() {
    const [isOpen, setIsOpen] = useState(false);
    const [email, setEmail] = useState("");
    const [isPending, startTransition] = useTransition();
    const pathname = usePathname();



    const handleInvite = async (e: FormEvent) => {
        e.preventDefault();

        const roomId = pathname.split("/").pop();
        if (!roomId) return;
        startTransition(async () => {
            const { success } = await inviteUserToDocument(roomId, email);
            if (success) {
                setIsOpen(false);
                setEmail("");
                toast.success("User Invite successfully");
            } else {
                toast.error("Fail to Invite User!");
            }
        })
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger><Button variant="outline">Invite</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite a User to collaborate!</DialogTitle>
                    <DialogDescription>
                        Enter the email of the user you want to invite.

                    </DialogDescription>
                </DialogHeader>
                <form className="flex gap-2" onSubmit={handleInvite}>
                    <Input
                        type="email" value={email}
                        className="w-full"
                        onChange={(e) => setEmail(e.target.value)} placeholder="Enter Email " />
                    <Button
                        type="submit"
                        variant="outline"
                        disabled={!email || isPending}
                    >{isPending ? "Inviting..." : "Invite"}</Button>

                </form>
               
            </DialogContent>
        </Dialog>

    )
}
