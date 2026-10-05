/**
 * Immediate confirmation email for PlayIQ Early Access popup leads.
 * Handoff Section 10 ("Immediately"): confirm interest, explain next steps,
 * link to the demonstration, and clarify the parent-led application.
 */
export function getEarlyAccessConfirmationEmailHtml({
  siteUrl = 'https://weplayiq.com',
  unsubscribeUrl,
}: {
  siteUrl?: string;
  unsubscribeUrl: string;
}): string {
  const demoUrl = `${siteUrl}/how-it-works`;
  const applyUrl = `${siteUrl}/beta`;
  const parentsUrl = `${siteUrl}/parents`;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're one step closer to PlayIQ Early Access</title>
</head>
<body style="margin:0;padding:0;background-color:#020617;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#f8fafc;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#020617;padding:30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width:600px;background-color:#0f172a;border-radius:12px;border:1px solid #1e293b;overflow:hidden;">

          <tr>
            <td style="padding:32px 30px;text-align:center;background:linear-gradient(180deg,rgba(0,200,255,0.1) 0%,rgba(15,23,42,0) 100%);border-bottom:1px solid #1e293b;">
              <p style="margin:0;font-size:12px;font-weight:700;letter-spacing:3px;color:#00c8ff;text-transform:uppercase;">PlayIQ Early Access</p>
              <h1 style="margin:10px 0 0 0;font-size:24px;line-height:1.3;font-weight:800;color:#ffffff;">
                Don’t just use AI.<br>Learn to build with it.
              </h1>
            </td>
          </tr>

          <tr>
            <td style="padding:32px 30px;">
              <p style="font-size:15px;line-height:1.6;color:#e2e8f0;margin:0 0 16px 0;">Hi there,</p>
              <p style="font-size:14px;line-height:1.7;color:#cbd5e1;margin:0 0 20px 0;">
                Thanks for your interest in PlayIQ Early Access. PlayIQ helps teens ages 13–17 turn AI into a real-world advantage—building personal AI tutors, smarter study systems, and practical problem-solving skills for school, projects, and beyond.
              </p>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#1e293b;border-radius:8px;border-left:4px solid #00c8ff;margin-bottom:20px;">
                <tr>
                  <td style="padding:20px;">
                    <h2 style="margin:0 0 10px 0;font-size:14px;color:#38bdf8;text-transform:uppercase;letter-spacing:1px;">What teens build</h2>
                    <ul style="margin:0;padding-left:18px;color:#cbd5e1;font-size:13px;line-height:1.8;">
                      <li>A personalized AI tutor with rules that keep them doing the thinking</li>
                      <li>Study guides and project systems from their own notes</li>
                      <li>The habit of checking AI answers and catching mistakes</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color:#1e293b;border-radius:8px;border-left:4px solid #7b4fce;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <h2 style="margin:0 0 10px 0;font-size:14px;color:#c084fc;text-transform:uppercase;letter-spacing:1px;">What happens next</h2>
                    <ol style="margin:0;padding-left:18px;color:#cbd5e1;font-size:13px;line-height:1.8;">
                      <li><a href="${demoUrl}" style="color:#00c8ff;">See how PlayIQ works</a>.</li>
                      <li>A parent or guardian completes the short <a href="${applyUrl}" style="color:#00c8ff;">Early Access application</a>. Teens don’t sign up on their own.</li>
                      <li>Once accepted, you’ll set up your teen’s account and they can start their first mission.</li>
                    </ol>
                    <p style="margin:12px 0 0 0;color:#94a3b8;font-size:12px;line-height:1.6;">
                      Parents get clear visibility into what their teen is building and learning. <a href="${parentsUrl}" style="color:#00c8ff;">Learn more for parents</a>.
                    </p>
                  </td>
                </tr>
              </table>

              <div style="text-align:center;margin:28px 0 12px 0;">
                <a href="${demoUrl}" style="background-color:#00c8ff;color:#020617;text-decoration:none;padding:14px 28px;font-size:14px;font-weight:bold;border-radius:6px;display:inline-block;letter-spacing:1px;text-transform:uppercase;">
                  See PlayIQ in Action
                </a>
              </div>
              <p style="text-align:center;margin:0 0 8px 0;font-size:13px;">
                <a href="${applyUrl}" style="color:#00c8ff;text-decoration:underline;">Continue to Early Access &rarr;</a>
              </p>

              <p style="font-size:13px;line-height:1.6;color:#94a3b8;margin:24px 0 0 0;text-align:center;">
                Questions? Just reply to this email.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:20px 30px;background-color:#090d16;border-top:1px solid #1e293b;text-align:center;font-size:12px;color:#64748b;line-height:1.6;">
              <p style="margin:0 0 4px 0;">You’re receiving this because you requested PlayIQ Early Access information at weplayiq.com.</p>
              <p style="margin:0 0 4px 0;"><a href="${unsubscribeUrl}" style="color:#64748b;text-decoration:underline;">Unsubscribe</a></p>
              <p style="margin:0;">&copy; 2026 WePlayIQ. All rights reserved.</p>
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

export function getEarlyAccessConfirmationEmailText({
  siteUrl = 'https://weplayiq.com',
  unsubscribeUrl,
}: {
  siteUrl?: string;
  unsubscribeUrl: string;
}): string {
  return [
    "You're one step closer to PlayIQ Early Access.",
    '',
    'PlayIQ helps teens ages 13–17 turn AI into a real-world advantage—building personal AI tutors, smarter study systems, and practical problem-solving skills.',
    '',
    'What happens next:',
    `1. See how PlayIQ works: ${siteUrl}/how-it-works`,
    `2. A parent or guardian completes the Early Access application: ${siteUrl}/beta`,
    "3. Once accepted, you'll set up your teen's account and they can start their first mission.",
    '',
    'Questions? Just reply to this email.',
    '',
    `Unsubscribe: ${unsubscribeUrl}`,
  ].join('\n');
}
