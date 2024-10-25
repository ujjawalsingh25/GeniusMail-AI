import axios from "axios";
import { auth } from "@clerk/nextjs/server";
import { waitUntil } from '@vercel/functions';
import { NextRequest, NextResponse } from "next/server";

import { db } from "@/server/db";
import { exchangeCodeForAccessToken, getAccountDetails } from "@/lib/aurinko";

export const GET = async (req: NextRequest) => {
    const {userId} = await auth();
    // console.log("UserId: ", userId);
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // params = http://localhost:3000/api/aurinko/callback?code=erssf...&requestId=6fd4...&status=success&type=accountAuthResult
    const params = req.nextUrl.searchParams
    const status = params.get('status');
    if (status !== 'success') return NextResponse.json({ error: "Account connection failed" }, { status: 400 });

    // Get the code to exchange for the access token
    const code = params.get('code');
    if (!code) return NextResponse.json({ message: "No code provided" }, { status: 400 });
    const token = await exchangeCodeForAccessToken(code as string)
    if (!token) return NextResponse.json({ error: "Failed to exchange code for access token" }, { status: 400 });

    const accountDetails = await getAccountDetails(token.accessToken)
    await db.account.upsert({               // upsert -> update and insert
        where: { 
            id: token.accountId.toString() 
        },
        update: {
            accessToken: token.accessToken,
        },
        create: {
            id: token.accountId.toString(),
            userId,
            emailAddress: accountDetails.email,
            name: accountDetails.name,
            accessToken: token.accessToken,
        },
    })

    // Trigger initial sync endpoint
    waitUntil(
        axios.post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, { 
            accountId: token.accountId.toString(), 
            userId 
        }).then(response => {
            console.log('Initial sync triggered', response.data)
        }).catch(error => {
            console.log('Failed to triggered initial sync', error)
        })
    )

    return NextResponse.redirect(new URL('/mail', req.url));
}