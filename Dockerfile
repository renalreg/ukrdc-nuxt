FROM node:16-alpine as builder

# Environment variables used for building and Sentry release
ARG SENTRY_DSN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_AUTH_TOKEN
ARG GITHUB_SHA
ARG GITHUB_REF

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM node:16-alpine

ENV HOST="0.0.0.0"

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --production

COPY . .
COPY --from=builder /app/.nuxt ./.nuxt/

CMD [ "yarn", "start" ]
