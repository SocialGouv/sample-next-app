import { withSentry } from "@sentry/nextjs";

const handler = async () => {
  console.log("SENTRY_DSN: " + process.env.SENTRY_DSN);
  throw new Error("error from API");
};

export default withSentry(handler);
