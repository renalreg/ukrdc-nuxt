FROM node:16-alpine

ARG GITHUB_SHA
ARG GITHUB_REF

ENV GITHUB_SHA=$GITHUB_SHA \
    GITHUB_REF=$GITHUB_REF

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn
COPY . .
RUN yarn build

ENV HOST="0.0.0.0"
CMD [ "yarn", "start" ]
