FROM node:16-alpine as builder

ARG GITHUB_SHA
ARG GITHUB_REF
ARG SENTRY_DSN
ENV GITHUB_SHA=$GITHUB_SHA \
    GITHUB_REF=$GITHUB_REF \
    SENTRY_DSN=$SENTRY_DSN

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

FROM node:16-alpine

ARG GITHUB_SHA
ARG GITHUB_REF
ARG SENTRY_DSN
ENV GITHUB_SHA=$GITHUB_SHA \
    GITHUB_REF=$GITHUB_REF \
    SENTRY_DSN=$SENTRY_DSN \
    HOST="0.0.0.0"

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn --production

COPY . .
COPY --from=builder /app/.nuxt ./.nuxt/

CMD [ "yarn", "start" ]
