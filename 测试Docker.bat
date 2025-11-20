@echo off
chcp 65001 >nul
color 0B
cls

echo ================================================
echo         🐳 Docker 测试工具
echo ================================================
echo.

cd /d "%~dp0tom-learning-app"

echo [1/6] 检查 Docker 是否安装...
docker --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ Docker 未安装
    echo.
    echo 💡 请先安装 Docker Desktop:
    echo    https://www.docker.com/products/docker-desktop/
    echo.
    pause
    exit /b 1
)
echo ✅ Docker 已安装
docker --version
echo.

echo [2/6] 检查 Docker 是否运行...
docker ps >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ Docker 未运行
    echo.
    echo 💡 请启动 Docker Desktop
    echo.
    pause
    exit /b 1
)
echo ✅ Docker 正在运行
echo.

echo [3/6] 检查 Dockerfile 是否存在...
if not exist "Dockerfile" (
    color 0C
    echo ❌ Dockerfile 不存在
    echo.
    echo 💡 当前目录：%CD%
    echo.
    pause
    exit /b 1
)
echo ✅ Dockerfile 存在
echo.

echo [4/6] 构建 Docker 镜像...
echo ⏳ 正在构建，首次构建可能需要 5-10 分钟...
echo.

docker build -t tom-learning-backend:test .

if errorlevel 1 (
    color 0C
    echo.
    echo ❌ 构建失败
    echo.
    echo 💡 请查看上面的错误信息
    pause
    exit /b 1
)

color 0A
echo.
echo ✅ 镜像构建成功
echo.

echo [5/6] 运行容器...
echo.

REM 检查端口是否被占用
netstat -ano | findstr :8081 | findstr LISTENING >nul
if not errorlevel 1 (
    echo ⚠️  端口 8081 已被占用，使用 8082
    set PORT_MAPPING=8082:8080
    set TEST_PORT=8082
) else (
    set PORT_MAPPING=8081:8080
    set TEST_PORT=8081
)

REM 停止旧容器（如果存在）
docker stop tom-backend-test >nul 2>&1
docker rm tom-backend-test >nul 2>&1

REM 运行新容器
docker run -d ^
    --name tom-backend-test ^
    -p %PORT_MAPPING% ^
    -e SPRING_PROFILES_ACTIVE=default ^
    tom-learning-backend:test

if errorlevel 1 (
    color 0C
    echo ❌ 容器启动失败
    pause
    exit /b 1
)

echo ✅ 容器已启动
echo.

echo [6/6] 等待应用启动...
timeout /t 10 >nul

echo.
echo 📊 容器状态：
docker ps | findstr tom-backend-test
echo.

echo ================================================
echo         🧪 测试 API
echo ================================================
echo.
echo 🌐 访问地址：http://localhost:%TEST_PORT%
echo.
echo 💡 测试命令：
echo    curl http://localhost:%TEST_PORT%/api/game/ping
echo.

timeout /t 5 >nul

curl -s http://localhost:%TEST_PORT%/api/game/ping
if errorlevel 1 (
    color 0E
    echo.
    echo ⚠️  API 暂时无法访问（应用可能还在启动）
    echo.
    echo 💡 查看日志：
    echo    docker logs tom-backend-test
    echo.
) else (
    color 0A
    echo.
    echo.
    echo ✅ API 测试成功！
    echo.
)

echo ================================================
echo         📝 常用命令
echo ================================================
echo.
echo 查看日志：
echo   docker logs -f tom-backend-test
echo.
echo 进入容器：
echo   docker exec -it tom-backend-test sh
echo.
echo 停止容器：
echo   docker stop tom-backend-test
echo.
echo 删除容器：
echo   docker rm tom-backend-test
echo.
echo 删除镜像：
echo   docker rmi tom-learning-backend:test
echo.
echo ================================================
pause

