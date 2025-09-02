# Stage build frontend
FROM node:20-alpine AS frontend-builder
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
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]