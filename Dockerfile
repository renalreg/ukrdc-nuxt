FROM node:15-slim

ENV HOST="0.0.0.0"

WORKDIR /app

COPY package.json ./
RUN yarn

COPY . .

RUN yarn build

CMD [ "yarn", "start" ]
