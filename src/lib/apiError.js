export function createErrorFor(res) {
  return function toError({ output: { statusCode, payload } }) {
    res.status(statusCode).json(payload);
  };
}
