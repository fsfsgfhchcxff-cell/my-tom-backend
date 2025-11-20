@echo off
chcp 65001 >nul
color 0B
cls

echo ================================================
echo         ⚡ 汤姆猫学习版 - 快速启动
echo ================================================
echo.

REM 获取脚本所在目录
set "SCRIPT_DIR=%~dp0"

echo [1/3] 检查 Java 环境...
java -version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ 未检测到 Java！
    echo.
    echo 请安装 Java 21 或更高版本
    echo 下载地址：https://adoptium.net/
    echo.
    pause
    exit /b 1
)
echo ✅ Java 环境正常
echo.

echo [2/3] 检查端口占用...
netstat -ano | findstr :8081 | findstr LISTENING >nul
if not errorlevel 1 (
    color 0E
    echo ⚠️  8081 端口被占用！正在尝试清理...
    for /f "tokens=5" %%a in ('netstat -ano ^| findstr :8081 ^| findstr LISTENING') do (
        taskkill /F /PID %%a >nul 2>&1
        echo    已终止进程 %%a
    )
    timeout /t 2 >nul
)
echo ✅ 端口 8081 可用
echo.

echo [3/3] 启动后端服务...
echo.
echo ================================================
echo         🚀 启动中，请稍候...
echo ================================================
echo.

cd /d "%SCRIPT_DIR%tom-learning-app"

if not exist "mvnw.cmd" (
    color 0C
    echo ❌ 错误：找不到项目文件！
    echo 当前路径：%CD%
    echo.
    pause
    exit /b 1
)

start "汤姆猫后端" cmd /k "color 0A && mvnw.cmd spring-boot:run"

echo.
echo ✅ 后端正在启动...
echo 💡 已在新窗口中打开，等待看到 "Started" 提示
echo.

timeout /t 5 >nul

echo ================================================
echo         🌐 访问地址
echo ================================================
echo.
echo   原生前端：http://localhost:8081
echo   React前端：http://localhost:3000 (需先运行 npm start)
echo   H2数据库：http://localhost:8081/h2-console
echo   API测试： http://localhost:8081/api/game/ping
echo.
echo ================================================

pause

