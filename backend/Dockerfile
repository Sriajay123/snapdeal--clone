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

# Add host.docker.internal to hosts file for Windows/Mac compatibility
RUN apt-get update && apt-get install -y iputils-ping

# Set MongoDB connection to use host.docker.internal
ENV NODE_ENV=production
# ENV CONNECTION_URL=mongodb://host.docker.internal:27017/snapdeal

# Start the application using node instead of nodemon for production
CMD ["node", "./src/index.js"]