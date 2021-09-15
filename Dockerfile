FROM node:14-alpine

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn --frozen-lockfile

COPY public/ .
COPY next.config.js .
COPY knexfile.js .
COPY src .

RUN yarn --production

USER node

CMD ["yarn", "start"]