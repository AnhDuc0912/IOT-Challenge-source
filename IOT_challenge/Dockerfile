# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# copy frontend package.json / lockfile
COPY package*.json ./
RUN npm ci

# copy all frontend sources
COPY . .

# copy env for production if needed
COPY .env.production ./

# build
RUN npm run build -- --mode production

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# optional: copy your nginx.conf if exists
# COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]