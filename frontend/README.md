# 🐱 汤姆猫学习版 - React 前端

超可爱的三丽鸥风格 React 应用！

## 🎨 设计风格

- **配色**: 马卡龙粉嫩色系（粉色、紫色、蓝色、黄色）
- **风格**: 三丽鸥 (Sanrio) / Kawaii 可爱风
- **特效**: 
  - 糖果按钮（3D 压下效果）
  - 浮动动画
  - 圆润大圆角
  - 柔和阴影

## 🚀 快速开始

### 1. 安装依赖

```bash
cd frontend
npm install
```

### 2. 启动开发服务器

```bash
npm start
```

应用将在 http://localhost:3000 打开

### 3. 确保后端运行

后端需要在 http://localhost:8081 运行

```bash
cd ../tom-learning-app
mvnw spring-boot:run
```

## 📦 技术栈

- **React** 18.2.0
- **Tailwind CSS** 3.3.0 - 样式框架
- **Lucide React** - 图标库
- **Axios** - HTTP 客户端

## 🎮 功能模块

### 1. 主页 (HomePage)
- 显示用户信息和钻石余额
- 汤姆猫展示
- 每日签到功能
- 今日数据统计

### 2. 学习计时器 (StudyTimer)
- 可爱的圆形进度条
- 自定义学习时长（10/15/25/30分钟）
- 学习完成庆祝动画
- 自动计算钻石奖励

### 3. 商店 (ShopPage)
- 商品分类浏览
- 糖果风格商品卡片
- 购买功能与钻石扣除
- 购买成功特效

### 4. 背包 (InventoryPage)
- 查看已购买物品
- 装备/使用物品
- 食物数量显示
- 装备状态标识

## 🎨 自定义配色

在 `tailwind.config.js` 中定义了可爱配色：

```javascript
'kawaii-pink': '#FFB6D9',
'kawaii-blue': '#B4E4FF',
'kawaii-purple': '#E5D4FF',
'kawaii-yellow': '#FFF4B7',
'kawaii-mint': '#D4FFE3',
```

## 🔌 API 对接

所有 API 请求通过 proxy 转发到 `http://localhost:8081`

主要接口：
- `GET /api/game/home/{userId}` - 获取主页数据
- `POST /api/users/{userId}/checkin` - 每日签到
- `POST /api/study/start` - 开始学习
- `POST /api/study/end/{sessionId}` - 结束学习
- `GET /api/items` - 获取商品列表
- `POST /api/shop/purchase` - 购买商品
- `GET /api/shop/inventory/{userId}` - 获取背包
- `POST /api/shop/equip` - 装备物品

## 📱 组件结构

```
src/
├── App.js              # 主应用 + 路由 + 登录
├── components/
│   ├── HomePage.js     # 主页
│   ├── StudyTimer.js   # 学习计时器
│   ├── ShopPage.js     # 商店
│   └── InventoryPage.js # 背包
├── index.js            # 入口文件
└── index.css           # 全局样式
```

## 🎯 按钮样式示例

所有按钮都遵循"糖果按钮"设计：

```jsx
<button className="bg-gradient-to-b from-pink-400 to-pink-500 text-white px-6 py-3 rounded-2xl border-b-4 border-pink-600 active:border-b-0 active:translate-y-1 transition-all font-bold shadow-lg">
  点我！
</button>
```

## 🌟 特色功能

- ✨ 流畅的动画效果
- 🎨 完全响应式设计
- 💝 可爱的视觉反馈
- 🎵 预留音效接口
- 📱 移动端优化
- 🎭 加载状态处理
- 🎊 成功/失败提示

## 📝 开发建议

1. 保持代码简洁，组件化
2. 遵循 Tailwind CSS 命名规范
3. 使用 `lucide-react` 图标保持风格统一
4. 所有交互都要有视觉反馈
5. 保持 Kawaii 可爱风格一致性

## 🚢 生产构建

```bash
npm run build
```

构建产物在 `build/` 目录

---

**让学习变得更可爱！** 🐱💖✨

