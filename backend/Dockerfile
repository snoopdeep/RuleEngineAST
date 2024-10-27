# Backend Dockerfile

# Use Node.js as the base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Start the application
CMD ["npm", "run", "start"]
