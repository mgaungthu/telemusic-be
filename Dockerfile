FROM node:22-alpine

# Set working directory
WORKDIR /usr/src/app

# Install ffmpeg (required for audio duration extraction)
RUN apk add --no-cache ffmpeg

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install


# Fix permissions for file watching
RUN chown -R node:node /usr/src/app
USER node

EXPOSE 3000
CMD ["npm", "run", "start:dev"]