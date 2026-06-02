/**
 * Returns subject, CTA, and styled HTML template for Anniversary reminders.
 */
export function anniversaryTemplate({
  personName,
  message,
  whatsappLink,
}: {
  personName: string;
  message: string;
  whatsappLink: string;
}) {
  return {
    subject: `❤️ Happy Anniversary: ${personName}`,
    cta: "Send Anniversary Wish",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Anniversary Alert</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              background-color: #0b0d12;
              color: #f8fafc;
              margin: 0;
              padding: 40px 20px;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              background: linear-gradient(135deg, rgba(255, 255, 255, 0.03), rgba(255, 255, 255, 0.01));
              border: 1px solid rgba(255, 255, 255, 0.08);
              border-radius: 24px;
              padding: 32px;
              box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
            }
            .logo {
              font-size: 24px;
              font-weight: 800;
              background: linear-gradient(to right, #818cf8, #a78bfa, #fb7185);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              margin-bottom: 24px;
              text-align: center;
            }
            .title {
              font-size: 28px;
              font-weight: 800;
              color: #ffffff;
              margin-top: 0;
              margin-bottom: 12px;
              text-align: center;
            }
            .description {
              color: #94a3b8;
              font-size: 14px;
              line-height: 1.6;
              margin-bottom: 28px;
              text-align: center;
            }
            .wish-card {
              background-color: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.06);
              border-radius: 16px;
              padding: 24px;
              margin-bottom: 28px;
            }
            .wish-label {
              font-size: 11px;
              font-weight: 700;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              color: #f43f5e;
              margin-bottom: 12px;
            }
            .wish-text {
              color: #e2e8f0;
              font-size: 15px;
              line-height: 1.6;
              font-style: italic;
              margin: 0;
            }
            .btn-container {
              text-align: center;
            }
            .btn-primary {
              display: inline-block;
              background: linear-gradient(135deg, #e11d48, #be123c);
              color: #ffffff !important;
              font-weight: 700;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.05em;
              text-decoration: none;
              padding: 14px 32px;
              border-radius: 12px;
              box-shadow: 0 4px 14px rgba(225, 29, 72, 0.3);
              transition: all 0.2s ease;
            }
            .footer {
              margin-top: 36px;
              font-size: 11px;
              color: #475569;
              text-align: center;
              border-top: 1px solid rgba(255, 255, 255, 0.05);
              padding-top: 20px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="logo">Occasionly 🎉</div>
            <h2 class="title">❤️ Happy Anniversary to ${personName}!</h2>
            <p class="description">
              Celebrate this anniversary milestone with ${personName}. We've customized a tailored AI wish for them based on your notes.
            </p>
            <div class="wish-card">
              <div class="wish-label">Suggested Anniversary Wish</div>
              <p class="wish-text">"${message}"</p>
            </div>
            <div class="btn-container">
              <a href="${whatsappLink}" class="btn-primary" target="_blank">
                Send Anniversary Wish
              </a>
            </div>
            <div class="footer">
              Sent automatically by Occasionly Relationship OS. All rights reserved.
            </div>
          </div>
        </body>
      </html>
    `,
  };
}
