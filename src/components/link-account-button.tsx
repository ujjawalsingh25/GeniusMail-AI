"use client"
import React from 'react'
import { Button } from './ui/button';
import { getAurinkoAuthUrl } from '@/lib/aurinko';

const LinkAccountButton = () => {
  return (
    <Button onClick={async () => {
        const authUrl = await getAurinkoAuthUrl('Google')
        // const authUrl = await getAurinkoAuthUrl('Zoho')
        window.location.href = authUrl
        console.log(authUrl);
    }}>
        Link Account
    </Button>
  )
}

export default LinkAccountButton
