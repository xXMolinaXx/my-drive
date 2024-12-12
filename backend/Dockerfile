FROM node:18.17.1-buster

WORKDIR /app
ENV TZ="America/Tegucigalpa"
# Copy package.json and package-lock.json COPY package*.json ./
COPY package*.json ./
RUN npm i
COPY . .

EXPOSE 3001

CMD [ "npm","run","start:dev" ]

