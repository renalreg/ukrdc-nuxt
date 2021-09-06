FROM node:16-alpine

ARG GITHUB_SHA
ARG GITHUB_REF

# Built-time args for publishing Sentry releases
ARG SENTRY_DSN
ARG SENTRY_AUTH_TOKEN
ARG SENTRY_ORG
ARG SENTRY_PROJECT

# Store non-private vairables to the container environment
ENV GITHUB_SHA=$GITHUB_SHA \
    GITHUB_REF=$GITHUB_REF \
    SENTRY_DSN=$SENTRY_DSN

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

ENV HOST="0.0.0.0"
CMD [ "yarn", "start" ]
