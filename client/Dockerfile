# Use the official Node.js 14 image as the base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install the dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# ENV SERVER_HOST localhost
# ENV SERVER_PORT 3000
# ENV CLIENT_PORT 3001

# Expose the port that the frontend server will listen on
EXPOSE ${CLIENT_PORT}

# Start the frontend server
CMD ["npm", "start"]
