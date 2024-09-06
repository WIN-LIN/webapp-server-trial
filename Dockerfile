FROM node:20.14-alpine

# Create app directory
WORKDIR /app

COPY . .

RUN npm run setup

EXPOSE 8080

CMD [ "npm", "run", "dev" ]