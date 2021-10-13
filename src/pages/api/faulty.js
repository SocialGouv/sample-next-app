export default function faulty() {
  console.log("SENTRY_DSN: " + process.env.SENTRY_DSN);
  throw new Error("error from API");
}
