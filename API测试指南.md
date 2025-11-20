# 🧪 API测试指南

## 使用Postman或curl进行测试

### 1️⃣ 测试GameController（新增的主控制器）

#### 测试1: 健康检查
```bash
curl http://localhost:8081/api/game/ping
```

**预期响应**:
```json
{
  "status": "ok",
  "message": "游戏服务运行正常！🎮"
}
```

---

#### 测试2: 获取用户首页数据（用户不存在时自动创建）
```bash
# 第一次访问 - 会自动创建用户并初始化100钻石
curl http://localhost:8081/api/game/home/1
```

**预期响应**:
```json
{
  "userId": 1,
  "username": "用户1",
  "diamonds": 100,
  "totalStudyMinutes": 0,
  "lastCheckIn": null
}
```

---

#### 测试3: 增加用户钻石
```bash
curl -X POST http://localhost:8081/api/game/diamonds/1/add \
  -H "Content-Type: application/json" \
  -d '{"amount": 50}'
```

**预期响应**:
```json
{
  "userId": 1,
  "username": "用户1",
  "diamonds": 150,
  "message": "成功增加 50 钻石！"
}
```

---

### 2️⃣ 测试用户管理

#### 测试4: 创建新用户
```bash
curl -X POST http://localhost:8081/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "小明"}'
```

**预期响应**:
```json
{
  "id": 2,
  "username": "小明",
  "diamondBalance": 50,
  "lastCheckIn": null,
  "totalStudyMinutes": 0
}
```

---

#### 测试5: 每日签到
```bash
curl -X POST http://localhost:8081/api/users/2/checkin
```

**预期响应**:
```json
{
  "message": "签到成功！获得10钻石",
  "user": {
    "id": 2,
    "username": "小明",
    "diamondBalance": 60,
    "lastCheckIn": "2025-11-20",
    "totalStudyMinutes": 0
  }
}
```

---

### 3️⃣ 测试学习系统

#### 测试6: 开始学习
```bash
curl -X POST http://localhost:8081/api/study/start \
  -H "Content-Type: application/json" \
  -d '{"userId": 2}'
```

**预期响应**:
```json
{
  "message": "开始学习！加油！",
  "session": {
    "id": 1,
    "userId": 2,
    "startTime": "2025-11-20T10:30:00",
    "endTime": null,
    "durationMinutes": null,
    "diamondsEarned": 0
  }
}
```

**记录返回的sessionId，用于结束学习！**

---

#### 测试7: 结束学习
```bash
# 等待至少1分钟后执行
# 将 {sessionId} 替换为上一步返回的session.id
curl -X POST http://localhost:8081/api/study/end/1
```

**预期响应**:
```json
{
  "message": "学习完成！用时5分钟，获得0钻石",
  "session": {
    "id": 1,
    "userId": 2,
    "startTime": "2025-11-20T10:30:00",
    "endTime": "2025-11-20T10:35:00",
    "durationMinutes": 5,
    "diamondsEarned": 0
  }
}
```

💡 **注意**: 每10分钟学习才能获得1钻石！

---

### 4️⃣ 测试商店系统

#### 测试8: 查看所有商品
```bash
curl http://localhost:8081/api/items
```

**预期响应**: 返回所有商品列表（20+个商品）

---

#### 测试9: 按类型查看商品
```bash
# 查看食物
curl http://localhost:8081/api/items/type/FOOD

# 查看衣服
curl http://localhost:8081/api/items/type/CLOTH

# 查看家具
curl http://localhost:8081/api/items/type/FURNITURE
```

---

#### 测试10: 购买商品
```bash
# 购买一个便宜的食物（苹果，2钻石）
# 首先获取商品ID（通常苹果的ID是6）
curl -X POST http://localhost:8081/api/shop/purchase \
  -H "Content-Type: application/json" \
  -d '{"userId": 2, "itemId": 6}'
```

**预期响应**:
```json
{
  "message": "购买成功！",
  "inventory": {
    "id": 1,
    "userId": 2,
    "itemId": 6,
    "isEquipped": false,
    "quantity": 1
  }
}
```

---

#### 测试11: 查看背包
```bash
curl http://localhost:8081/api/shop/inventory/2
```

**预期响应**:
```json
[
  {
    "id": 1,
    "userId": 2,
    "itemId": 6,
    "isEquipped": false,
    "quantity": 1,
    "purchasedAt": "2025-11-20T10:40:00"
  }
]
```

---

#### 测试12: 装备/使用物品
```bash
# 使用背包中的物品（食物会被消耗，衣服/家具会被装备）
# 将inventoryId替换为你背包中的物品ID
curl -X POST http://localhost:8081/api/shop/equip \
  -H "Content-Type: application/json" \
  -d '{"userId": 2, "inventoryId": 1}'
```

---

## 📝 完整测试流程

### 场景1: 新用户完整体验

```bash
# 1. 创建新用户"测试用户"
curl -X POST http://localhost:8081/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "测试用户"}'
# 记录返回的userId，假设是3

# 2. 每日签到（获得10钻石，总共60钻石）
curl -X POST http://localhost:8081/api/users/3/checkin

# 3. 开始学习
curl -X POST http://localhost:8081/api/study/start \
  -H "Content-Type: application/json" \
  -d '{"userId": 3}'
# 记录返回的sessionId

# 4. 等待10-15分钟...

# 5. 结束学习（假设sessionId是2）
curl -X POST http://localhost:8081/api/study/end/2

# 6. 查看用户信息（应该看到钻石增加了）
curl http://localhost:8081/api/game/home/3

# 7. 购买一个便宜的商品（可乐，2钻石）
curl -X POST http://localhost:8081/api/shop/purchase \
  -H "Content-Type: application/json" \
  -d '{"userId": 3, "itemId": 5}'

# 8. 查看背包
curl http://localhost:8081/api/shop/inventory/3
```

---

### 场景2: 使用GameController快速测试

```bash
# 1. 获取或创建用户（自动初始化100钻石）
curl http://localhost:8080/api/game/home/999

# 2. 增加50钻石（测试奖励功能）
curl -X POST http://localhost:8080/api/game/diamonds/999/add \
  -H "Content-Type: application/json" \
  -d '{"amount": 50}'

# 3. 验证钻石已增加
curl http://localhost:8080/api/game/home/999
```

---

## 🎯 测试要点

### ✅ 必须测试的功能
- [x] 用户创建和登录
- [x] 每日签到（只能签到一次）
- [x] 学习计时和奖励
- [x] 购买商品（钻石扣除）
- [x] 背包管理
- [x] 装备系统

### 📊 预期数据
- 新用户初始钻石: 50（通过UserService创建）或 100（通过GameService创建）
- 每日签到奖励: 10钻石
- 学习奖励: 每10分钟1钻石
- 商品价格: 2-120钻石不等

### ⚠️ 边界测试
- 钻石不足时购买商品（应该失败）
- 重复签到（应该失败）
- 已拥有的非食物商品重复购买（应该失败）
- 食物可以重复购买（数量增加）

---

## 🔍 常见错误排查

### 错误1: Connection refused
**原因**: 服务未启动
**解决**: 运行 `mvnw spring-boot:run`

### 错误2: 404 Not Found
**原因**: URL路径错误
**解决**: 检查API路径是否正确，注意 `/api` 前缀

### 错误3: 钻石不足
**原因**: 用户钻石余额不够
**解决**: 使用 `/api/game/diamonds/{userId}/add` 增加钻石

### 错误4: 用户不存在
**原因**: userId不存在
**解决**: 先创建用户或使用 `/api/game/home/{userId}` 自动创建

---

**祝测试顺利！🎉**

