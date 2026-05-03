import sgMail from "@sendgrid/mail";
import { env } from "../config/env";

sgMail.setApiKey(env.SENDGRID_API_KEY);

export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  return sgMail.send({
    from: env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html
  });
}
