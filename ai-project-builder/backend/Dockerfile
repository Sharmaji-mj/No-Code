# backend/Dockerfile
FROM node:22-bookworm-slim

# Optional: ensure consistent npm
# RUN npm i -g npm@11

WORKDIR /app

# Install build tooling in case node-gyp is still needed
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ python3-distutils ca-certificates \
 && rm -rf /var/lib/apt/lists/*

# Copy manifests first for layer caching
COPY package.json package-lock.json* ./

# Prefer CI; fall back to install if lock isn’t in sync
RUN npm ci || npm install

# Copy the rest
COPY . .

ENV NODE_ENV=development
ENV PORT=5000

EXPOSE 5000
CMD ["npm", "run", "dev"]
