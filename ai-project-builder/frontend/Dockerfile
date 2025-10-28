
# ---------- Frontend (React/CRA) Dev Image ----------
FROM node:18-alpine AS base

# Some packages need this for native deps & watchers
RUN apk add --no-cache libc6-compat

WORKDIR /app

# Install deps with good layer caching
COPY package.json package-lock.json* ./
# If you use pnpm or yarn, swap the installer accordingly
RUN npm ci || npm install

# Copy the rest (compose will mount your source over /app at runtime)
COPY . .

# Dev-friendly env (compose can override)
ENV NODE_ENV=development \
    HOST=0.0.0.0 \
    PORT=3001 \
    # Node heap (helps large CRA builds)
    NODE_OPTIONS=--max_old_space_size=4096 \
    # Watchers (Docker+Windows/Mac friendliness)
    CHOKIDAR_USEPOLLING=true \
    CHOKIDAR_INTERVAL=1500 \
    WATCHPACK_POLLING=true \
    WATCHPACK_POLLING_INTERVAL=1500 \
    WATCHPACK_IGNORE_NOT_FOUND=true \
    # CRA quality-of-life
    DISABLE_ESLINT_PLUGIN=true \
    FAST_REFRESH=false \
    GENERATE_SOURCEMAP=false

EXPOSE 3001

# Default (docker-compose overrides with its `command`)
CMD [ "npm", "start" ]
# # Stage 1: Build the React app
# FROM node:18-alpine

# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .

# EXPOSE 3000
# CMD ["npm", "start"]

# # FROM node:18-alpine AS build

# # WORKDIR /app

# # # Copy only package files first (for better Docker cache)
# # COPY package*.json ./

# # # Install dependencies
# # RUN npm install

# # # Copy the rest of the frontend source code
# # COPY . . 

# # # Build the React app
# # RUN npm run build

# # # Stage 2: Serve the app using Nginx
# # FROM nginx:alpine

# # # Copy the build output from the previous stage
# # COPY --from=build /app/build /usr/share/nginx/html

# # # Expose port 80 for web traffic
# # EXPOSE 80

# # # Start Nginx server
# # CMD ["nginx", "-g", "daemon off;"]

# # # # # Stage 1: Build the React app
# # # # FROM node:18-alpine AS build

# # # # WORKDIR /app
# # # # COPY frontend/package*.json ./
# # # # RUN npm install
# # # # COPY . .
# # # # COPY ./frontend ./
# # # # RUN npm run build

# # # # # Stage 2: Serve using a lightweight web server
# # # # FROM node:18-alpine

# # # # WORKDIR /app
# # # # COPY --from=build /app .
# # # # EXPOSE 3000
# # # # CMD ["npm", "start"]


# # # # Stage 1: Build the React app
# # # FROM node:18-alpine AS build

# # # WORKDIR /app

# # # # Copy package files from the frontend folder
# # # COPY ./frontend/package*.json ./

# # # Install dependencies
# # RUN npm install

# # # Copy all other frontend files
# # COPY ./frontend ./

# # # Build the React app
# # RUN npm run build

# # # Stage 2: Serve the build using nginx
# # FROM nginx:alpine

# # COPY --from=build /app/build /usr/share/nginx/html

# # EXPOSE 80

# # CMD ["nginx", "-g", "daemon off;"]

