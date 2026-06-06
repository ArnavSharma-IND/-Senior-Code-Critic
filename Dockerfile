# Multi-stage build for fully compiled production containers
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies first for caching purposes
COPY package*.json ./
RUN npm install

# Copy source and compile fullstack Express + Vite application
COPY . .
RUN npm run build

# Production Runner stage
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy compiled artifacts from builder stage
COPY --from=builder /app/dist ./dist

# Expose port and start
EXPOSE 3000
CMD ["node", "dist/server.cjs"]
```
