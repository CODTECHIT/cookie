import nodemailer from 'nodemailer';

/**
 * ⚡ Secure Email Sender Utility
 * Configured for Gmail SMTP using App Passwords
 */
export const sendEmail = async (options) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
     throw new Error(`Email credentials missing in .env: USER=${!!process.env.EMAIL_USER}, PASS=${!!process.env.EMAIL_PASS}`);
  }

  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // true for 465, false for 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // 2. Define email options
  const mailOptions = {
    from: `"Daksha Food Artisan" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || `
      <div style="font-family: inherit; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; padding: 20px; color: #331917;">
        <div style="background-color: #FDFBF7; padding: 40px; border-radius: 20px; border: 1px solid #eee; text-align: center;">
          <h1 style="color: #331917; font-size: 24px; margin-bottom: 20px;">Daksha Food Artisan</h1>
          <p style="color: #666; font-size: 16px; margin-bottom: 30px;">You are requesting a secure password recovery. Use the code below to reset your account.</p>
          <div style="background-color: #331917; color: white; padding: 20px 40px; border-radius: 12px; font-size: 32px; font-weight: 800; letter-spacing: 0.5em; display: inline-block; margin-bottom: 30px;">
            ${options.otp}
          </div>
          <p style="color: #999; font-size: 14px;">This code is valid for only 10 minutes. If you did not request this, please ignore this email.</p>
        </div>
      </div>
    `,
  };

  // 3. Send email
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent successfully to ${options.email}. Response: ${info.response}`);
  } catch (err) {
    console.error(`❌ Gmail rejection error: ${err.message}`);
    throw err;
  }
};
