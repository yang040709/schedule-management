# ---------------- 第一阶段：构建 (使用 pnpm) ----------------
FROM node:22-alpine AS build

# 设置工作目录
WORKDIR /app

# === 关键修改 1: 安装 pnpm ===
# 方法 1: 使用 corepack (Node.js 16.13+ 内置，推荐)
# Node 22 默认启用了 corepack，所以可以直接准备 pnpm
RUN npm install -g pnpm

# === 关键修改 2: 复制 pnpm 相关文件 ===
# 复制 package.json 和 pnpm-lock.yaml (pnpm 的锁文件)
COPY package.json pnpm-lock.yaml ./

# === 关键修改 3: 使用 pnpm 安装依赖 ===
# 使用 pnpm 安装生产依赖 (CI/CD 中通常用 --frozen-lockfile 确保可重现性)
RUN pnpm install

# 复制项目源码
COPY . .

# === 关键修改 4: 使用 pnpm 运行构建命令 ===
RUN pnpm run build

# ---------------- 第二阶段：运行 (Nginx) ----------------
FROM nginx:alpine

# 复制 Nginx 配置文件 (强烈建议提供一个，特别是对于 SPA)
COPY nginx.conf /etc/nginx/nginx.conf

# 删除 Nginx 默认的 html 内容
RUN rm -rf /usr/share/nginx/html/*

# 从构建阶段复制构建好的静态文件
COPY --from=build /app/dist /usr/share/nginx/html

# 暴露端口 80
EXPOSE 80

# 启动 Nginx
CMD ["nginx", "-g", "daemon off;"]