# 价格计划 API 文档

## 概述

价格计划现在存储在 Turso 数据库中，可以通过 API 动态管理。

---

## API 端点

### 1. 获取所有价格计划

**GET** `/api/pricing`

**响应示例：**
```json
{
  "plans": [
    {
      "id": 1,
      "name": "Standard",
      "monthlyPrice": 33,
      "yearlyPrice": 26,
      "features": ["Mass email", "Custom modules", "..."],
      "description": "All the essentials:",
      "popular": false,
      "displayOrder": 1
    }
  ]
}
```

### 2. 添加新价格计划

**POST** `/api/pricing`

**请求体：**
```json
{
  "adminKey": "your_admin_key",
  "plan": {
    "name": "Starter",
    "monthlyPrice": 19,
    "yearlyPrice": 15,
    "features": ["Feature 1", "Feature 2"],
    "description": "Perfect for beginners",
    "popular": false,
    "displayOrder": 0
  }
}
```

**cURL 示例：**
```bash
curl -X POST http://localhost:3000/api/pricing \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "test_admin_key_123",
    "plan": {
      "name": "Starter",
      "monthlyPrice": 19,
      "yearlyPrice": 15,
      "features": ["Basic features", "Email support"],
      "description": "Perfect for beginners",
      "popular": false,
      "displayOrder": 0
    }
  }'
```

### 3. 更新价格计划

**PUT** `/api/pricing`

**请求体：**
```json
{
  "adminKey": "your_admin_key",
  "id": 1,
  "plan": {
    "name": "Standard Plus",
    "monthlyPrice": 39,
    "yearlyPrice": 30,
    "features": ["Updated features"],
    "description": "Updated description",
    "popular": true,
    "displayOrder": 1
  }
}
```

**cURL 示例：**
```bash
curl -X PUT http://localhost:3000/api/pricing \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "test_admin_key_123",
    "id": 3,
    "plan": {
      "name": "Enterprise Plus",
      "monthlyPrice": 99,
      "yearlyPrice": 79,
      "features": ["All features", "Priority support"],
      "description": "Best for large teams",
      "popular": true,
      "displayOrder": 3
    }
  }'
```

### 4. 删除价格计划

**DELETE** `/api/pricing?adminKey=YOUR_KEY&id=1`

**cURL 示例：**
```bash
curl -X DELETE "http://localhost:3000/api/pricing?adminKey=test_admin_key_123&id=4"
```

---

## 使用 Turso CLI 直接管理

### 连接到数据库
```bash
turso db shell crm
```

### 查看所有价格计划
```sql
SELECT * FROM pricing_plans ORDER BY display_order;
```

### 添加价格计划
```sql
INSERT INTO pricing_plans 
  (name, monthly_price, yearly_price, features, description, popular, display_order)
VALUES 
  ('Starter', 19, 15, '["Basic features", "Email support"]', 'Perfect for beginners', 0, 0);
```

### 更新价格计划
```sql
UPDATE pricing_plans 
SET monthly_price = 99, popular = 1 
WHERE name = 'Enterprise';
```

### 删除价格计划
```sql
DELETE FROM pricing_plans WHERE id = 5;
```

### 设置热门标签
```sql
-- 取消所有热门标签
UPDATE pricing_plans SET popular = 0;

-- 设置 Enterprise 为热门
UPDATE pricing_plans SET popular = 1 WHERE name = 'Enterprise';
```

### 调整显示顺序
```sql
UPDATE pricing_plans SET display_order = 0 WHERE name = 'Starter';
UPDATE pricing_plans SET display_order = 1 WHERE name = 'Standard';
UPDATE pricing_plans SET display_order = 2 WHERE name = 'Professional';
UPDATE pricing_plans SET display_order = 3 WHERE name = 'Enterprise';
```

---

## 前端组件

价格组件会自动从 API 获取数据：

```tsx
// app/components/pricing/index.tsx
// 自动从 /api/pricing 获取价格计划
// 支持月付/年付切换
// 显示热门标签
```

---

## 重新初始化价格计划

如果需要重置为默认价格计划：

```bash
# Windows PowerShell
$env:TURSO_DATABASE_URL="libsql://crm-mason028.aws-ap-northeast-1.turso.io"
$env:TURSO_AUTH_TOKEN="your_token"
node scripts/init-pricing.js
```

---

## 数据库表结构

```sql
CREATE TABLE pricing_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  monthly_price REAL NOT NULL,
  yearly_price REAL NOT NULL,
  features TEXT NOT NULL,        -- JSON 数组
  description TEXT NOT NULL,
  popular INTEGER DEFAULT 0,     -- 0 = false, 1 = true
  display_order INTEGER DEFAULT 0
);
```

---

## 部署到 Vercel

确保在 Vercel 环境变量中设置：
- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`
- `ADMIN_KEY`

价格计划会自动从数据库加载，无需重新部署即可更新！
