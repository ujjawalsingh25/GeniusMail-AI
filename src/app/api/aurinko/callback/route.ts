// import { getAccountDetails, getAurinkoToken } from "@/lib/aurinko";
// import { waitUntil } from '@vercel/functions'
// import { db } from "@/server/db";
// import { auth } from "@clerk/nextjs/server";
// import axios from "axios";
// import { type NextRequest, NextResponse } from "next/server";


// export const GET = async (req: NextRequest) => {
//     const { userId } = await auth()
//     if (!userId) return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });

//     const params = req.nextUrl.searchParams
//     const status = params.get('status');
//     if (status !== 'success') return NextResponse.json({ error: "Account connection failed" }, { status: 400 });

//     const code = params.get('code');
//     const token = await getAurinkoToken(code as string)
//     if (!token) return NextResponse.json({ error: "Failed to fetch token" }, { status: 400 });
//     const accountDetails = await getAccountDetails(token.accessToken)
    // await db.account.upsert({
    //     where: { id: token.accountId.toString() },
    //     create: {
    //         id: token.accountId.toString(),
    //         userId,
    //         token: token.accessToken,
    //         provider: 'Aurinko',
    //         emailAddress: accountDetails.email,
    //         name: accountDetails.name
    //     },
    //     update: {
    //         token: token.accessToken,
    //     }
    // })
    // waitUntil(

    //     axios.post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, { accountId: token.accountId.toString(), userId }).then((res) => {
    //         console.log(res.data)
    //     }).catch((err) => {
    //         console.log(err.response.data)
    //     })
    // )

    // return NextResponse.redirect(new URL('/mail', req.url))
// }
// --------------------------------------------

import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
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
        where: { id: token.accountId.toString() },
        create: {
            id: token.accountId.toString(),
            userId,
            emailAddress: accountDetails.email,
            name: accountDetails.name,
            accessToken: token.accessToken,
        },
        update: {
            accessToken: token.accessToken,
        }
    })
    // waitUntil(

    //     axios.post(`${process.env.NEXT_PUBLIC_URL}/api/initial-sync`, { accountId: token.accountId.toString(), userId }).then((res) => {
    //         console.log(res.data)
    //     }).catch((err) => {
    //         console.log(err.response.data)
    //     })
    // )

    return NextResponse.redirect(new URL('/mail', req.url));

}