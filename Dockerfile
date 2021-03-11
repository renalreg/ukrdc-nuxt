FROM node:15-slim

WORKDIR /app

COPY package.json ./
RUN yarn

COPY . .

RUN yarn build

CMD [ "yarn", "start" ]
