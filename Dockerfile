FROM node:15.9-alpine

WORKDIR /app

COPY . .

RUN yarn --production --frozen-lockfile --prefer-offline && yarn cache clean
RUN yarn build

USER node

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["yarn", "start"]