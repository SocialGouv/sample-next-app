import nodemailer from "nodemailer";

export default function sendmail(mailOptions) {
  const transport = nodemailer.createTransport({
    auth: {
      pass: process.env.SMTP_EMAIL_PASSWORD,
      user: process.env.SMTP_EMAIL_USER,
    },
    host: process.env.SMTP_URL,
    port: 587,
  });
  return transport.sendMail(mailOptions).finally(() => transport.close());
}
