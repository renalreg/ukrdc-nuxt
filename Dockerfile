FROM node:16-alpine as builder

# Environment variables used for building and Sentry release
ARG SENTRY_DSN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_AUTH_TOKEN
ARG GITHUB_SHA
ARG GITHUB_REF

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:16-alpine

ENV HOST="0.0.0.0"

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --production

COPY . .
COPY --from=builder /app/.output ./.output/

CMD [ "./start.sh" ]
