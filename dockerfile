FROM node:14-alpine

WORKDIR /app/something

COPY ./package.json .

RUN npm install

COPY . .

RUN npm run migrate

CMD [ "npm", "run", "start_prod" ]