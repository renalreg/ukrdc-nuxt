FROM node:16-alpine

WORKDIR /app

COPY package.json ./
RUN yarn
COPY . .
RUN yarn build

ENV HOST="0.0.0.0"
CMD [ "yarn", "start" ]
