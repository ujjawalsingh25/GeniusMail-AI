'use client';

import React, { useEffect, useState } from 'react'
import EmailEditor from './email-editor';
import useThreads from '@/hooks/use-threads';
import { api, RouterOutputs } from '@/trpc/react';
import { toast } from 'sonner';

const ReplyBox = () => {
    const { threadId, accountId } = useThreads()
    const { data: replyDetails } = api.account.getReplyDetails.useQuery({
        threadId: threadId ?? '',
        accountId
    })
    if (!replyDetails) return null;
    return <Component replyDetails={replyDetails} />
}

const Component = ({ replyDetails }: { replyDetails: RouterOutputs['account']['getReplyDetails'] }) => {
    const { threadId, accountId } = useThreads()
    const [subject, setSubject] = useState(
        replyDetails.subject.startsWith('Re:') ? replyDetails.subject : `Re: ${replyDetails.subject}`
    );
    const [toValues, setToValues] = useState<{ label: string, value: string }[]>(
        replyDetails.to.map(to => ({ label: to.address ?? to.name, value: to.address })) || []
    )
    const [ccValues, setCcValues] = useState<{ label: string, value: string }[]>(
        replyDetails.cc.map(cc => ({ label: cc.address ?? cc.name, value: cc.address })) || []
    )

    useEffect(() => {
        if (!replyDetails || !threadId) return;

        if (!replyDetails.subject.startsWith('Re:')) {
            setSubject(`Re: ${replyDetails.subject}`)
        } else {
            setSubject(replyDetails.subject)
        }
        setToValues(replyDetails.to.map(to => ({ label: to.address ?? to.name, value: to.address })))
        setCcValues(replyDetails.cc.map(cc => ({ label: cc.address ?? cc.name, value: cc.address })))

    }, [threadId, replyDetails]);

    const sendEmail = api.account.sendEmail.useMutation()

    const handleSend = async (value: string) => {
        if (!replyDetails) return;
        sendEmail.mutate({
            accountId,
            threadId: threadId ?? undefined,
            body: value,
            subject,
            from: replyDetails.from,
            to: replyDetails.to.map(to => ({ name: to.name ?? to.address, address: to.address })),
            cc: replyDetails.cc.map(cc => ({ name: cc.name ?? cc.address, address: cc.address })),
            replyTo: replyDetails.from,
            inReplyTo: replyDetails.id,
        }, {
            onSuccess: () => {
                toast.success("Email sent")
            },
            onError: (error) =>{
                console.log(error);
                toast.error('Error sending email');
            }
        })
    }

    return (
        <EmailEditor 
            toValues={toValues}
            setToValues={setToValues}
            
            ccValues={ccValues}
            setCcValues={setCcValues}
            
            subject={subject}
            setSubject={setSubject}

            to={replyDetails.to.map(to => to.address)}
            handleSend={handleSend}
            isSending={sendEmail.isPending}
        />
    )
}

export default ReplyBox;
