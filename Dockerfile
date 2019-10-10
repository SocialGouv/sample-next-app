FROM node:12-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

# Build-time variables for the frontend
ARG SENTRY_DSN
ENV SENTRY_DSN=$SENTRY_DSN

ARG SENTRY_TOKEN
ENV SENTRY_TOKEN=$SENTRY_TOKEN

ARG MATOMO_URL
ENV MATOMO_URL=$MATOMO_URL

ARG MATOMO_SITE_ID
ENV MATOMO_SITE_ID=$MATOMO_SITE_ID

RUN yarn build && yarn --production

USER node

ENV NODE_ENV=production

CMD ["yarn", "start"]