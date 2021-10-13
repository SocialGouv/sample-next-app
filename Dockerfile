# from https://nextjs.org/docs/deployment

ARG SENTRY_DSN=https://24f5b07f17a544b1b76ac0766ee68020@lafabriquenumerique-sentry.cloud-ed.fr/27

# Install dependencies only when needed
FROM node:14-alpine AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:14-alpine AS builder
WORKDIR /app
COPY . .
COPY --from=deps /app/node_modules ./node_modules

ARG SENTRY_DSN
ENV SENTRY_DSN=$SENTRY_DSN

RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:14-alpine AS runner
WORKDIR /app

ARG SENTRY_DSN
ENV SENTRY_DSN=$SENTRY_DSN

ENV NODE_ENV production

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder --chown=node:node /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

USER node

ENV NEXT_TELEMETRY_DISABLED 1

CMD ["yarn", "start"]
