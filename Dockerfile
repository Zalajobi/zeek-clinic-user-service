FROM node:20-alpine

ARG DOTENV_KEY
ENV DOTENV_KEY=$DOTENV_KEY

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start"]