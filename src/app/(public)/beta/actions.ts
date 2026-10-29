'use server';

import { createClient } from '@supabase/supabase-js';

import { BetaApplicationSchema, type BetaApplicationData } from './schema';
import { sendBetaSignupNotifications } from '@/lib/server/notifications';
import { isValidBetaPromoCode, normalizePromoCode } from '@/lib/auth/promo';

export async function submitBetaApplication(data: BetaApplicationData) {
  try {
    // Simulate network latency
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Validate on server
    const parsed = BetaApplicationSchema.safeParse(data);
    
    if (!parsed.success) {
      return { success: false, message: "Validation failed on the server." };
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const rawPromoInput = parsed.data.promoCode?.trim();
    const normalizedPromo = normalizePromoCode(rawPromoInput);
    const isPromoBypass = rawPromoInput ? isValidBetaPromoCode(rawPromoInput) : false;

    // Validate promo code if provided (optional)
    if (rawPromoInput && !isPromoBypass) {
      return { 
        success: false, 
        message: "That access code is invalid. Please double-check your invite code or leave it blank to join the 100% free beta pilot." 
      };
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

    // Beta Founding Cohort is 100% FREE
    const appStatus = 'fulfilled_promo';

    if (existingApp) {
      await supabaseAdmin
        .from('beta_applications')
        .update({
          parent_full_name: parsed.data.parentFullName,
          email: cleanEmail,
          child_age_band: parsed.data.childAge,
          shipping_zip_code: 'N/A',
          status: appStatus,
        })
        .eq('id', existingApp.id);
    } else {
      const { error } = await supabaseAdmin
         .from('beta_applications')
         .insert({
           parent_full_name: parsed.data.parentFullName,
           email: cleanEmail,
           child_age_band: parsed.data.childAge,
           shipping_zip_code: 'N/A',
           status: appStatus,
           source: parsed.data.source || 'direct_traffic'
         });

      if (error) {
         console.error("Supabase Insertion Error:", error);
         return { success: false, message: "We encountered an issue saving your application. Please try again later." };
      }
    }

    // Link to Early Access popup lead (if any) for funnel tracking. Never blocks the application.
    const { error: leadLinkError } = await supabaseAdmin
      .from('early_access_leads')
      .update({ status: 'applied', updated_at: new Date().toISOString() })
      .ilike('email', cleanEmail)
      .neq('status', 'unsubscribed');
    if (leadLinkError) console.warn('[EarlyAccess] Could not mark lead as applied:', leadLinkError.message);

    // Trigger non-blocking user welcome + admin alerts
    sendBetaSignupNotifications({
      parentName: parsed.data.parentFullName,
      email: cleanEmail,
      childAge: parsed.data.childAge,
      source: parsed.data.source || 'direct_traffic',
      promoCode: normalizedPromo || 'PLAYIQ2025',
      status: 'fulfilled_promo',
    }).catch(err => console.error('Error dispatching beta notifications:', err));

    // The Beta Founding Cohort is 100% FREE ($0)
    // Directly redirect to account creation with free beta access unlocked
    return {
      success: true,
      redirectUrl: `/signup?beta=success&promo=${encodeURIComponent(normalizedPromo || 'PLAYIQ2025')}`,
      message: "Application accepted! Your 100% Free Founding Cohort spot is reserved."
    };
  } catch (err: any) {
    console.error("submitBetaApplication error:", err);
    return { success: false, message: err?.message || "An unexpected error occurred while processing your application." };
  }
}
