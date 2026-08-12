'use server';

import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { headers } from 'next/headers';

import { BetaApplicationSchema, type BetaApplicationData } from './schema';

export async function submitBetaApplication(data: BetaApplicationData) {
  // Simulate network latency / Stripe checkout generation delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  // Validate on server
  const parsed = BetaApplicationSchema.safeParse(data);
  
  if (!parsed.success) {
    return { success: false, message: "Validation failed on the server." };
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Prefer NEXT_PUBLIC_APP_URL for absolute URLs (e.g. Stripe redirects) to
  // avoid constructing a raw Cloud Run URL that bypasses Firebase's CDN and
  // gets rejected by Cloud Run IAM.
  let appDomain = (process.env.NEXT_PUBLIC_APP_URL || '').replace(/\/$/, '');
  if (!appDomain) {
    const headersList = await headers();
    // x-forwarded-host carries the original public-facing domain when running
    // behind Firebase App Hosting / Cloud Run's load balancer. Fall back to
    // host only for local dev where there is no proxy.
    const host = headersList.get('x-forwarded-host')
      || headersList.get('host')
      || 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto')
      || (host.includes('localhost') || host.includes('127.0.0.1') ? 'http' : 'https');
    appDomain = `${protocol}://${host}`;
  }

  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_BETA_PRICE_ID; 

  const promoAttempt = parsed.data.promoCode?.trim();
  const rawPromo = process.env.BETA_PROMO_CODE || 'PLAYIQ2025';
  const validPromoCode = rawPromo.trim().replace(/^["']|["']$/g, '').toUpperCase();
  const isPromoBypass = promoAttempt && promoAttempt.toUpperCase() === validPromoCode;

  // Reject invalid codes immediately — don't silently proceed
  if (promoAttempt && !isPromoBypass) {
    return { success: false, message: "That access code is invalid. Please double-check and try again." };
  }

  const cleanEmail = parsed.data.emailAddress.trim().toLowerCase();

  // Check if an application already exists for this email
  const { data: existingApp } = await supabaseAdmin
    .from('beta_applications')
    .select('id, status')
    .ilike('email', cleanEmail)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  let applicationId: string;

  if (existingApp) {
    applicationId = existingApp.id;
    const newStatus = isPromoBypass ? 'fulfilled_promo' : ((stripeSecret && priceId) ? 'checkout_started' : existingApp.status);
    await supabaseAdmin
      .from('beta_applications')
      .update({
        parent_full_name: parsed.data.parentFullName,
        email: cleanEmail,
        child_age_band: parsed.data.childAge,
        status: newStatus,
      })
      .eq('id', existingApp.id);
  } else {
    const { data: insertData, error } = await supabaseAdmin
       .from('beta_applications')
       .insert({
         parent_full_name: parsed.data.parentFullName,
         email: cleanEmail,
         child_age_band: parsed.data.childAge,
         status: isPromoBypass ? 'fulfilled_promo' : ((stripeSecret && priceId) ? 'checkout_started' : 'pending'),
         source: parsed.data.source || 'direct_traffic'
       })
       .select();

    if (error) {
       console.error("Supabase Insertion Error:", error);
       return { success: false, message: "We encountered an issue saving your application. Please try again later." };
    }
    applicationId = insertData?.[0]?.id;
  }

  // Bypass Stripe if valid promo code
  if (isPromoBypass) {
    return {
      success: true,
      redirectUrl: `/signup?beta=success`
    };
  }

  // Handle Stripe Checkout
  if (!stripeSecret || !priceId) {
     console.warn("Stripe configuration missing. Application set to pending.");
     return { 
       success: true, 
       message: "Application recorded. You have been added to our waitlist."
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
      customer_email: cleanEmail,
      client_reference_id: applicationId,
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
