# 🐳 Docker 部署指南

## 📋 概述

本指南介绍如何使用 Docker 容器化部署「汤姆猫学习版」后端。

**优势：**
- ✅ 环境一致性（开发、测试、生产环境相同）
- ✅ 快速部署（打包成镜像，一键启动）
- ✅ 易于扩展（支持 Kubernetes、Docker Swarm）
- ✅ 资源隔离（独立的运行环境）

---

## 🎯 方法1：使用 Docker（单独后端）

### 前置要求

- 安装 Docker Desktop
  - Windows: https://www.docker.com/products/docker-desktop/
  - Mac: https://www.docker.com/products/docker-desktop/
  - Linux: `curl -fsSL https://get.docker.com | sh`

### 步骤1：构建镜像

```bash
# 进入后端目录
cd D:\大三上\软件工程课设\tom-learning-app\tom-learning-app

# 构建 Docker 镜像
docker build -t tom-learning-backend:latest .
```

**参数说明：**
- `-t tom-learning-backend:latest` - 镜像名称和标签
- `.` - Dockerfile 所在目录

**⏳ 首次构建可能需要 5-10 分钟**（下载依赖和基础镜像）

### 步骤2：运行容器

```bash
# 运行容器（H2 内存数据库）
docker run -d \
  --name tom-backend \
  -p 8081:8080 \
  -e SPRING_PROFILES_ACTIVE=default \
  tom-learning-backend:latest
```

**参数说明：**
- `-d` - 后台运行
- `--name tom-backend` - 容器名称
- `-p 8081:8080` - 端口映射（主机:容器）
- `-e` - 环境变量

### 步骤3：验证运行

```bash
# 查看容器状态
docker ps

# 查看日志
docker logs tom-backend

# 测试 API
curl http://localhost:8081/api/game/ping
```

### 步骤4：停止和删除

```bash
# 停止容器
docker stop tom-backend

# 删除容器
docker rm tom-backend

# 删除镜像
docker rmi tom-learning-backend:latest
```

---

## 🎯 方法2：使用 Docker Compose（推荐）

### 步骤1：启动所有服务

```bash
# 进入项目目录
cd D:\大三上\软件工程课设\tom-learning-app\tom-learning-app

# 启动（后台运行）
docker-compose up -d

# 或者前台运行（查看日志）
docker-compose up
```

**Docker Compose 会自动：**
1. 构建后端镜像
2. 启动后端容器（端口 8081）
3. 启动 PostgreSQL 容器（端口 5432）
4. 配置网络连接

### 步骤2：查看状态

```bash
# 查看所有容器
docker-compose ps

# 查看日志
docker-compose logs

# 实时查看日志
docker-compose logs -f backend
```

### 步骤3：停止服务

```bash
# 停止所有容器
docker-compose down

# 停止并删除数据卷
docker-compose down -v
```

---

## ☁️ 方法3：部署到 Render（使用 Docker）

### Render 支持两种方式

**方式A：使用 Dockerfile（推荐）**

Render 会自动检测并使用你的 Dockerfile。

**配置：**
1. 在 Render 创建 Web Service
2. 连接 GitHub 仓库
3. **不需要设置 Build Command**（Render 自动构建 Docker 镜像）
4. **不需要设置 Start Command**（使用 Dockerfile 的 ENTRYPOINT）
5. 设置环境变量：
   - `DATABASE_URL` - PostgreSQL 连接字符串
   - `PORT` - 由 Render 自动提供

**方式B：使用 Maven（原有方式）**

如果不想用 Docker，保持原有的构建方式：
- Build Command: `./mvnw clean package -DskipTests`
- Start Command: `java -Dserver.port=$PORT -jar target/*.jar`

---

## 📦 Dockerfile 说明

### 多阶段构建

```dockerfile
# 阶段1：构建（使用 Maven + JDK 21）
FROM maven:3.9.6-eclipse-temurin-21 AS build
# ... 编译 Java 代码 ...

# 阶段2：运行（使用轻量级 JRE 21）
FROM eclipse-temurin:21-jre-alpine
# ... 只包含运行时环境 ...
```

**优势：**
- 最终镜像只包含 JRE 和 JAR 包
- 大小约 200-300 MB（比 JDK 镜像小 50%）
- 启动更快，资源占用更少

### 关键配置

```dockerfile
# 内存限制
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# 端口自适应
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s \
  CMD wget --spider http://localhost:8080/api/game/ping
```

---

## 🔧 环境变量配置

### 开发环境（H2 数据库）

```bash
docker run -d \
  --name tom-backend \
  -p 8081:8080 \
  -e SPRING_PROFILES_ACTIVE=default \
  tom-learning-backend:latest
```

### 生产环境（PostgreSQL）

```bash
docker run -d \
  --name tom-backend \
  -p 8081:8080 \
  -e SPRING_PROFILES_ACTIVE=prod \
  -e DATABASE_URL=postgresql://user:password@host:5432/database \
  -e PORT=8080 \
  tom-learning-backend:latest
```

---

## 🐛 常见问题

### 问题1: 构建失败 "mvn not found"

**原因**: Maven 镜像下载失败

**解决**:
```bash
# 手动拉取镜像
docker pull maven:3.9.6-eclipse-temurin-21

# 然后重新构建
docker build -t tom-learning-backend:latest .
```

---

### 问题2: 容器启动后立即退出

**原因**: 应用启动失败

**解决**:
```bash
# 查看日志
docker logs tom-backend

# 或者以交互模式运行
docker run -it tom-learning-backend:latest
```

---

### 问题3: 端口已被占用

**错误**: `port is already allocated`

**解决**:
```bash
# 查找占用端口的容器
docker ps | grep 8081

# 停止容器
docker stop <容器ID>

# 或者使用其他端口
docker run -p 8082:8080 ...
```

---

### 问题4: 无法连接到容器

**原因**: 防火墙或网络配置

**解决**:
```bash
# 检查容器网络
docker inspect tom-backend | grep IPAddress

# 检查端口映射
docker port tom-backend

# 测试连接
curl http://localhost:8081/api/game/ping
```

---

## 📊 性能优化

### 1. 使用构建缓存

```dockerfile
# 先复制 pom.xml，利用 Docker 缓存层
COPY pom.xml .
RUN mvn dependency:go-offline

# 然后复制源代码
COPY src ./src
RUN mvn package
```

### 2. 减小镜像大小

```dockerfile
# 使用 alpine 基础镜像（更小）
FROM eclipse-temurin:21-jre-alpine

# 删除不必要的文件
RUN rm -rf /var/cache/apk/*
```

### 3. 多线程构建

```bash
# 使用多核 CPU
docker build --build-arg MAVEN_OPTS="-T 1C" -t tom-learning-backend .
```

---

## 🔐 安全最佳实践

### 1. 使用非 root 用户

```dockerfile
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
```

### 2. 不要在镜像中存储敏感信息

```bash
# ❌ 错误：硬编码密码
ENV DATABASE_PASSWORD=secret123

# ✅ 正确：使用运行时环境变量
docker run -e DATABASE_URL=$DATABASE_URL ...
```

### 3. 定期更新基础镜像

```bash
# 拉取最新镜像
docker pull eclipse-temurin:21-jre-alpine

# 重新构建
docker build --no-cache -t tom-learning-backend:latest .
```

---

## 📝 快速命令参考

### 构建和运行

```bash
# 构建镜像
docker build -t tom-learning-backend .

# 运行容器
docker run -d -p 8081:8080 --name tom-backend tom-learning-backend

# 查看日志
docker logs -f tom-backend

# 进入容器
docker exec -it tom-backend sh

# 停止容器
docker stop tom-backend

# 删除容器
docker rm tom-backend
```

### Docker Compose

```bash
# 启动所有服务
docker-compose up -d

# 停止所有服务
docker-compose down

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart backend

# 重新构建
docker-compose up -d --build
```

### 清理

```bash
# 删除所有停止的容器
docker container prune

# 删除未使用的镜像
docker image prune

# 删除所有未使用的资源
docker system prune -a
```

---

## 🎯 部署清单

部署前确认：

- [ ] Dockerfile 已创建
- [ ] .dockerignore 已配置
- [ ] 本地测试构建成功
- [ ] 容器启动正常
- [ ] API 测试通过
- [ ] 环境变量已配置
- [ ] 推送代码到 GitHub

---

## 📚 相关资源

- **Docker 官方文档**: https://docs.docker.com/
- **Spring Boot Docker 指南**: https://spring.io/guides/gs/spring-boot-docker/
- **Render Docker 部署**: https://render.com/docs/docker

---

**使用 Docker 让部署更简单！** 🐳🚀

