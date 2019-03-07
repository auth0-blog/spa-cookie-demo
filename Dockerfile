FROM node:10-alpine as build

RUN mkdir /app

WORKDIR /app

COPY package.json .

RUN npm install --production

COPY . .

EXPOSE 3000

ENV NODE_ENV production

CMD ["node", "bin/www"]
