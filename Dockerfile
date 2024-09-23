FROM node:22-alpine

WORKDIR /app

COPY package.* ./

RUN npm i @google/clasp -g \
    && npm install jest --global \
    && npm install
