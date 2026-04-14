# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files first (layer cache)
COPY package*.json ./

# Install ALL deps — dev + optional — required for Vite + @tailwindcss/oxide native binaries
RUN npm install --include=dev --include=optional --no-audit --no-fund

# Copy source
COPY . .

# Build frontend (outputs to /app/dist)
RUN npm run build

# ── Stage 2: Production runtime ───────────────────────────────────────────────
FROM node:20-slim AS runner

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production deps only (includes tsx, express, pg, etc.)
RUN npm install --omit=dev --no-audit --no-fund

# Copy built frontend from build stage
COPY --from=builder /app/dist ./dist

# Copy server source (tsx executes it directly at runtime)
COPY --from=builder /app/server ./server

# Copy .env.example as reference (real env vars injected by Railway)
COPY --from=builder /app/.env.example ./.env.example

EXPOSE $PORT

CMD ["npm", "start"]
