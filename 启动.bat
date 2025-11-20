@echo off
chcp 65001 >nul
echo ================================
echo 🐱 启动汤姆猫学习版...
echo ================================
echo.

cd /d "%~dp0"
call mvnw.cmd spring-boot:run

pause

