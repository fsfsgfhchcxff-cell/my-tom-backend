@echo off
chcp 65001 >nul
color 0B
cls

echo ================================================
echo         🚀 Git 推送后端到 GitHub
echo ================================================
echo.

REM 进入后端目录
cd /d "%~dp0tom-learning-app"

echo [检查] 检查 Git 是否安装...
git --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo ❌ 错误：未检测到 Git！
    echo.
    echo 💡 请先安装 Git：https://git-scm.com/download/win
    echo.
    pause
    exit /b 1
)
echo ✅ Git 已安装
echo.

echo ================================================
echo         📝 准备推送
echo ================================================
echo.
echo 当前目录：%CD%
echo.

REM 检查是否已经是 Git 仓库
if exist ".git" (
    echo ⚠️  检测到已存在的 Git 仓库
    echo.
    set /p continue="是否继续？这将添加新的提交 (Y/N): "
    if /i not "%continue%"=="Y" (
        echo 已取消
        pause
        exit /b 0
    )
) else (
    echo [1/6] 初始化 Git 仓库...
    git init
    if errorlevel 1 (
        color 0C
        echo ❌ 初始化失败
        pause
        exit /b 1
    )
    echo ✅ 初始化成功
    echo.
)

echo [2/6] 添加文件到暂存区...
git add .
if errorlevel 1 (
    color 0C
    echo ❌ 添加文件失败
    pause
    exit /b 1
)
echo ✅ 文件已添加
echo.

echo [3/6] 创建提交...
git commit -m "🎉 Initial commit: 汤姆猫学习版后端 (Spring Boot + JPA + H2)"
if errorlevel 1 (
    echo ⚠️  提交失败（可能没有新的改动）
    echo.
)
echo.

echo [4/6] 设置主分支为 main...
git branch -M main
echo ✅ 分支设置完成
echo.

echo ================================================
echo         🔗 设置远程仓库
echo ================================================
echo.
echo 💡 请在 GitHub 创建一个新仓库，例如：tom-learning-backend
echo    创建时不要勾选 "Add a README file"
echo.
echo 📝 示例地址：
echo    https://github.com/你的用户名/tom-learning-backend.git
echo.

set /p repo_url="请输入你的 GitHub 仓库地址: "

if "%repo_url%"=="" (
    color 0C
    echo ❌ 错误：未输入仓库地址
    pause
    exit /b 1
)

echo.
echo [5/6] 添加远程仓库...

REM 检查是否已有 origin
git remote get-url origin >nul 2>&1
if not errorlevel 1 (
    echo ⚠️  检测到已存在的 origin，正在更新...
    git remote set-url origin %repo_url%
) else (
    git remote add origin %repo_url%
)

if errorlevel 1 (
    color 0C
    echo ❌ 添加远程仓库失败
    pause
    exit /b 1
)
echo ✅ 远程仓库已设置
echo.

echo [6/6] 推送到 GitHub...
echo.
echo ⏳ 正在推送，请稍候...
echo 💡 如果弹出登录窗口，请输入 GitHub 用户名和密码（或 Personal Access Token）
echo.

git push -u origin main

if errorlevel 1 (
    color 0E
    echo.
    echo ⚠️  推送失败！
    echo.
    echo 💡 常见原因和解决方案：
    echo.
    echo 1. 认证失败
    echo    → 使用 Personal Access Token 代替密码
    echo    → GitHub Settings → Developer settings → Personal access tokens
    echo.
    echo 2. 远程仓库不是空的
    echo    → 执行：git pull origin main --allow-unrelated-histories
    echo    → 然后再次运行此脚本
    echo.
    echo 3. 网络问题
    echo    → 检查网络连接
    echo    → 尝试使用代理或 VPN
    echo.
    pause
    exit /b 1
)

color 0A
echo.
echo ================================================
echo         🎉 推送成功！
echo ================================================
echo.
echo ✅ 后端代码已成功推送到 GitHub
echo.
echo 🌐 访问你的仓库：
echo    %repo_url%
echo.
echo 📝 后续更新代码：
echo    1. git add .
echo    2. git commit -m "描述你的修改"
echo    3. git push
echo.
echo ================================================
pause

