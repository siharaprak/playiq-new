'use server';

import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

import { BetaApplicationSchema, type BetaApplicationData } from './schema';

export async function submitBetaApplication(data: BetaApplicationData) {
  // Simulate network latency / Stripe checkout generation delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Validate on server
  const parsed = BetaApplicationSchema.safeParse(data);
  
  if (!parsed.success) {
    return { success: false, message: "Validation failed on the server." };
  }

  // Check capacity limits (if we hit 25, we could refuse or return a waitlist message)
  // For Phase 1C, we trust the database but do a blind explicit insert.
  
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_BETA_PRICE_ID; 

  const { data: insertData, error } = await supabaseAdmin
     .from('beta_applications')
     .insert({
       parent_full_name: parsed.data.parentFullName,
       email: parsed.data.emailAddress,
       child_age_band: parsed.data.childAge,
       shipping_zip_code: parsed.data.shippingZipCode,
       status: (stripeSecret && priceId) ? 'checkout_started' : 'pending',
       source: 'web_form'
     })
     .select();

  if (error) {
     console.error("Supabase Insertion Error:", error);
     return { success: false, message: "We encountered an issue saving your application. Please try again later." };
  }

  // Generate Stripe Checkout Session Hand-off
  const appDomain = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  if (!stripeSecret || !priceId) {
     // Fallback if Stripe isn't fully configured yet, we just bypass to success
     console.log("Stripe configuration missing. Bypassing checkout session generation.");
     return { 
       success: true, 
       message: "Application recorded. (Stripe configuration pending)"
     };
  }

  const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' as any });

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId, 
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appDomain}/signup?beta=success`,
      cancel_url: `${appDomain}/beta?canceled=true`,
      customer_email: parsed.data.emailAddress,
      // We pass the new beta application ID to Stripe so the webhook can auto-update status to 'fulfilled'
      client_reference_id: insertData ? (insertData as any)[0]?.id : undefined,
    });

    return {
      success: true,
      redirectUrl: session.url
    };
  } catch (stripeError: any) {
    console.error("Stripe Checkout Generation Failed:", stripeError);
    return { success: false, message: "Payment handler failed to initialize securely. Please try again later." };
  }
}
