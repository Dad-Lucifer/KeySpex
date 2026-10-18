import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

const transporter =
  env.mailEnabled && env.SMTP_HOST
    ? nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: env.SMTP_PORT,
        secure: env.SMTP_PORT === 465,
        auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS } : undefined,
      })
    : null;

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] ?? c)
  );

export async function sendContactNotification(c: {
  id: string;
  name: string;
  email: string;
  company?: string | null;
  serviceInterest: string;
  message: string;
}) {
  if (!transporter || !env.MAIL_FROM || !env.MAIL_NOTIFY_TO) return;

  await transporter.sendMail({
    from: env.MAIL_FROM,
    to: env.MAIL_NOTIFY_TO,
    replyTo: c.email,
    subject: `New KeySpex enquiry from ${c.name.replace(/[\r\n]/g, ' ')}`,
    text: `Name: ${c.name}\nEmail: ${c.email}\nCompany: ${c.company || '-'}\nInterest: ${c.serviceInterest}\n\n${c.message}\n\nReference: ${c.id}`,
    html: `<p><strong>Name:</strong> ${esc(c.name)}<br><strong>Email:</strong> ${esc(c.email)}<br><strong>Company:</strong> ${esc(c.company ?? '-')}<br><strong>Interest:</strong> ${esc(c.serviceInterest)}</p><p>${esc(c.message).replace(/\n/g, '<br>')}</p><p><small>Reference: ${esc(c.id)}</small></p>`,
  });
}
