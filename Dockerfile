FROM node:15-alpine as builder

WORKDIR /app

COPY package.json ./
RUN yarn

COPY . .

RUN yarn build


FROM node:15-alpine

ENV HOST="0.0.0.0"

WORKDIR /app

COPY package.json ./
COPY nuxt.config.js ./

RUN yarn --production

COPY --from=builder /app/.nuxt ./.nuxt/
COPY --from=builder /app/static ./static/

CMD [ "yarn", "start" ]
