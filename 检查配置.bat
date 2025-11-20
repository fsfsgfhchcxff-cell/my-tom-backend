@echo off
chcp 65001 >nul
color 0A
cls

echo ================================================
echo         ✅ 配置检查工具
echo ================================================
echo.

cd /d "%~dp0tom-learning-app"

echo [1/5] 检查 application.properties...
if exist "src\main\resources\application.properties" (
    findstr /C:"spring.datasource.url" "src\main\resources\application.properties" >nul
    if errorlevel 1 (
        echo ❌ 数据库配置缺失
    ) else (
        echo ✅ 找到数据库配置
        findstr /C:"${PORT" "src\main\resources\application.properties" >nul
        if errorlevel 1 (
            echo ⚠️  端口配置需要更新
        ) else (
            echo ✅ 端口配置支持云端部署
        )
    )
) else (
    echo ❌ application.properties 文件不存在
)
echo.

echo [2/5] 检查 PostgreSQL 依赖...
findstr /C:"postgresql" "pom.xml" >nul
if errorlevel 1 (
    echo ❌ 缺少 PostgreSQL 依赖
    echo 💡 需要在 pom.xml 中添加 postgresql 依赖
) else (
    echo ✅ PostgreSQL 依赖已添加
)
echo.

echo [3/5] 检查 .gitignore...
if exist ".gitignore" (
    echo ✅ .gitignore 文件存在
) else (
    echo ⚠️  建议创建 .gitignore 文件
)
echo.

echo [4/5] 检查 Git 仓库状态...
if exist ".git" (
    echo ✅ Git 仓库已初始化
    git status --short
    echo.
    echo 💡 如果有未提交的更改，记得：
    echo    1. git add .
    echo    2. git commit -m "🔧 配置云端部署"
    echo    3. git push
) else (
    echo ⚠️  Git 仓库未初始化
    echo 💡 运行 "Git推送后端.bat" 来初始化并推送
)
echo.

echo [5/5] 检查前端配置...
if exist "..\frontend\package.json" (
    echo ✅ 前端目录存在
    findstr /C:"proxy" "..\frontend\package.json" >nul
    if errorlevel 1 (
        echo ⚠️  前端 proxy 配置可能缺失
    ) else (
        echo ✅ 前端 proxy 配置存在
    )
) else (
    echo ⚠️  前端目录不存在
)
echo.

echo ================================================
echo         📋 配置清单
echo ================================================
echo.
echo ✅ 需要确认的配置：
echo.
echo 1. application.properties
echo    - 支持 H2 (本地) 和 PostgreSQL (云端)
echo    - 端口配置：${PORT:8081}
echo.
echo 2. pom.xml
echo    - 包含 H2 依赖
echo    - 包含 PostgreSQL 依赖
echo.
echo 3. .gitignore
echo    - 排除 target/ 目录
echo    - 排除 IDE 配置文件
echo.
echo 4. Git 仓库
echo    - 已初始化
echo    - 已推送到 GitHub
echo.
echo ================================================
echo         🚀 下一步
echo ================================================
echo.
echo 1. 如果有未提交的更改：
echo    - 运行 "Git推送后端.bat"
echo.
echo 2. 准备部署到 Render：
echo    - 参考 "云端部署指南.md"
echo.
echo 3. 测试本地环境：
echo    - 运行 "快速启动.bat"
echo.
echo ================================================
pause

