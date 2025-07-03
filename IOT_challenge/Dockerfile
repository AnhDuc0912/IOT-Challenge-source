# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json và package-lock.json để cache dependencies
COPY package*.json ./
RUN npm cache clean --force && npm install

# Nếu Rollup không cần thiết, bỏ dòng này
RUN npm install rollup --save-dev

# Copy toàn bộ mã nguồn
COPY . .

# Copy tệp .env.production (nếu cần) hoặc đặt biến môi trường
# Ví dụ: truyền biến môi trường trực tiếp trong build
ARG VITE_API_ENDPOINT
ENV VITE_API_ENDPOINT=$VITE_API_ENDPOINT

# Build ứng dụng với chế độ production
RUN npm run build -- --mode production

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]