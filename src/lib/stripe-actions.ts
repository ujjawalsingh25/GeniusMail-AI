'use server'

import { stripe } from "./stripe";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { db } from "@/server/db";

export async function createCheckoutSession() {
    const { userId } = await auth();
    if (!userId) { throw new Error('User not found')}

    const session = await stripe.checkout.sessions.create({
        payment_method_types: [
            'card', 
            'paypal', 
            'amazon_pay',   
            // 'samsung_pay'
        ],
        line_items: [
            {
                price: process.env.STRIPE_PRICE_ID,
                quantity: 1,
            },
        ],
        mode: 'subscription',
        success_url: `${process.env.NEXT_PUBLIC_URL}/mail`,
        cancel_url: `${process.env.NEXT_PUBLIC_URL}/mail`,
        client_reference_id: userId.toString(),
    });

    redirect(session.url as string);
}


export async function createBillingPortalSession() {
    const { userId } = await auth();
    if (!userId) return false

    const subscription = await db.stripeSubscription.findUnique({
        where: { userId: userId },
    });
    if (!subscription?.customerId) throw new Error('Subscription not found');

    const session = await stripe.billingPortal.sessions.create({
        customer: subscription.customerId,
        return_url: `${process.env.NEXT_PUBLIC_URL}/mail`,
    });
    redirect(session.url as string)
}


export async function getSubscriptionStatus() {
    const { userId } = await auth();
    if (!userId)  return false
    const subscription = await db.stripeSubscription.findUnique({
        where: { userId: userId },
    });
    if (!subscription) {
        return false;
    }
    return subscription.currentPeriodEnd > new Date();
}

