'use client'
import React, { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { createBillingPortalSession, createCheckoutSession, getSubscriptionStatus } from '@/lib/stripe-actions';

const StripeButton = () => {
    const [isSubscribed, setIsSubscribed] = useState(false)
    
    useEffect(() => {
        (async () => {
            const isSubscribed = await getSubscriptionStatus()
            setIsSubscribed(isSubscribed)
        })()
    }, [])

    const handleClick = async () => {
        if (!isSubscribed) {
            await createCheckoutSession()
        } else {
            await createBillingPortalSession()
        }
    }
    return (
        <Button 
            variant={'outline'} 
            size='lg' 
            onClick={handleClick}
        >
            {isSubscribed ? 'Manage Subscription' : 'Upgrade Plan'}
        </Button>
    )
}

export default StripeButton