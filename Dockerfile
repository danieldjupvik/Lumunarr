# Stage 1: Build frontend
FROM node:18.15.0-slim AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files first (for dependency caching)
COPY frontend/package.json frontend/package-lock.json ./

# Install frontend dependencies (cached if package files don't change)
RUN npm ci

# Copy frontend source code
COPY frontend/src ./src
COPY frontend/public ./public

# Build frontend
RUN npm run build

# Stage 2: Build backend and final image
FROM node:18.15.0-slim AS production

ARG BUILD
ENV BUILD=${BUILD}

WORKDIR /Lumunarr

# Copy backend package files first (for dependency caching)
COPY package.json package-lock.json ./

# Install backend dependencies (cached if package files don't change)
RUN npm ci --omit=dev

# Copy backend source code
COPY app.js ./
COPY bin ./bin
COPY backend ./backend
COPY webhook ./webhook
COPY version.json ./

# Copy frontend router (needed at runtime)
COPY frontend/index.js ./frontend/

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/production ./frontend/production

ENTRYPOINT ["node", "./bin/www"]
