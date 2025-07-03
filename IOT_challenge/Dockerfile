# Dùng đúng Node version mà react-router yêu cầu (Node 20+)
FROM node:20-alpine AS builder

WORKDIR /app

# Tách bước install để cache npm hiệu quả
COPY package*.json ./
RUN npm install

# Nếu cần: cài thêm rollup theo cách sạch
RUN npm install rollup --save-dev

# Sau cùng mới copy source và build
COPY . .
RUN npm run build

# Sử dụng nginx để serve frontend
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
