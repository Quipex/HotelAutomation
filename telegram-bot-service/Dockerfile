FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* tsconfig.json ./
RUN npm ci

# Copy source files
COPY src ./src

# Build the application
RUN npm run build

# Production image
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies only
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY .env ./

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV BACKEND_API_URL=http://backend-service:8080/api

EXPOSE 3000

# Run the application
CMD ["node", "dist/index.js"] 