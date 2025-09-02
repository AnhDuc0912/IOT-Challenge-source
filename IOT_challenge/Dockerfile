# Stage build frontend
FROM node:20-alpine AS builder
WORKDIR /app

# 1) Chỉ copy package*.json trước để cache tốt
COPY package*.json ./

# 2) XÓA lockfile cũ & cài deps theo nền tảng hiện tại (alpine/musl)
RUN rm -f package-lock.json && npm install

# 3) Copy source và env vào
COPY . .
# (Bạn đang copy .env.production, ok)
# COPY .env.production ./.env.production

# 4) Build
RUN npm run build -- --mode production

# Production stage
FROM nginx:alpine
# Vite output mặc định là /app/dist
COPY --from=builder /app/dist /usr/share/nginx/html
# Nginx conf tuỳ biến (nếu có)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]