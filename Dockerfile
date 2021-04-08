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
RUN yarn --production

COPY . .
COPY --from=builder /app/.nuxt ./.nuxt/

CMD [ "yarn", "start" ]
