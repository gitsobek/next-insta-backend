FROM node:16.3.0-alpine

ENV NODE_ENV=development

WORKDIR /usr/src/app

COPY package.json yarn.lock .env.development ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 8080

CMD [ "node", "./build/boot.js" ]