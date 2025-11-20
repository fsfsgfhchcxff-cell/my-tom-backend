@echo off
chcp 65001 >nul
color 0A
echo ================================================
echo         🚀 汤姆猫学习版 - 后端启动器
echo ================================================
echo.

cd /d "%~dp0tom-learning-app"

echo [检查] 正在检查 Java 环境...
java -version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo.
    echo ❌ 错误：未检测到 Java！
    echo.
    echo 💡 解决方案：
    echo    1. 下载并安装 JDK 21: https://adoptium.net/
    echo    2. 安装后重启电脑
    echo    3. 再次运行此脚本
    echo.
    pause
    exit /b 1
)

echo [检查] Java 环境 ✅
echo.

echo [检查] 正在检查 8081 端口...
netstat -ano | findstr :8081 | findstr LISTENING >nul
if not errorlevel 1 (
    color 0E
    echo.
    echo ⚠️  警告：8081 端口已被占用！
    echo.
    set /p kill="是否要终止占用进程？(Y/N): "
    if /i "%kill%"=="Y" (
        for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
            echo 正在终止进程 %%a...
            taskkill /F /PID %%a >nul 2>&1
        )
        echo 进程已终止！
        timeout /t 2 >nul
    ) else (
        echo 已取消，请手动解决端口占用问题
        pause
        exit /b 1
    )
)

echo [检查] 端口 8081 可用 ✅
echo.

echo ================================================
echo         🎯 开始启动后端服务...
echo ================================================
echo.
echo 💡 提示：
echo    - 启动可能需要 1-2 分钟，请耐心等待
echo    - 看到 "Started TomLearningAppApplication" 表示成功
echo    - 不要关闭此窗口！
echo.
echo ================================================
echo.

call mvnw.cmd spring-boot:run

pause

