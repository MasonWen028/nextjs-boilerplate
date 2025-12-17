# 数据库故障转移策略

## 概述

系统现在具有完整的故障转移机制。如果 Turso 数据库不可用，API 会自动使用硬编码的默认数据，确保应用程序始终可用。

---

## 故障转移机制

### 1. 许可证检查 API (`/api/check`)

**默认许可证数据：**
```javascript
{
  'LICENSE-1234567890': {
    client: '留澳之道',
    validUntil: '2026-12-31',
    features: ['基础功能', '高级分析', '数据导出'],
    status: 'valid',
  },
  'LICENSE-DEF-456': {
    client: '公司B',
    validUntil: '2023-12-31',
    features: ['基础功能'],
    status: 'expired',
  },
  'LICENSE-GHI-789': {
    client: '公司C',
    validUntil: '2026-06-30',
    features: ['基础功能', '高级分析'],
    status: 'valid',
  }
}
```

**故障转移逻辑：**
1. 尝试连接 Turso 数据库
2. 如果连接失败 → 使用默认数据
3. 如果查询失败 → 使用默认数据
4. 如果数据库中没有该许可证 → 检查默认数据

### 2. 价格计划 API (`/api/pricing`)

**默认价格计划：**
- Standard: $33/月
- Professional: $55/月
- Enterprise: $77/月 (POPULAR)
- Ultimate: $100.10/月

**故障转移逻辑：**
1. 尝试连接 Turso 数据库
2. 如果连接失败 → 返回默认价格计划
3. 如果查询失败 → 返回默认价格计划
4. 如果数据库为空 → 返回默认价格计划

### 3. 前端组件 (`Pricing`)

**故障转移逻辑：**
1. 组件初始化时使用默认数据
2. 尝试从 API 获取数据
3. 如果 API 失败 → 继续使用默认数据
4. 如果 API 成功 → 更新为数据库数据

---

## 测试故障转移

### 模拟数据库故障

**方法 1：删除环境变量**
```bash
# 临时删除数据库配置
unset TURSO_DATABASE_URL
unset TURSO_AUTH_TOKEN
```

**方法 2：使用无效的 URL**
```bash
# .env.local
TURSO_DATABASE_URL=invalid_url
TURSO_AUTH_TOKEN=invalid_token
```

### 验证故障转移

**测试许可证检查：**
```bash
curl http://localhost:3000/api/check?license=LICENSE-1234567890
```

应该返回默认数据，即使数据库不可用。

**测试价格计划：**
```bash
curl http://localhost:3000/api/pricing
```

应该返回 4 个默认价格计划。

---

## 日志输出

当使用故障转移时，控制台会显示警告：

```
⚠️ 数据库不可用，使用默认许可证数据
⚠️ 数据库不可用，返回默认价格计划
⚠️ 获取价格计划失败，返回默认数据
```

---

## 写操作的处理

对于 PUT/DELETE 操作（添加、更新、删除），如果数据库不可用：

**返回 503 错误：**
```json
{
  "error": "数据库不可用"
}
```

这是合理的，因为：
- 读操作可以使用缓存/默认数据
- 写操作必须持久化，不能使用临时数据

---

## 优势

✅ **高可用性** - 即使数据库故障，应用仍可读取数据
✅ **优雅降级** - 自动切换到默认数据，用户无感知
✅ **清晰日志** - 控制台警告便于调试
✅ **数据一致性** - 默认数据与初始数据库数据相同

---

## 生产环境建议

### 1. 监控数据库健康

添加健康检查端点：
```typescript
// app/api/health/route.ts
export async function GET() {
  const client = getDbClient();
  const dbHealthy = client !== null;
  
  return NextResponse.json({
    status: dbHealthy ? 'healthy' : 'degraded',
    database: dbHealthy ? 'connected' : 'using_fallback',
    timestamp: new Date().toISOString()
  });
}
```

### 2. 设置告警

当使用故障转移时，发送告警通知：
- Email
- Slack
- PagerDuty

### 3. 定期同步默认数据

确保代码中的默认数据与数据库保持同步：
```bash
# 每次更新数据库后，更新代码中的默认数据
```

---

## 更新默认数据

### 许可证默认数据

编辑 `app/api/check/route.ts`:
```typescript
const defaultLicenses: Record<string, LicenseData> = {
  'NEW-LICENSE': {
    client: '新客户',
    validUntil: '2027-12-31',
    features: ['新功能'],
    status: 'valid',
  },
  // ...
};
```

### 价格计划默认数据

编辑以下两个文件：
1. `app/api/pricing/route.ts` - API 后备数据
2. `app/components/pricing/index.tsx` - 前端后备数据

确保两处数据保持一致！

---

## 总结

系统现在具有完整的故障转移能力：

| 场景 | 行为 |
|------|------|
| 数据库正常 | 从数据库读取 |
| 数据库连接失败 | 使用默认数据 |
| 数据库查询失败 | 使用默认数据 |
| 数据库为空 | 使用默认数据 |
| 写操作失败 | 返回 503 错误 |

这确保了应用程序的高可用性和用户体验！
