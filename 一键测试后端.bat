@echo off
chcp 65001 >nul
color 0B
echo ================================================
echo         🔍 后端服务测试工具
echo ================================================
echo.

echo [测试 1] 检查 Java 环境
java -version
if errorlevel 1 (
    echo ❌ Java 未安装
) else (
    echo ✅ Java 已安装
)
echo.

echo [测试 2] 检查 8081 端口状态
netstat -ano | findstr :8081 | findstr LISTENING >nul
if errorlevel 1 (
    color 0C
    echo ❌ 8081 端口未监听（后端未启动）
    echo.
    echo 💡 请先运行 "一键启动后端.bat" 启动后端服务
) else (
    echo ✅ 8081 端口已监听（后端正在运行）
)
echo.

echo [测试 3] 尝试访问后端 API
echo 正在连接 http://localhost:8081/api/game/ping ...
curl -s http://localhost:8081/api/game/ping
if errorlevel 1 (
    color 0C
    echo.
    echo ❌ 无法连接到后端
    echo.
    echo 💡 可能原因：
    echo    1. 后端还未完全启动（等待1-2分钟）
    echo    2. 防火墙阻止了连接
    echo    3. 端口配置错误
) else (
    color 0A
    echo.
    echo ✅ 后端连接成功！
    echo.
    echo 🎉 你可以访问以下地址：
    echo    - 前端页面: http://localhost:3000
    echo    - 后端 API: http://localhost:8081/api/game/ping
    echo    - H2 数据库: http://localhost:8081/h2-console
)
echo.

echo ================================================
echo         测试完成
echo ================================================
pause

