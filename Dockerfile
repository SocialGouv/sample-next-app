FROM node:14.13.1-alpine3.12

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install --production --frozen-lockfile

COPY next.config.js server.js  ./
COPY src/sentry.js ./src/sentry.js
COPY .next/ ./.next
COPY public/ ./

USER node

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["yarn", "start"]
