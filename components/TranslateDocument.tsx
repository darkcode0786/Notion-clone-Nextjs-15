'use client'
import * as Y from "yjs";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import Markdown from 'react-markdown'
import { Button } from "./ui/button"
import React, { FormEvent, useState, useTransition } from "react"
import { BotIcon, Languages } from "lucide-react";
import { toast } from "sonner";

type Language = | "english" | "spanish" | "portuguese" | "french" | "german" | "chinese" | "arabic" | "hindi" | "russian" | "japanese";

const languages: Language[] = [
    "english"
    , "spanish"
    , "portuguese"
    , "french"
    , "german"
    , "chinese"
    , "arabic"
    , "hindi"
    , "russian"
    , "japanese",
]


function TranslateDocument({ doc }: { doc: Y.Doc }) {

    const [isOpen, setIsOpen] = useState(false);
    const [language, setLanguage] = useState<string>("");
    const [summary, setSummary] = useState("");
    const [question, setQuestion] = useState("");


    const [isPending, startTransition] = useTransition();

    const handleAskQuestion = (e: FormEvent) => {
        e.preventDefault();
        startTransition(async () => {
            const documentData = doc.get('document-store').toJSON();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
                {
                    method:'POST',
                    headers:{
                        "content-Type":"application/json"
                    },
                    body:JSON.stringify({
                        documentData,
                        targetLang:language,
                    }),
                }
            )

            if(res.ok){
                
                const {translated_text}=await res.json();
                setSummary(translated_text);
                toast.success("Translated summary successfully!")
            }
        })
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen} >
            <DialogTrigger><Button variant="outline"> <Languages /> Translate</Button></DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Translate the Document</DialogTitle>
                    <DialogDescription>
                        Select a languge and AI will translate a summary of the document in the selected language.
                    </DialogDescription>
                    <hr className="mt-5" />
                    {question && <p className="mt-5 text-gray-500">Q: {question}</p>}
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
                    <Select value={language}
                        onValueChange={(value) => setLanguage(value)}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a Language" />
                        </SelectTrigger>
                        <SelectContent>
                            {languages.map((language) => (
                                <SelectItem key={language} value={language}>
                                    {language.charAt(0).toUpperCase() + language.slice(1)}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button
                        type="submit"
                        variant="outline"
                        disabled={!language || isPending}
                    >{isPending ? "Translating..." : "Translate"}</Button>

                </form>

            </DialogContent>
        </Dialog>
    )
}

export default TranslateDocument