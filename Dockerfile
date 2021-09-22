FROM node:15.9-alpine

WORKDIR /app

COPY . .

RUN yarn --frozen-lockfile --prefer-offline 
RUN yarn build

RUN yarn cache clean
RUN yarn --production 

USER node

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

CMD ["yarn", "start"]