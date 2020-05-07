import nodemailer from "nodemailer";

export default function sendmail(mailOptions) {
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_URL,
    port: 587,
    auth: {
      user: process.env.SMTP_EMAIL_USER,
      pass: process.env.SMTP_EMAIL_PASSWORD,
    },
  });
  return transport.sendMail(mailOptions).finally(() => transport.close());
}
