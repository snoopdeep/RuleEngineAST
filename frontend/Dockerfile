# Frontend Dockerfile

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

# Build the frontend
RUN npm run build

# Expose port (the default for the frontend)
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
