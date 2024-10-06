FROM node:22-alpine

WORKDIR /app

COPY package.* ./

RUN npm install @google/clasp typescript jest -g \
    && npm install
