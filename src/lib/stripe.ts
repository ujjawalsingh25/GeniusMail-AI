'server-only'
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    // apiVersion: '2024-06-20',
    apiVersion: '2024-10-28.acacia'
})

// price_1QMkn6D0d99W40GiRmIbG9nL