'use client';

import React from 'react'
import Avatar from 'react-avatar';
import { Letter } from 'react-letter';
import { formatDistanceToNow } from 'date-fns';

import { cn } from '@/lib/utils';
import { RouterOutputs } from '@/trpc/react';
import useThreads from '@/hooks/use-threads';

type Props = {
    email: RouterOutputs['account']['getThreads'][0]['emails'][0]
}

const EmailDisplay = ({ email }: Props) => {
    const { account } = useThreads();

    const isMe = account?.emailAddress === email.from.address
    
    return (
        <div className={cn('border rounded-md p-4 cursor-pointer transition-all  hover:translate-x-2', {
            'border-l-gray-900 border-l-4': isMe
        })}>
            <div className="flex items-center justify-between gap-2">
            <div className='flex items-center gap-2'>
                    {!isMe && <Avatar name={email.from.name ?? email.from.address} email={email.from.address} size='35' textSizeRatio={2} round={true} />}
                    <span className='font-medium'>
                        {isMe ? 'Me' : email.from.address}
                    </span>
                </div>
                <p className='text-xs text-muted-foreground'>
                    {formatDistanceToNow(email.sentAt ?? new Date(), {
                        addSuffix: true,
                    })}
                </p>  
            </div>
            <div className="h-4"></div>
            <Letter className='bg-white rounded-md text-black' html={email?.body ?? ""} />
        </div>
    )
}

export default EmailDisplay;