FROM node:18-alpine

WORKDIR /usr/src/app

# Copy package files
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install --production

# Copy source code and environment file
COPY src/ ./src/
COPY .env ./

# Expose port
EXPOSE 3000

# Start the application
CMD ["node", "src/app.js"]
