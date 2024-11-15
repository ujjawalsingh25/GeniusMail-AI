'use client';

import React from 'react'
import { format } from 'date-fns';
import { Archive, ArchiveX, Clock, MoreVertical, Trash2 } from 'lucide-react';

import EmailDisplay from './emial-display';
import useThreads from '@/hooks/use-threads';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import ReplyBox from './reply-box';

const ThreadDisplay = () => {
    const { threadId, threads } = useThreads()
    const thread = threads?.find(t => t.id === threadId)

  return (
    <div className="flex flex-col h-full">
        {/* Button Row */}
        <div className="flex items-center p-2">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" disabled={!thread}>
                    <Archive className="w-4 h-4" />
                    {/* <span className="sr-only">Archive</span> */}
                </Button>
                <Button variant="ghost" size="icon" disabled={!thread}>
                    <ArchiveX className="w-4 h-4" />
                    {/* <span className="sr-only">Move to junk</span> */}
                </Button>
                <Button variant="ghost" size="icon" disabled={!thread}>
                    <Trash2 className="w-4 h-4" />
                    <span className="sr-only">Move to trash</span>
                </Button>
            </div>    
            <Separator orientation="vertical" className="h-6 mx-1" />
            <Button className='ml-2' variant="ghost" size="icon" disabled={!thread}>
                <Clock className="w-4 h-4" />
                {/* <span className="sr-only">Snooze</span> */}
            </Button>
            <div className="flex items-center ml-auto">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button className='ml-2' variant="ghost" size="icon" disabled={!thread}>
                            <MoreVertical className="w-4 h-4" />
                            <span className="sr-only">More</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end"> 
                        <DropdownMenuItem>Mark as unread</DropdownMenuItem>
                        <DropdownMenuItem>Star thread</DropdownMenuItem>
                        <DropdownMenuItem>Add label</DropdownMenuItem>
                        <DropdownMenuItem>Mute thread</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
        <Separator />

        {thread ? (
          <div className="flex flex-col flex-1 overflow-scroll">
            <div className="flex items-start p-4">
                <div className="flex items-start gap-4 text-sm">
                    <Avatar>
                    <AvatarImage alt='avatar' />
                    <AvatarFallback>
                        {thread?.emails[0]?.from?.name?.split(" ")
                        .map((chunk) => chunk[0])
                        .join("")}
                    </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                        <div className="font-semibold">{thread.emails[0]?.from?.name}</div>
                        <div className="text-xs line-clamp-1">{thread.emails[0]?.subject}</div>
                        <div className="text-xs line-clamp-1">
                            <span className="font-medium">Reply-To:</span> {thread.emails[0]?.from?.address}
                        </div>
                    </div>
                </div>

                {thread.emails[0]?.sentAt && (
                    <div className="ml-auto text-xs text-muted-foreground">
                        {format(new Date(thread.emails[0].sentAt), "PPpp")}
                    </div>
                )}
            </div>
            <Separator />

            <div className="max-h-[calc(100vh-500px)] overflow-scroll flex flex-col">
              <div className="p-6 flex flex-col gap-4">
                {thread.emails.map(email => {
                  return <EmailDisplay key={email.id} email={email} />
                })}
              </div>
            </div>
            <div className="flex-1"></div>
            <Separator className="mt-auto" />
            {/* ReplyBox */}
            <ReplyBox />
          </div>
        ) : (
          <>
            <div className="p-8 text-center text-muted-foreground">
              No message selected {threadId}
            </div>
          </>
        )}
    </div>    
  )
}

export default ThreadDisplay;
