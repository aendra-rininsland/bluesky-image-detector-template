FROM node:lts

WORKDIR /app

COPY package-lock.json .

COPY package.json .

RUN npm ci

COPY lib /app/lib

