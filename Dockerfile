FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy rest of the code
COPY . .

# Fix permissions for file watching
RUN chown -R node:node /usr/src/app
USER node

EXPOSE 3000
CMD ["npm", "run", "start:dev"]