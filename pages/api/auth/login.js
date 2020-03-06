const passport = require("../../../config/passport");

export default async (req, res, next) => {
  switch (req.method) {
    case "POST": {
      req.assert("email", "Email is not valid").notEmpty();
      req.assert("password", "Password cannot be blank").notEmpty();

      const errors = req.validationErrors();

      if (errors) {
        return res.status(400).json({ errors: errors });
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
