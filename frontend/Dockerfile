# Build stage
FROM node:18-alpine as build-stage

WORKDIR /usr/src/app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Serve stage
FROM nginx:stable-alpine as serve-stage

# Copy built files from build stage
COPY --from=build-stage /usr/src/app/dist/erp-frontend /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
