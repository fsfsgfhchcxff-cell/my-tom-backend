@echo off
chcp 65001 >nul
color 0A
cls

echo ================================================
echo         🐱 汤姆猫学习版 - 后端启动器
echo ================================================
echo.
echo [信息] Java 版本检查...
java -version
echo.
echo ================================================
echo.

REM 进入正确的项目目录
cd /d "%~dp0tom-learning-app"

if not exist "mvnw.cmd" (
    color 0C
    echo ❌ 错误：找不到 mvnw.cmd 文件！
    echo.
    echo 💡 当前目录：%CD%
    echo.
    echo 💡 请确认项目结构是否正确：
    echo    tom-learning-app\
    echo    └── tom-learning-app\
    echo        ├── mvnw.cmd
    echo        ├── pom.xml
    echo        └── src\
    echo.
    pause
    exit /b 1
)

echo [信息] 找到 Maven Wrapper ✅
echo [信息] 当前目录：%CD%
echo.
echo ================================================
echo         🚀 正在启动后端服务...
echo ================================================
echo.
echo ⏳ 首次启动可能需要 5-10 分钟下载依赖
echo 💡 请耐心等待，看到 "Started" 提示表示成功
echo 🚫 启动后请勿关闭此窗口！
echo.
echo ================================================
echo.

call mvnw.cmd spring-boot:run

if errorlevel 1 (
    color 0C
    echo.
    echo ================================================
    echo         ❌ 启动失败！
    echo ================================================
    echo.
    echo 💡 常见解决方案：
    echo    1. 检查 8081 端口是否被占用
    echo    2. 删除 target 目录后重试
    echo    3. 运行：mvnw.cmd clean
    echo    4. 查看上方错误信息
    echo.
)

pause

