import Boom from "@hapi/boom";
import Joi from "@hapi/joi";

import { createErrorFor } from "../../../../src/lib/apiError";
import sendmail from "../../../lib/sendmail";

export default async function accountWebhook(req, res) {
  const apiError = createErrorFor(res);

  if (req.headers["email-secret"] !== process.env.ACCOUNT_EMAIL_SECRET) {
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
          data: Joi.object()
            .keys({
              new: Joi.object({
                email: Joi.string().required(),
                secret_token: Joi.string()
                  .guid({ version: "uuidv4" })
                  .required(),
              })
                .required()
                .unknown(),
            })
            .required()
            .unknown(),
          op: Joi.string().pattern(/^(INSERT|UPDATE)$/, "OP"),
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
  let activateUrl = `${process.env.FRONTEND_HOST}/change_password?token=${secret_token}&activate=1`; // todo: dynamic hostname
  let text = `Bonjour,
  Vous pouvez activer votre compte ${email} afin d'accéder à
  l'outil d'administration du cdtn en suivant ce lien : ${activateUrl}

  L'equipe veille CDTN
  `;

  if (op === "UPDATE") {
    activateUrl = `${process.env.FRONTEND_HOST}/change_password?token=${secret_token}`; // todo: dynamic hostname
    subject = "Réinitialisation de votre mot de passe";
    text = `
Bonjour,
Une demande pour réinitialiser votre de mot de passe est en cours.
Vous pouvez suivre ce lien : ${activateUrl} pour valider la demande.

Si vous n'etes pas à l'origine de cette demande, pas de soucis,
ne tenez pas compte de de message.

L'equipe veille CDTN
`;
  }

  var mailOptions = {
    from: process.env.ACCOUNT_MAIL_SENDER,
    subject,
    text,
    to: email,
  };
  try {
    const results = await sendmail(mailOptions);
    res.json(results);
  } catch (error) {
    console.error(error);
    return apiError(Boom.badGateway("can't send account email"));
  }
}
