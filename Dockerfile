FROM node:12-alpine AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY src public next.config.js server.js ./

# Build-time variables for the frontend
ARG SENTRY_DSN
ENV SENTRY_DSN=$SENTRY_DSN

ARG SENTRY_TOKEN
ENV SENTRY_TOKEN=$SENTRY_TOKEN

ARG MATOMO_URL
ENV MATOMO_URL=$MATOMO_URL

ARG MATOMO_SITE_ID
ENV MATOMO_SITE_ID=$MATOMO_SITE_ID

RUN yarn build

FROM node:12-alpine

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --production --frozen-lockfile

COPY next.config.js server.js ./
COPY src/sentry.js ./src/sentry.js
COPY --from=build /app/.next/ ./.next

USER node

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["yarn", "start"]
