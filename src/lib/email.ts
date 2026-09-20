import crypto from 'crypto';
import nodemailer from 'nodemailer';

export function generateCode(): string {
  return String(crypto.randomInt(100000, 999999));
}

const transporter = nodemailer.createTransport({
  host: 'smtp.mail.yahoo.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASS,
  },
});

export async function sendVerifyCode(email: string, code: string) {
  const from = process.env.EMAIL_USER;
  if (!from) return { ok: false, error: 'EMAIL_USER 未配置' };

  const html = `
    <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px">
      <h2>球友会</h2>
      <p style="color:#666">你的登录验证码</p>
      <div style="font-size:32px;font-weight:700;letter-spacing:8px;
                  background:#f5f5f5;padding:16px;text-align:center;border-radius:8px">
        ${code}
      </div>
      <p style="color:#999;font-size:13px">5 分钟内有效</p>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"球友会" <${from}>`,
      to: email,
      subject: '球友会 · 登录验证码',
      html,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
