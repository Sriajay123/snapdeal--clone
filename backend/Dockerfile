# Use Node.js LTS version
FROM node:18-slim

# Set working directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose port 5000 (the port your backend runs on)
EXPOSE 5000

# Add necessary tools for networking and DNS resolution
RUN apt-get update && apt-get install -y iputils-ping dnsutils

# Set environment variables
ENV NODE_ENV=production

# Start the application using node instead of nodemon for production
CMD ["node", "./src/index.js"]