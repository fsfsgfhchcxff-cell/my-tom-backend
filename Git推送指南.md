# 🚀 Git 推送完整指南

## 📋 准备工作

### 1. 创建 GitHub 仓库

去 GitHub 创建两个仓库：

1. **后端仓库**：例如 `tom-learning-backend`
2. **前端仓库**：例如 `tom-learning-frontend`

⚠️ **重要**：创建时不要勾选 "Add a README file"，保持空仓库！

---

## 🎯 方法1：使用自动化脚本（推荐）⭐

### 后端推送

1. 打开 PowerShell 或 CMD
2. 进入后端目录：
```bash
cd D:\大三上\软件工程课设\tom-learning-app\tom-learning-app
```

3. 双击运行：`Git推送后端.bat`

4. 按提示输入你的 GitHub 仓库地址

### 前端推送

1. 打开新的 PowerShell 或 CMD
2. 进入前端目录：
```bash
cd D:\大三上\软件工程课设\tom-learning-app\frontend
```

3. 双击运行：`Git推送前端.bat`

4. 按提示输入你的 GitHub 仓库地址

---

## 🎯 方法2：手动操作（适合了解 Git 的用户）

### 步骤1：推送后端

打开终端，进入后端目录：

```bash
# 进入后端目录
cd D:\大三上\软件工程课设\tom-learning-app\tom-learning-app

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "🎉 Initial commit: 汤姆猫学习版后端"

# 设置主分支名称
git branch -M main

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/tom-learning-backend.git

# 推送到 GitHub
git push -u origin main
```

### 步骤2：推送前端

打开**新的终端**，进入前端目录：

```bash
# 进入前端目录
cd D:\大三上\软件工程课设\tom-learning-app\frontend

# 初始化 Git 仓库
git init

# 添加所有文件
git add .

# 提交
git commit -m "🎨 Initial commit: 汤姆猫学习版前端 (React)"

# 设置主分支名称
git branch -M main

# 添加远程仓库（替换为你的仓库地址）
git remote add origin https://github.com/你的用户名/tom-learning-frontend.git

# 推送到 GitHub
git push -u origin main
```

---

## 📦 项目结构说明

### 后端项目 (Spring Boot)
```
tom-learning-app/
├── src/
│   ├── main/
│   │   ├── java/
│   │   └── resources/
│   └── test/
├── pom.xml
├── mvnw
├── mvnw.cmd
└── .gitignore
```

### 前端项目 (React)
```
frontend/
├── public/
├── src/
│   ├── components/
│   ├── App.js
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── .gitignore
```

---

## ⚠️ 常见问题

### 问题1：提示 "git: command not found"

**原因**：Git 未安装

**解决**：
1. 下载 Git：https://git-scm.com/download/win
2. 安装后重启终端
3. 验证：`git --version`

---

### 问题2：推送时要求输入用户名和密码

**原因**：需要 GitHub 认证

**解决方案A：使用 Personal Access Token（推荐）**

1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. 点击 "Generate new token (classic)"
3. 勾选 `repo` 权限
4. 生成并复制 token
5. 推送时：
   - Username: 你的 GitHub 用户名
   - Password: 粘贴 token（不是你的密码！）

**解决方案B：使用 SSH**

```bash
# 生成 SSH 密钥
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"

# 添加到 GitHub
# 复制 ~/.ssh/id_rsa.pub 的内容
# GitHub → Settings → SSH and GPG keys → New SSH key

# 使用 SSH 地址推送
git remote set-url origin git@github.com:用户名/仓库名.git
```

---

### 问题3：提示 "fatal: remote origin already exists"

**原因**：已经添加过远程仓库

**解决**：
```bash
# 查看远程仓库
git remote -v

# 删除旧的
git remote remove origin

# 重新添加
git remote add origin <你的仓库地址>
```

---

### 问题4：推送被拒绝 "Updates were rejected"

**原因**：远程仓库有文件（如 README）

**解决**：
```bash
# 拉取远程内容并合并
git pull origin main --allow-unrelated-histories

# 然后推送
git push -u origin main
```

---

## 🔄 后续更新代码

修改代码后，提交并推送：

### 后端更新
```bash
cd D:\大三上\软件工程课设\tom-learning-app\tom-learning-app

git add .
git commit -m "描述你的修改"
git push
```

### 前端更新
```bash
cd D:\大三上\软件工程课设\tom-learning-app\frontend

git add .
git commit -m "描述你的修改"
git push
```

---

## 📝 提交信息规范（建议）

使用 emoji 和清晰的描述：

```bash
git commit -m "✨ 新功能: 添加每日签到功能"
git commit -m "🐛 修复: 修复购买商品时的钻石扣除问题"
git commit -m "💄 样式: 优化主页卡片的圆角和阴影"
git commit -m "♻️ 重构: 重构学习计时器组件"
git commit -m "📝 文档: 更新 README 和 API 文档"
git commit -m "🚀 部署: 配置生产环境"
```

常用 emoji：
- ✨ `:sparkles:` 新功能
- 🐛 `:bug:` 修复 bug
- 💄 `:lipstick:` 更新 UI 和样式
- ♻️ `:recycle:` 重构代码
- 📝 `:memo:` 添加或更新文档
- 🚀 `:rocket:` 部署相关
- 🔧 `:wrench:` 修改配置文件
- 🎨 `:art:` 改进代码结构

---

## 🎯 验证推送成功

1. 访问你的 GitHub 仓库页面
2. 刷新页面
3. 应该看到所有文件已上传
4. 查看 commit 历史

---

## 🔐 安全建议

### ⚠️ 不要推送敏感信息

确保 `.gitignore` 包含：

```
# 数据库密码
application-prod.properties

# API 密钥
.env
*.key
*.pem

# IDE 配置
.idea/
.vscode/

# 依赖
node_modules/
target/
```

### ✅ 检查推送内容

推送前检查：
```bash
# 查看将要提交的文件
git status

# 查看具体改动
git diff

# 查看暂存区的文件
git diff --cached
```

---

## 📱 移动端 / VS Code 终端操作

### 在 VS Code 中操作

1. 打开 VS Code
2. 按 `Ctrl + `` (反引号) 打开终端
3. 或者：菜单 → 终端 → 新建终端
4. 在终端执行上述命令

### PowerShell vs CMD

**推荐使用 PowerShell**：
- 更强大的命令
- 更好的 Git 集成
- 彩色输出

---

## 🎉 完成后的仓库结构

### GitHub 上的后端仓库
```
tom-learning-backend/
├── README.md (建议添加)
├── src/
├── pom.xml
└── ...
```

### GitHub 上的前端仓库
```
tom-learning-frontend/
├── README.md (建议添加)
├── public/
├── src/
├── package.json
└── ...
```

---

## 📚 学习资源

- **Git 官方文档**：https://git-scm.com/doc
- **GitHub 指南**：https://docs.github.com/zh
- **Pro Git 中文版**：https://git-scm.com/book/zh/v2

---

## 🆘 需要帮助？

如果遇到问题：

1. 查看错误信息
2. 复制完整的错误日志
3. 搜索解决方案
4. 或者运行诊断脚本

---

**祝你推送顺利！** 🎉

有任何问题随时告诉我！

