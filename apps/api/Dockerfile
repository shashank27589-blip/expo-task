FROM node:20-alpine

WORKDIR /app

# Copy root package files
COPY package.json package-lock.json ./

# Copy API package files
COPY apps/api/package.json apps/api/package-lock.json ./apps/api/

# Install dependencies
RUN npm ci

# Copy source code
COPY apps/api ./apps/api

# Build
WORKDIR /app/apps/api
RUN npm run build

# Expose port
EXPOSE 4000

# Start
CMD ["npm", "start"]
