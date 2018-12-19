FROM node:10.11.0-slim

ENV NODE_ENV=production
ENV PORT=5000

WORKDIR /grad-bank-app/server

COPY . /grad-bank-app
RUN npm i
EXPOSE $PORT

ENTRYPOINT ["npm", "start"]
