import nodemailer from "nodemailer";
import {
  ACCOUNT_EMAIL_SECRET,
  FRONTEND_URL,
  ACCOUNT_MAIL_SENDER,
} from "../../../../src/config";
import { createErrorFor } from "../../../../src/lib/apiError";
import Joi from "@hapi/joi";
import Boom from "@hapi/boom";

export default async function sendMail(req, res) {
  const apiError = createErrorFor(res);

  if (req.headers["email-secret"] !== ACCOUNT_EMAIL_SECRET) {
    console.log({ EmailSecret: req.headers["email-secret"] });
    console.log({ ACCOUNT_EMAIL_SECRET });
    return apiError(Boom.unauthorized("Invalid secret token"));
  }

  if (req.method === "GET") {
    res.setHeader("Allow", ["POST"]);
    return apiError(Boom.methodNotAllowed("GET method not allowed"));
  }

  const schema = Joi.object()
    .keys({
      event: Joi.object()
        .keys({
          op: Joi.string().pattern(/^(INSERT|UPDATE)$/, "OP"),
          data: Joi.object()
            .keys({
              new: Joi.object({
                secret_token: Joi.string()
                  .guid({ version: "uuidv4" })
                  .required(),
                email: Joi.string().required(),
              })
                .required()
                .unknown(),
            })
            .required()
            .unknown(),
        })
        .required()
        .unknown(),
    })
    .unknown();

  const { error, value } = schema.validate(req.body);

  if (error) {
    return apiError(Boom.badRequest(error.details[0].message));
  }
  const { data, op } = value.event;
  const { email, secret_token } = data.new;
  let subject = "Activation de votre compte";
  const activateUrl = `https://${FRONTEND_URL}/api/activate?token=${secret_token}`; // todo: dynamic hostname
  let text = `Bonjour,
  Vous pouvez activer votre compte ${email} afin d'accéder à
  l'outil d'administration du cdtn en suivant ce lien : ${activateUrl}

  Lionel
  `;

  if (op === "UPDATE") {
    subject = "Réinitialisation de votre mot de passe";
    text = `
Bonjour,
Une demande pour réinitialiser votre de mot de passe est en cours.
Vous pouvez suivre ce lien : ${activateUrl} pour valider la demande.

Si vous n'etes pas à l'origine de cette demande, pas de soucis,
ne tenez pas compte de de message.

Lionel
`;
  }

  var mailOptions = {
    from: ACCOUNT_MAIL_SENDER,
    to: email,
    subject,
    text,
  };
  var transport = nodemailer.createTransport({
    host: process.env.SMTP_URL,
    port: 587,
    auth: {
      user: process.env.SMTP_EMAIL_USER,
      pass: process.env.SMTP_EMAIL_PASSWORD,
    },
  });
  transport.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return apiError(Boom.badGateway("can't send account email"));
    } else {
      console.log(info);
      res.json(info);
    }
  });
  transport.close();
}
