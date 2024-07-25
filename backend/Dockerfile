FROM node:18.17.1-buster

WORKDIR /app

COPY package.json .
COPY package-lock.json .
RUN npm i
COPY . .

EXPOSE 3001

CMD [ "npm","run","start:dev" ]
