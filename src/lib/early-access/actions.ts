'use server';

import { z } from 'zod';
import { createClient } from '@supabase/supabase-js';
import { after } from 'next/server';
import { sendEmail } from '@/lib/server/mailer';
import {
  getEarlyAccessConfirmationEmailHtml,
  getEarlyAccessConfirmationEmailText,
} from '@/lib/server/email-templates/early-access-confirmation';
import { EARLY_ACCESS_CONSENT_TEXT, type EarlyAccessState } from './constants';

const LeadSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please enter a valid parent or guardian email.'),
  sourcePath: z.string().trim().max(200).optional(),
  trigger: z.enum(['timer', 'scroll', 'exit_intent']).optional(),
  // Honeypot — real users never fill this in
  company: z.string().max(0).optional(),
});

function getSiteUrl() {
  return (process.env.NEXT_PUBLIC_APP_URL || 'https://weplayiq.com').replace(/\/$/, '');
}

export async function submitEarlyAccessLead(
  _prev: EarlyAccessState,
  formData: FormData
): Promise<EarlyAccessState> {
  const parsed = LeadSchema.safeParse({
    email: formData.get('email') ?? '',
    sourcePath: (formData.get('sourcePath') as string) || undefined,
    trigger: (formData.get('trigger') as string) || undefined,
    company: (formData.get('company') as string) || undefined,
  });

  if (!parsed.success) {
    // Pretend success for bots that filled the honeypot
    if (parsed.error.issues.some((i) => i.path[0] === 'company')) {
      return { status: 'success', message: '' };
    }
    return { status: 'error', message: parsed.error.issues[0]?.message ?? 'Please check your email and try again.' };
  }

  const { email, sourcePath, trigger } = parsed.data;

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const now = new Date().toISOString();

    const { data: existing } = await supabaseAdmin
      .from('early_access_leads')
      .select('id, status, unsubscribe_token, confirmation_sent_at')
      .ilike('email', email)
      .limit(1)
      .maybeSingle();

    let leadId: string;
    let unsubscribeToken: string;
    let alreadyConfirmed = false;

    if (existing) {
      leadId = existing.id;
      unsubscribeToken = existing.unsubscribe_token;
      alreadyConfirmed = !!existing.confirmation_sent_at && existing.status !== 'unsubscribed';
      const { error } = await supabaseAdmin
        .from('early_access_leads')
        .update({
          // Re-subscribing re-opts in; never downgrade an "applied" lead.
          status: existing.status === 'applied' ? 'applied' : 'interested',
          consent_text: EARLY_ACCESS_CONSENT_TEXT,
          consented_at: now,
          unsubscribed_at: null,
          updated_at: now,
        })
        .eq('id', existing.id);
      if (error) throw error;
    } else {
      const { data, error } = await supabaseAdmin
        .from('early_access_leads')
        .insert({
          email,
          source: 'popup',
          source_path: sourcePath || null,
          trigger: trigger || null,
          consent_text: EARLY_ACCESS_CONSENT_TEXT,
          consented_at: now,
        })
        .select('id, unsubscribe_token')
        .single();
      if (error) throw error;
      leadId = data.id;
      unsubscribeToken = data.unsubscribe_token;
    }

    // Immediate confirmation email (skip if we already sent one to an active lead).
    // Sent after the response so the visitor isn't kept waiting on email delivery.
    if (!alreadyConfirmed) {
      const siteUrl = getSiteUrl();
      const unsubscribeUrl = `${siteUrl}/api/early-access/unsubscribe?token=${unsubscribeToken}`;
      after(async () => {
        try {
          await sendEmail({
            to: email,
            subject: 'You’re one step closer to PlayIQ Early Access',
            html: getEarlyAccessConfirmationEmailHtml({ siteUrl, unsubscribeUrl }),
            text: getEarlyAccessConfirmationEmailText({ siteUrl, unsubscribeUrl }),
            fromName: process.env.EARLY_ACCESS_FROM_NAME || 'PlayIQ Early Access',
            fromEmail: process.env.EARLY_ACCESS_FROM_EMAIL || 'hello@weplayiq.com',
            replyTo: process.env.EARLY_ACCESS_REPLY_TO || 'support@weplayiq.com',
          });
          await supabaseAdmin
            .from('early_access_leads')
            .update({ confirmation_sent_at: new Date().toISOString() })
            .eq('id', leadId);
        } catch (mailErr) {
          // Lead is saved; email delivery problems never fail the signup.
          console.error('[EarlyAccess] Confirmation email failed:', mailErr);
        }
      });
    }

    return { status: 'success', message: '' };
  } catch (err) {
    console.error('[EarlyAccess] Lead capture failed:', err);
    return { status: 'error', message: 'We couldn’t save your request. Please try again in a moment.' };
  }
}
