"use client"
import React from 'react'
import { Button } from './ui/button';
import { getAurinkoAuthUrl } from '@/lib/aurinko';

const LinkAccountButton = () => {
  return (
    <Button onClick={async () => {
        // const authUrl = await getAurinkoAuthUrl('Google')
        const authUrl = await getAurinkoAuthUrl('Office365')
        // const authUrl = await getAurinkoAuthUrl('Outlook.com')
        window.location.href = authUrl
        console.log(authUrl);
    }}>
        Link Account
    </Button>
  )
}

export default LinkAccountButton
