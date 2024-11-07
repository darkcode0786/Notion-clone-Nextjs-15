'use client'
import * as Y from "yjs";
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
import { toast } from "sonner";
import { BotIcon, MessageCircleCode } from "lucide-react";
import Markdown from "react-markdown";

function ChatToDocument({ doc }: { doc: Y.Doc }) {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [summary, setSummary] = useState("")
    const [question, setQuestion] = useState("")
    const [isPending, startTransition] = useTransition();


    const handleAskQuestion = (e: FormEvent) => {
        e.preventDefault();
        setQuestion(input);

        startTransition(async () => {
            const documentData = doc.get('document-store').toJSON();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/chatToDocument`,
                {
                    method: 'POST',
                    headers: {
                        "content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        documentData,
                        question: input,
                    }),
                }
            )

            if (res.ok) {

                const { message } = await res.json();
                setSummary(message);
                toast.success("Question askes successfully!")
            }
        })

    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <Button asChild variant="outline"><DialogTrigger><MessageCircleCode className="mr-1" />Chat to Document</DialogTrigger></Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Chat to Document!</DialogTitle>
                    <DialogDescription>
                        Ask a question and chat to the document with AI.
                    </DialogDescription>

                    <hr className="mt-5" />

                    {
                        question && <p className="mt-5 text-gray-500">Q: {question}</p>
                    }
                </DialogHeader>

                {
                    summary && (
                        <div className="flex flex-col items-start max-h-96 overflow-y-scroll gap-2 p-5 bg-gray-100 rounded-md">
                            <div className="flex">
                                <BotIcon className="w-10 flex-shrink-0" />
                                <p className="font-bold">
                                    GPT {isPending ? "is thinking..." : "Says:"}
                                </p>
                            </div>
                            <p>{isPending ? "Thinking..." : <Markdown>{summary}</Markdown>}</p>
                        </div>
                    )
                }



                <form className="flex gap-2" onSubmit={handleAskQuestion}>
                    <Input
                        type="text" value={input}
                        className="w-full"
                        onChange={(e) => setInput(e.target.value)} placeholder="i.e. what is this about" />
                    <Button
                        type="submit"

                        disabled={!input || isPending}
                    >{isPending ? "Asking..." : "Ask"}</Button>

                </form>

            </DialogContent>
        </Dialog>

    )
}

export default ChatToDocument
