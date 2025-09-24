# Use Node.js LTS
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy project files
COPY tsconfig.json ./
COPY src ./src

# Build TypeScript 
RUN npm run build

# Expose port
EXPOSE 4000

# Start the server
CMD [ "node","dist/server.js" ]