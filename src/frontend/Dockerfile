# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency graphs first to cache the layer
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build
COPY . .
RUN npm run build

# Production serve stage
FROM nginx:alpine

# Copy the built Vite output from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Overwrite Nginx default config to support React Router client-side routing
RUN echo $'server { \n\
    listen 80; \n\
    location / { \n\
        root /usr/share/nginx/html; \n\
        index index.html index.htm; \n\
        try_files $uri $uri/ /index.html; \n\
    } \n\
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
