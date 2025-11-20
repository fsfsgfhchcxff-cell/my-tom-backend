# ============================================
# 汤姆猫学习版 - Docker 多阶段构建
# ============================================

# --- 第一阶段：构建 (Build) ---
# 使用官方的 Maven + JDK 21 镜像进行编译
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# 复制 Maven 配置文件（利用 Docker 缓存层）
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# 下载依赖（这一层会被缓存，除非 pom.xml 改变）
RUN mvn dependency:go-offline -B

# 复制源代码
COPY src ./src

# 开始编译，跳过测试以节省时间
RUN mvn clean package -DskipTests

# --- 第二阶段：运行 (Run) ---
# 使用轻量级的 JRE 21 镜像运行（体积更小）
FROM eclipse-temurin:21-jre-alpine

# 设置工作目录
WORKDIR /app

# 创建非 root 用户以提高安全性
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# 从构建阶段复制编译好的 jar 包
COPY --from=build /app/target/*.jar app.jar

# 暴露端口（Render 会使用环境变量 PORT）
EXPOSE 8080

# 设置 JVM 参数优化容器运行
ENV JAVA_OPTS="-Xmx512m -Xms256m"

# 健康检查
HEALTHCHECK --interval=30s --timeout=3s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/game/ping || exit 1

# 启动命令（使用 PORT 环境变量）
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]

