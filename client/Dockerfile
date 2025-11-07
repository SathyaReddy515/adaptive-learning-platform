# Use an official Node.js runtime
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the app's code
COPY . .

# Expose the React port
EXPOSE 3000

# Command to start the React dev server
CMD ["npm", "start"]