'use client';

import { readStreamableValue } from 'ai/rsc';
import { Text } from '@tiptap/extension-text';
import { StarterKit } from '@tiptap/starter-kit';
import AiComposeButton from './ai-compose-button';
import React, { useEffect, useState } from 'react';
import { EditorContent, useEditor } from '@tiptap/react';

import TagInput from './tag-input';
import { generate } from './action';
import EditorMenuBar from './editor-menubar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

type Props = {
    toValues: { label: string, value: string }[];
    setToValues: (value: {label: string, value: string }[]) => void;
    ccValues: { label: string, value: string }[];
    setCcValues: (value: {label: string, value: string }[]) => void;

    subject: string;
    setSubject: (value: string) => void;
    to: string[]
    handleSend: (value: string) => void;
    isSending: boolean;

    defaultToolbarExpand?: boolean;
}

const EmailEditor = ({
    subject, 
    setSubject, 
    toValues, 
    setToValues, 
    ccValues, 
    setCcValues, 
    to, 
    handleSend, 
    isSending, 
    defaultToolbarExpand
}: Props) => {
    const [value, setValue] = useState<string>('')
    // const [expanded, setExpanded] = useState<boolean>(defaultToolbarExpand);
    const [expanded, setExpanded] = useState(defaultToolbarExpand ?? false);
    const [token, setToken] = useState<string>('')

    const aiGenerate = async (value: string) => {
        const { output } = await generate(value)
        for await (const token of readStreamableValue(output)) {
            if (token) {
                setToken(token);
            }
        }
    }    

    const customText = Text.extend({
        addKeyboardShortcuts() {
            return {
                "Meta-j": () => {           // control+'j' -->> it will automatically writes the suggestion
                    // console.log('Meta-j')
                    aiGenerate(this.editor.getText());
                    return true;
                },
            };
        },
    });

    const editor = useEditor({
        autofocus: false,
        extensions: [StarterKit, customText],
        editorProps: {
            attributes: {
                placeholder: "Write your email here..."
            }
        },
        onUpdate: ({ editor }) => {
            setValue(editor.getHTML())
        }
    });
    if(!editor) return null;

    // useEffect(() => {
    //     editor?.commands?.insertContent(token);
    // }, [token, editor]);
    
    const onGenerate = (token: string) => {
        // console.log(token);
        editor?.commands?.insertContent(token)
    }
    

    return (
        <div>
            <div className="flex p-4 py-2 border-b">
                <EditorMenuBar editor={editor} />
            </div>

            <div className="p-4 pb-0 space-y-2">
                {expanded && (
                    <>
                        <TagInput 
                            label="To" 
                            onChange={setToValues} 
                            placeholder="Add Recipients" 
                            value={toValues} 
                        />
                        <TagInput 
                            label="Cc" 
                            placeholder="Add Recipients" 
                            onChange={setCcValues} 
                            value={ccValues} 
                        />
                        <Input 
                            className="w-full" 
                            id="subject" 
                            placeholder="Subject" 
                            value={subject} 
                            onChange={e => setSubject(e.target.value)} 
                        />
                    </>
                )}
                <div className="flex items-center gap-2">
                    <div className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
                        <span className="text-green-600 font-medium">
                            Draft{' '}
                        </span>
                        <span>
                            to {to.join(', ')}
                        </span>
                    </div>
                    <AiComposeButton 
                        isComposing={defaultToolbarExpand}
                        onGenerate={onGenerate}
                    />
                </div>
            </div>

            <div className="prose w-full px-4">
                <EditorContent value={value} editor={editor} placeholder="Write your email here..." />
            </div>
            <Separator />

            <div className="py-3 px-4 flex items-center justify-between">
                <span className="text-sm">
                    Tip: Press{" "}
                    <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800
                         bg-gray-100 border border-gray-200 rounded-lg">
                        Cmd + J
                    </kbd>{" "}
                    for AI autocomplete
                </span>
                <Button 
                    onClick={async () => {
                        editor?.commands?.clearContent(); 
                        await handleSend(value)
                    }}
                    disabled={isSending}
                >
                    Send
                </Button>
            </div>
            
        </div>
    )
}

export default EmailEditor;