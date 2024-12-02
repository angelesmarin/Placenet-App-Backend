FROM node:20

WORKDIR /usr/src/app/placenet-backend

COPY package*.json ./

RUN npm install && npm install --save multer-s3

EXPOSE 3000

CMD ["node", "startServer.js", "backend"]
