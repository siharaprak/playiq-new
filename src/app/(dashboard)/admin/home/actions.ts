'use server';

import fs from 'fs';
import path from 'path';
import { createClient } from '@/utils/supabase/server';
import { sendEmail } from '@/lib/server/mailer';
import { getBetaWelcomeEmailHtml } from '@/lib/server/email-templates/beta-welcome';
import { revalidatePath } from 'next/cache';

async function enforceAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') throw new Error('Not authorized');
  return user;
}

export async function sendBetaEmailAction(data: {
  email: string;
  parentName?: string;
  teenName?: string;
  promoCode?: string;
}) {
  try {
    await enforceAdmin();

    const { email, parentName, teenName, promoCode = 'PLAYIQ2025' } = data;

    if (!email || !email.includes('@')) {
      return { success: false, error: 'Invalid email address provided.' };
    }

    const html = getBetaWelcomeEmailHtml({
      parentName,
      teenName,
      email,
      promoCode,
    });

    const pdfPath = path.resolve(process.cwd(), 'public/Parent_Setup_Guide.pdf');
    const attachments = fs.existsSync(pdfPath)
      ? [
          {
            filename: 'Parent_Setup_Guide.pdf',
            path: pdfPath,
            contentType: 'application/pdf',
          },
        ]
      : [];

    const greeting = parentName ? `${parentName}` : 'Tester';
    const subject = `Welcome to WePlayIQ Beta Testing, ${greeting}! 🚀`;

    const result = await sendEmail({
      to: email,
      subject,
      html,
      attachments,
    });

    revalidatePath('/admin/home');

    return {
      success: true,
      messageId: (result as any)?.messageId || 'sent',
      message: `Beta testing guide and welcome email sent successfully to ${email}!`,
    };
  } catch (err: any) {
    console.error('Error in sendBetaEmailAction:', err);
    return {
      success: false,
      error: err?.message || 'Failed to send beta email via Amazon SES.',
    };
  }
}
