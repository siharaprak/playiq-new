export const ADMIN_NOTIFICATION_EMAILS = [
  'teamsienvi@gmail.com',
  'sienviclientsiharaprak@gmail.com',
];

/**
 * Admin Notification: New Beta Application / User Signup
 */
export function getBetaSignupAdminNotificationHtml(data: {
  parentName: string;
  email: string;
  childAge?: string;
  source?: string;
  status?: string;
  promoCode?: string;
}) {
  const { parentName, email, childAge, source, status, promoCode } = data;
  const timeStr = new Date().toUTCString();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Alert: New Beta Signup</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #020617; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <!-- Top Badge & Timestamp Table -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <span style="display: inline-block; padding: 5px 10px; background-color: rgba(0, 200, 255, 0.12); border: 1px solid #00c8ff; color: #00c8ff; font-family: monospace; font-size: 11px; font-weight: bold; border-radius: 4px; letter-spacing: 1px;">
                      ADMIN TELEMETRY ALERT
                    </span>
                  </td>
                  <td align="right" style="vertical-align: middle; font-size: 11px; color: #64748b; font-family: monospace;">
                    ${timeStr}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td>
              <h2 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #00c8ff; letter-spacing: 0.5px;">
                🔔 New Beta Application / Signup
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                A new parent has registered for the WePlayIQ Beta Testing Pilot.
              </p>
            </td>
          </tr>

          <!-- Data Breakdown Table -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 8px; border: 1px solid #334155; overflow: hidden; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 18px; color: #94a3b8; font-size: 13px; font-weight: 600; width: 40%; border-bottom: 1px solid #334155;">
                    Parent Name
                  </td>
                  <td style="padding: 12px 18px; color: #ffffff; font-size: 13px; font-family: monospace; font-weight: bold; width: 60%; text-align: right; border-bottom: 1px solid #334155;">
                    ${parentName || 'N/A'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; color: #94a3b8; font-size: 13px; font-weight: 600; border-bottom: 1px solid #334155;">
                    Email Address
                  </td>
                  <td style="padding: 12px 18px; color: #38bdf8; font-size: 13px; font-family: monospace; font-weight: bold; text-align: right; border-bottom: 1px solid #334155;">
                    ${email}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; color: #94a3b8; font-size: 13px; font-weight: 600; border-bottom: 1px solid #334155;">
                    Child Age Bracket
                  </td>
                  <td style="padding: 12px 18px; color: #f8fafc; font-size: 13px; font-family: monospace; font-weight: bold; text-align: right; border-bottom: 1px solid #334155;">
                    ${childAge || 'Not specified'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; color: #94a3b8; font-size: 13px; font-weight: 600; border-bottom: 1px solid #334155;">
                    Traffic Source
                  </td>
                  <td style="padding: 12px 18px; color: #f8fafc; font-size: 13px; font-family: monospace; font-weight: bold; text-align: right; border-bottom: 1px solid #334155;">
                    ${source || 'direct_traffic'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; color: #94a3b8; font-size: 13px; font-weight: 600; border-bottom: 1px solid #334155;">
                    Intake Status
                  </td>
                  <td style="padding: 12px 18px; color: #38bdf8; font-size: 13px; font-family: monospace; font-weight: bold; text-align: right; border-bottom: 1px solid #334155;">
                    ${status || 'fulfilled_promo'}
                  </td>
                </tr>
                ${promoCode ? `
                <tr>
                  <td style="padding: 12px 18px; color: #94a3b8; font-size: 13px; font-weight: 600;">
                    Promo Code Used
                  </td>
                  <td style="padding: 12px 18px; color: #4ade80; font-size: 13px; font-family: monospace; font-weight: bold; text-align: right;">
                    ${promoCode}
                  </td>
                </tr>
                ` : ''}
              </table>
            </td>
          </tr>

          <!-- Admin CTA Button -->
          <tr>
            <td align="center" style="padding-top: 8px;">
              <a href="https://weplayiq.com/admin/home" style="display: inline-block; background-color: #7b4fce; color: #ffffff !important; text-decoration: none; padding: 12px 24px; font-size: 13px; font-weight: bold; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 15px rgba(123,79,206,0.4);">
                View Admin Intake Console &rarr;
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Admin Notification: New Apprentice Provisioned
 */
export function getApprenticeCreatedAdminNotificationHtml(data: {
  parentName: string;
  parentEmail: string;
  apprenticeName: string;
  username: string;
  learningLevel?: string;
}) {
  const { parentName, parentEmail, apprenticeName, username, learningLevel } = data;
  const timeStr = new Date().toUTCString();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin Alert: Apprentice Provisioned</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #020617; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 580px; background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b; padding: 28px; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <!-- Top Badge & Timestamp Table -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
                <tr>
                  <td align="left" style="vertical-align: middle;">
                    <span style="display: inline-block; padding: 5px 10px; background-color: rgba(123, 79, 206, 0.2); border: 1px solid #7b4fce; color: #c084fc; font-family: monospace; font-size: 11px; font-weight: bold; border-radius: 4px; letter-spacing: 1px;">
                      APPRENTICE PROVISIONED
                    </span>
                  </td>
                  <td align="right" style="vertical-align: middle; font-size: 11px; color: #64748b; font-family: monospace;">
                    ${timeStr}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Title -->
          <tr>
            <td>
              <h2 style="margin: 0 0 10px 0; font-size: 22px; font-weight: 800; color: #c084fc; letter-spacing: 0.5px;">
                🚀 New Apprentice Account Created!
              </h2>
              <p style="margin: 0 0 24px 0; font-size: 14px; color: #94a3b8; line-height: 1.5;">
                A parent has provisioned a new student apprentice profile on WePlayIQ.
              </p>
            </td>
          </tr>

          <!-- Data Breakdown Table -->
          <tr>
            <td>
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 8px; border: 1px solid #334155; overflow: hidden; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 18px; color: #94a3b8; font-size: 13px; font-weight: 600; width: 40%; border-bottom: 1px solid #334155;">
                    Apprentice Name
                  </td>
                  <td style="padding: 12px 18px; color: #38bdf8; font-size: 13px; font-family: monospace; font-weight: bold; width: 60%; text-align: right; border-bottom: 1px solid #334155;">
                    ${apprenticeName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; color: #94a3b8; font-size: 13px; font-weight: 600; border-bottom: 1px solid #334155;">
                    Student Login Handle
                  </td>
                  <td style="padding: 12px 18px; color: #4ade80; font-size: 13px; font-family: monospace; font-weight: bold; text-align: right; border-bottom: 1px solid #334155;">
                    ${username}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; color: #94a3b8; font-size: 13px; font-weight: 600; border-bottom: 1px solid #334155;">
                    Initial Learning Level
                  </td>
                  <td style="padding: 12px 18px; color: #f8fafc; font-size: 13px; font-family: monospace; font-weight: bold; text-align: right; border-bottom: 1px solid #334155;">
                    ${learningLevel || 'high'}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; color: #94a3b8; font-size: 13px; font-weight: 600; border-bottom: 1px solid #334155;">
                    Parent Sponsor
                  </td>
                  <td style="padding: 12px 18px; color: #f8fafc; font-size: 13px; font-family: monospace; font-weight: bold; text-align: right; border-bottom: 1px solid #334155;">
                    ${parentName}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 18px; color: #94a3b8; font-size: 13px; font-weight: 600;">
                    Parent Email
                  </td>
                  <td style="padding: 12px 18px; color: #38bdf8; font-size: 13px; font-family: monospace; font-weight: bold; text-align: right;">
                    ${parentEmail}
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Admin CTA Button -->
          <tr>
            <td align="center" style="padding-top: 8px;">
              <a href="https://weplayiq.com/admin/users" style="display: inline-block; background-color: #00c8ff; color: #020617 !important; text-decoration: none; padding: 12px 24px; font-size: 13px; font-weight: bold; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 15px rgba(0,200,255,0.4);">
                Open Student Roster Console &rarr;
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * User Notification (Parent): Apprentice Successfully Created
 */
export function getApprenticeCreatedParentEmailHtml(data: {
  parentName: string;
  apprenticeName: string;
  username: string;
}) {
  const { parentName, apprenticeName, username } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Apprentice Profile Confirmation</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #020617; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 30px; text-align: center; background: linear-gradient(180deg, rgba(123, 79, 206, 0.15) 0%, rgba(15, 23, 42, 0) 100%); border-bottom: 1px solid #1e293b;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 3px; color: #00c8ff; text-transform: uppercase;">
                WEPLAYIQ
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #94a3b8; text-transform: uppercase;">
                Apprentice Profile Confirmation
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 30px;">
              <p style="font-size: 16px; color: #f1f5f9; margin-top: 0; margin-bottom: 16px;">
                Hi <strong>${parentName || 'Parent'}</strong>,
              </p>

              <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin-bottom: 24px;">
                Great news! The Apprentice profile for <strong>${apprenticeName}</strong> has been successfully created and linked to your parent account.
              </p>

              <!-- Apprentice Card -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 8px; border-left: 4px solid #7b4fce; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #c084fc; text-transform: uppercase; letter-spacing: 1px;">
                      👾 ${apprenticeName}'s Login Details:
                    </h3>
                    
                    <div style="background-color: #020617; border: 1px dashed #00c8ff; border-radius: 6px; padding: 14px; text-align: center; margin-bottom: 14px;">
                      <div style="font-size: 12px; color: #94a3b8; margin-bottom: 4px;">STUDENT HANDLE</div>
                      <div style="font-family: monospace; font-size: 18px; font-weight: bold; color: #00c8ff; letter-spacing: 1px;">${username}</div>
                      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Passcode: <em>(The passcode you set during setup)</em></div>
                    </div>

                    <p style="margin: 0; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
                      ${apprenticeName} does not need an email address — they can log in directly at <a href="https://weplayiq.com/login" style="color: #00c8ff; font-weight: 600;">weplayiq.com/login</a> using just their handle and passcode.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Parent Dashboard Info -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: rgba(0, 200, 255, 0.05); border: 1px dashed rgba(0, 200, 255, 0.3); border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px;">
                    <h4 style="margin: 0 0 6px 0; color: #e2e8f0; font-size: 14px;">🛡️ Tracking Progress on Your Dashboard:</h4>
                    <p style="margin: 0; color: #94a3b8; font-size: 12px; line-height: 1.6;">
                      You can log in to your Parent Dashboard anytime at <a href="https://weplayiq.com/parent/home" style="color: #00c8ff;">weplayiq.com/parent/home</a> to monitor completed missions, learning milestones, and AI coaching interactions.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Action Button -->
              <div style="text-align: center; margin: 28px 0;">
                <a href="https://weplayiq.com/login" style="display: inline-block; background-color: #00c8ff; color: #020617 !important; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: bold; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 0 15px rgba(0,200,255,0.4);">
                  Go to Login Portal &rarr;
                </a>
              </div>

              <p style="font-size: 13px; color: #94a3b8; text-align: center; margin: 0;">
                Need help or have questions? Simply reply directly to this email!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px; background-color: #090d16; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b;">
              &copy; 2026 WePlayIQ. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}
