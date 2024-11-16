'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Bot } from 'lucide-react';
import React, { useState } from 'react';
import { turndown } from "@/lib/turndown";

import { generateEmail } from './action';
import useThreads from '@/hooks/use-threads';
import { readStreamableValue } from 'ai/rsc';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

type Props = {
    isComposing?: boolean
    onGenerate: (token: string) => void
}

const AiComposeButton = (props: Props) => {
    const [open, setOpen] = useState(false)
    const [prompt, setPrompt] = useState('')
    const { account, threads, threadId } = useThreads()
    const thread = threads?.find(t => t.id === threadId)

    const aiGenerate = async () => {
        let context: string | undefined = ''
        if (!props.isComposing) {
            for(const email of thread?.emails ?? []) {
                const content = `
                    Subject: ${email.subject}
                    From: ${email.from}
                    Sent: ${new Date(email.sentAt).toLocaleString}
                    Body: ${turndown.turndown(email.body ?? email.bodySnippet ?? "")}                    
                `    
                context += content
            }    
        }
        context += `My name is: ${account?.name} and my email is ${account?.emailAddress}`
        const { output } = await generateEmail(context, prompt)
        for await (const token of readStreamableValue(output)) {
            if (token) {
                props.onGenerate(token);
            }
        }
    }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button 
                    onClick={() => setOpen(true)} 
                    size='icon' 
                    variant={'outline'}
                >
                    <Bot className="size-5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>AI Compose</DialogTitle>
                    <DialogDescription>
                        AI will compose an email based on the context of your previous emails.
                    </DialogDescription>
                    <div className="h-2"></div>
                    <Textarea
                        onChange={(e) => setPrompt(e.target.value)}
                        value={prompt}
                        placeholder="Enter a prompt"
                    />
                    <div className="h-2"></div>
                    <Button onClick={() => { 
                        aiGenerate(); 
                        setOpen(false); 
                        setPrompt('') 
                    }}>
                        Generate
                    </Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
  )
}

export default AiComposeButton;