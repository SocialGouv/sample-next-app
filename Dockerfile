FROM node:12-alpine

RUN set -ex \
  && apk add --no-cache --virtual .setcap libcap \
  # NOTE(douglasduteil): allow the node application to listen to any port
  && setcap cap_net_bind_service=+ep `which node` \
  && apk del .setcap \
  ;

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn --production --frozen-lockfile

COPY next.config.js server.js  ./
COPY src/sentry.js ./src/sentry.js
COPY .next/ ./.next

USER node

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["yarn", "start"]
