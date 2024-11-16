'use client'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Pencil } from "lucide-react";
import React, { useState } from 'react';

import EmailEditor from "./email-editor";
import { Button } from "@/components/ui/button"


const ComposeButton = () => {
    const [toValues, setToValues] = useState<{ label: string; value: string; }[]>([])
    const [ccValues, setCcValues] = useState<{ label: string; value: string; }[]>([])
    const [subject, setSubject] = useState<string>('')

    const handleSend = async (value: string) => {
        console.log('value', value);
    }
   


    return (
        <Drawer>
            <DrawerTrigger asChild>
                <Button>
                    <Pencil className='size-4 mr-1' />
                    Compose
                </Button>
            </DrawerTrigger>
            <DrawerContent className="">
                <DrawerHeader>
                    <DrawerTitle>Compose Email</DrawerTitle>
                    <EmailEditor
                        toValues={toValues}
                        setToValues={setToValues}
                        ccValues={ccValues}
                        setCcValues={setCcValues}

                        subject={subject}
                        setSubject={setSubject}

                        to={toValues.map(to => to.value)}
                        handleSend={handleSend}
                        isSending={false}

                        defaultToolbarExpand={true}
                    />
                </DrawerHeader>
            </DrawerContent>
        </Drawer>
    )
}

export default ComposeButton