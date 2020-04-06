const passport = require("../../../config/passport");
const { User } = require(".../../../db/schema");
const { errorHandler } = require("../../../db/errors");

export default async (req, res, next) => {
  switch (req.method) {
    case "POST": {
      req.assert("email", "Email is not valid").notEmpty();
      req
        .assert("password", "Password must be at least 4 characters long")
        .len(4);
      req
        .assert("confirmPassword", "Passwords do not match")
        .equals(req.body.password);

      const errors = req.validationErrors();

      if (errors) {
        return res.status(400).json({ errors: errors });
      }

      try {
        // eslint-disable-next-line no-unused-vars
        const user = await User.query()
          .allowInsert("[email, password]")
          .insert({
            email: req.body.email,
            password: req.body.password
          });
      } catch (err) {
        errorHandler(err, res);
        return;
      }
      passport.authenticate("local", (err, user) => {
        if (err) {
          return handleResponse(res, 400, { error: err });
        }
        if (user) {
          handleResponse(res, 200, user.getUser());
        }
      })(req, res, next);
      break;
    }
    default:
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

function handleResponse(res, code, statusMsg) {
  res.status(code).json(statusMsg);
}
