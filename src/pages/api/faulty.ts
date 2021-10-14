import { withSentry } from "@sentry/nextjs";

const handler = async () => {
  console.log("NEXT_PUBLIC_SENTRY_DSN: " + process.env.NEXT_PUBLIC_SENTRY_DSN);
  throw new Error("error from API");
};

export default withSentry(handler);
