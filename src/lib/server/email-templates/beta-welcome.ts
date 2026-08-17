export interface BetaWelcomeEmailOptions {
  parentName?: string;
  teenName?: string;
  email: string;
  promoCode?: string;
  loginUrl?: string;
  pdfUrl?: string;
}

export function getBetaWelcomeEmailHtml({
  parentName = 'Parent',
  teenName = 'your teen',
  promoCode = 'PLAYIQ2025',
  loginUrl = 'https://weplayiq.com/login',
  pdfUrl = 'https://weplayiq.com/Parent_Setup_Guide.pdf',
}: BetaWelcomeEmailOptions): string {
  const greeting = parentName && teenName && teenName !== 'your teen'
    ? `${parentName} & ${teenName}`
    : parentName || 'Pilot Tester';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to WePlayIQ Beta</title>
</head>
<body style="margin: 0; padding: 0; background-color: #020617; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #020617; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #0f172a; border-radius: 12px; border: 1px solid #1e293b; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.5);">
          
          <!-- Header Banner -->
          <tr>
            <td style="padding: 32px 30px; text-align: center; background: linear-gradient(180deg, rgba(0, 200, 255, 0.1) 0%, rgba(15, 23, 42, 0) 100%); border-bottom: 1px solid #1e293b;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 900; letter-spacing: 3px; color: #00c8ff; text-transform: uppercase;">
                WEPLAYIQ
              </h1>
              <p style="margin: 6px 0 0 0; font-size: 12px; font-weight: 600; letter-spacing: 2px; color: #94a3b8; text-transform: uppercase;">
                Beta Testing Pilot Program
              </p>
            </td>
          </tr>

          <!-- Main Content Body -->
          <tr>
            <td style="padding: 32px 30px;">
              <p style="font-size: 16px; line-height: 1.5; color: #f1f5f9; margin-top: 0; margin-bottom: 16px;">
                Hi <strong>${greeting}</strong>,
              </p>
              
              <p style="font-size: 14px; line-height: 1.6; color: #cbd5e1; margin-bottom: 24px;">
                Welcome to the <strong>WePlayIQ Beta Testing Program</strong>! We're excited to have you join us as early testers to experience gamified study challenges, active retrieval decks, and safe AI coaching.
              </p>

              <!-- Parent Setup Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 8px; border-left: 4px solid #00c8ff; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px;">
                      🛡️ Step 1: Parent Setup (~3–5 mins)
                    </h3>
                    <ol style="margin: 0; padding-left: 18px; color: #cbd5e1; font-size: 13px; line-height: 1.7;">
                      <li>Navigate to <a href="https://weplayiq.com" style="color: #00c8ff; text-decoration: underline;">weplayiq.com</a> and click <strong>"Apply for Pilot Access"</strong>.</li>
                      <li>Fill in your parent details and enter the waiver promo code below:</li>
                    </ol>
                    
                    <div style="background-color: #020617; border: 1px dashed #00c8ff; border-radius: 6px; padding: 10px; margin: 12px 0; text-align: center;">
                      <span style="font-family: monospace; font-size: 15px; font-weight: bold; color: #00c8ff; letter-spacing: 2px;">
                        PROMO CODE: ${promoCode}
                      </span>
                      <div style="font-size: 11px; color: #94a3b8; margin-top: 4px;">(Waives all pilot enrollment & setup fees)</div>
                    </div>

                    <ol start="3" style="margin: 0; padding-left: 18px; color: #cbd5e1; font-size: 13px; line-height: 1.7;">
                      <li>Create your account and open your <strong>Parent Dashboard</strong>.</li>
                      <li>Click <strong>"+ Provision New Apprentice"</strong> to create a login handle & passcode for ${teenName}.</li>
                    </ol>
                  </td>
                </tr>
              </table>

              <!-- Student Box -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #1e293b; border-radius: 8px; border-left: 4px solid #7b4fce; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 15px; color: #c084fc; text-transform: uppercase; letter-spacing: 1px;">
                      👾 Step 2: ${teenName !== 'your teen' ? teenName : 'Student'} Login & Missions
                    </h3>
                    <p style="margin: 0 0 10px 0; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
                      Once provisioned, log in directly at <a href="${loginUrl}" style="color: #00c8ff; font-weight: 600;">${loginUrl}</a> using the handle and passcode set by the parent. <em>(No student email is required!)</em>
                    </p>
                    <ul style="margin: 0; padding-left: 18px; color: #cbd5e1; font-size: 13px; line-height: 1.6;">
                      <li>Jump into active learning missions & boss battles.</li>
                      <li>Get strategic AI hints and coaching nudges.</li>
                      <li>Level up skills and track real concept mastery.</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- Action CTA -->
              <div style="text-align: center; margin: 28px 0;">
                <a href="https://weplayiq.com" style="background-color: #00c8ff; color: #020617; text-decoration: none; padding: 14px 28px; font-size: 14px; font-weight: bold; border-radius: 6px; display: inline-block; letter-spacing: 1.5px; text-transform: uppercase; box-shadow: 0 0 20px rgba(0,200,255,0.4);">
                  Launch WePlayIQ Platform &rarr;
                </a>
              </div>

              <!-- PDF Guide Callout -->
              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: rgba(0, 200, 255, 0.05); border: 1px dashed rgba(0, 200, 255, 0.3); border-radius: 8px; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 16px; text-align: center;">
                    <p style="margin: 0 0 6px 0; font-size: 13px; font-weight: 600; color: #e2e8f0;">
                      📄 Setup Walkthrough Attached
                    </p>
                    <p style="margin: 0; font-size: 12px; color: #94a3b8;">
                      We have attached <strong>Parent_Setup_Guide.pdf</strong> to this email. You can also <a href="${pdfUrl}" style="color: #00c8ff; text-decoration: underline;">view/download it online anytime</a>.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Feedback Note -->
              <p style="font-size: 13px; line-height: 1.6; color: #94a3b8; margin: 0; text-align: center;">
                Have questions or suggestions during testing? Simply reply directly to this email or click the in-app feedback button!
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 30px; background-color: #090d16; border-top: 1px solid #1e293b; text-align: center; font-size: 12px; color: #64748b;">
              <p style="margin: 0 0 4px 0;">WePlayIQ Active Learning Platform</p>
              <p style="margin: 0;">&copy; 2026 WePlayIQ. All rights reserved.</p>
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
