import fs from 'fs';
import path from 'path';
import { sendEmail } from './mailer';
import {
  ADMIN_NOTIFICATION_EMAILS,
  getBetaSignupAdminNotificationHtml,
  getApprenticeCreatedAdminNotificationHtml,
  getApprenticeCreatedParentEmailHtml,
} from './email-templates/notifications';
import { getBetaWelcomeEmailHtml } from './email-templates/beta-welcome';

/**
 * Dispatches both User Welcome Email (with PDF guide) and Admin Alerts on Beta Application / Signup
 */
export async function sendBetaSignupNotifications(data: {
  parentName: string;
  email: string;
  childAge?: string;
  source?: string;
  promoCode?: string;
  status?: string;
}) {
  const { parentName, email, childAge, source, promoCode = 'PLAYIQ2025', status } = data;

  // 1. Send User Confirmation / Welcome Email with PDF guide attached
  try {
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

    const userHtml = getBetaWelcomeEmailHtml({
      parentName,
      email,
      promoCode,
    });

    await sendEmail({
      to: email,
      subject: `Welcome to WePlayIQ Beta Testing, ${parentName || 'Parent'}! 🚀`,
      html: userHtml,
      attachments,
    });
    console.log(`[Notification] Beta welcome email dispatched to user: ${email}`);
  } catch (userErr) {
    console.error(`[Notification Error] Failed to send beta welcome email to user ${email}:`, userErr);
  }

  // 2. Send Admin Alert to the specified team emails
  try {
    const adminHtml = getBetaSignupAdminNotificationHtml({
      parentName,
      email,
      childAge,
      source,
      status,
      promoCode,
    });

    await sendEmail({
      to: ADMIN_NOTIFICATION_EMAILS,
      subject: `🔔 [Admin Alert] New Beta Signup: ${parentName || email}`,
      html: adminHtml,
    });
    console.log(`[Notification] Admin alert dispatched to: ${ADMIN_NOTIFICATION_EMAILS.join(', ')}`);
  } catch (adminErr) {
    console.error('[Notification Error] Failed to send admin alert email:', adminErr);
  }
}

/**
 * Dispatches both Parent Confirmation Email and Admin Alerts on Apprentice Provisioning
 */
export async function sendApprenticeProvisionedNotifications(data: {
  parentName: string;
  parentEmail: string;
  apprenticeName: string;
  username: string;
  learningLevel?: string;
}) {
  const { parentName, parentEmail, apprenticeName, username, learningLevel } = data;

  // 1. Send Confirmation Email to Parent
  if (parentEmail && !parentEmail.endsWith('@student.playiq.dev')) {
    try {
      const parentHtml = getApprenticeCreatedParentEmailHtml({
        parentName,
        apprenticeName,
        username,
      });

      await sendEmail({
        to: parentEmail,
        subject: `🎉 Apprentice Profile Created for ${apprenticeName}!`,
        html: parentHtml,
      });
      console.log(`[Notification] Apprentice confirmation dispatched to parent: ${parentEmail}`);
    } catch (parentErr) {
      console.error(`[Notification Error] Failed to send apprentice confirmation to ${parentEmail}:`, parentErr);
    }
  }

  // 2. Send Admin Alert to the specified team emails
  try {
    const adminHtml = getApprenticeCreatedAdminNotificationHtml({
      parentName,
      parentEmail,
      apprenticeName,
      username,
      learningLevel,
    });

    await sendEmail({
      to: ADMIN_NOTIFICATION_EMAILS,
      subject: `🚀 [Admin Alert] New Apprentice: ${apprenticeName} (by ${parentName || parentEmail})`,
      html: adminHtml,
    });
    console.log(`[Notification] Admin apprentice alert dispatched to: ${ADMIN_NOTIFICATION_EMAILS.join(', ')}`);
  } catch (adminErr) {
    console.error('[Notification Error] Failed to send admin apprentice alert email:', adminErr);
  }
}
