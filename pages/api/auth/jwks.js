const rasha = require("rasha");
const jwtConfig = require("../../../config/jwt");

export default (req, res) => {
  switch (req.method) {
    case "GET": {
      const jwk = {
        ...rasha.importSync({ pem: jwtConfig.publicKey }),
        alg: "RS256",
        use: "sig",
        kid: jwtConfig.publicKey
      };
      const jwks = {
        keys: [jwk]
      };
      res.setHeader("Content-Type", "application/json");
      res.send(JSON.stringify(jwks, null, 2) + "\n");
      handleResponse(res, 200, jwks);
      break;
    }
    default:
      res.setHeader("Allow", ["GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

function handleResponse(res, code, statusMsg) {
  res.status(code).json(statusMsg);
}
