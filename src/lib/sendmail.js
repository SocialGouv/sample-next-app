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
  return new Promise((resolve, reject) => {
    transport.sendMail(mailOptions, function (error, info) {
      if (error) {
        reject(error);
        console.log(error);
      } else {
        resolve(info);
      }
      transport.close();
    });
  });
}
