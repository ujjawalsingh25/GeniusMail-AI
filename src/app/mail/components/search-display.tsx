'use client'

import { toast } from 'sonner';
import { useAtom } from 'jotai';
import DOMPurify from 'dompurify';
import { Loader2 } from 'lucide-react';
import React, { useEffect } from 'react';

import { api } from '@/trpc/react';
import useThreads from '@/hooks/use-threads';
import { useDebounceValue } from 'usehooks-ts';
import { isSearchingAtom, searchValueAtom } from './search-bar';

const SearchDisplay = () => {
    const [searchValue, setSearchValue] = useAtom(searchValueAtom)
    const [isSearching, setIsSearching] = useAtom(isSearchingAtom)
    const search = api.account.searchEmails.useMutation()

    const [debouncedSearchValue] = useDebounceValue(searchValue, 500)
    const { accountId } = useThreads()

    useEffect(() => {
        if (!accountId) return
        search.mutate({ 
            accountId, 
            query: debouncedSearchValue 
        })
    }, [debouncedSearchValue, accountId])

    return (
        <div className="p-4 max-h-[calc(100vh-50px)] overflow-y-scroll">
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-gray-600 text-sm dark:text-gray-400">
                    Your search for "{searchValue}" came back with...
                </h2>
                {search.isPending && <Loader2 className="size-4 animate-spin text-gray-400" />}
            </div>
            {search.data?.hits.length === 0 
            ? (
                <p>No results found</p>
            ) : (
                <ul className="flex flex-col gap-2">
                    {search.data?.hits.map((hit) => (
                        <li 
                            key={hit.id} 
                            className="border list-none rounded-md p-4 hover:bg-gray-100 
                                cursor-pointer transition-all dark:hover:bg-gray-900"
                        >
                            <h3 className="text-base font-medium">
                                {hit.document.subject}
                            </h3>
                            <p className="text-sm text-gray-500">
                                From: {hit.document.from}
                            </p>
                            <p className="text-sm text-gray-500">
                                To: {hit.document.to.join(", ")}
                            </p>
                            <p 
                                className="text-sm mt-2" 
                                dangerouslySetInnerHTML={{
                                    __html: DOMPurify.sanitize(hit.document.rawBody, { 
                                        USE_PROFILES: { html: true } 
                                    }) 
                                }} 
                            />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default SearchDisplay;