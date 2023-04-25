FROM node:14

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# ENV DB_HOST=localhost
# ENV DB_PORT=3306
# ENV DB_NAME=war
# ENV DB_USER=root
# ENV DB_PASS=12345678
# ENV NODE_DOCKER_PORT=8080

# EXPOSE 8080

CMD ["npm", "start"]
