FROM node:20

WORKDIR /usr/src/app/placenet-backend

COPY package*.json ./

RUN npm install

EXPOSE 3000

CMD ["node", "startServer.js", "backend"]