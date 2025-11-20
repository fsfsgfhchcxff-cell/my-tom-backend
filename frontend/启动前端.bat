@echo off
chcp 65001 >nul
echo ================================
echo 🎀 启动可爱的 React 前端...
echo ================================
echo.

cd /d "%~dp0"

echo 📦 正在安装依赖...
call npm install

echo.
echo 🚀 启动开发服务器...
call npm start

pause

