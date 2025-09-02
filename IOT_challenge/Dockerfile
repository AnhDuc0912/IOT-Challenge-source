# ---------- Build stage ----------
FROM node:20-bookworm-slim AS builder
WORKDIR /app

# Cài deps theo nền tảng Linux hiện tại
COPY package*.json ./
# Nếu lockfile tạo ở OS khác, dùng npm install để regenerate lock theo Linux:
RUN rm -f package-lock.json && npm install

# Copy source + env (Vite sẽ tự load .env.production khi --mode production)
COPY . .
# Nếu bạn giữ file riêng:
COPY .env.production ./.env.production

RUN npm run build -- --mode production

# ---------- Production stage ----------
FROM nginx:alpine
# Vite output mặc định là /app/dist
COPY --from=builder /app/dist /usr/share/nginx/html
# Nginx conf tuỳ biến (nếu có)
COPY nginx.conf /etc/nginx/conf.d/default.conf