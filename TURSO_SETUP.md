# Turso (SQLite) 设置指南

## 什么是 Turso？

Turso 是专为 serverless 设计的 SQLite 数据库服务，完美适配 Vercel！

### 免费额度（永久）
✅ **500 个数据库**
✅ **9 GB 总存储**
✅ **1 billion 行读取/月**
✅ **25 million 行写入/月**
✅ **无需信用卡**

---

## 设置步骤

### 1. 安装 Turso CLI

**Windows (PowerShell):**
```powershell
irm get.turso.tech/install.ps1 | iex
```

**Mac/Linux:**
```bash
curl -sSfL https://get.tur.so/install.sh | bash
```

### 2. 注册并登录

```bash
turso auth signup
```

这会打开浏览器，使用 GitHub 账户登录（免费）。

### 3. 创建数据库

```bash
turso db create licenses-db
```

### 4. 获取数据库 URL

```bash
turso db show licenses-db --url
```

复制输出的 URL，类似：
```
libsql://licenses-db-your-name.turso.io
```

### 5. 创建认证 Token

```bash
turso db tokens create licenses-db
```

复制输出的 token。

### 6. 配置环境变量

创建或更新 `.env.local`：

```bash
# Turso 数据库配置
TURSO_DATABASE_URL=libsql://licenses-db-your-name.turso.io
TURSO_AUTH_TOKEN=your_token_here

# 管理员密钥
ADMIN_KEY=your_secret_admin_key_123
```

### 7. 初始化数据库

```bash
node scripts/init-turso.js
```

这会创建表并插入示例数据。

### 8. 测试本地

```bash
npm run dev
```

测试 API：
```bash
# 检查许可证
curl http://localhost:3000/api/check?license=LICENSE-1234567890

# 查看所有许可证
curl http://localhost:3000/api/licenses?adminKey=your_secret_admin_key_123
```

### 9. 部署到 Vercel

1. 进入 Vercel 项目设置
2. 添加环境变量：
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `ADMIN_KEY`
3. 重新部署

---

## API 使用方法

### 检查许可证（GET）
```bash
GET /api/check?license=LICENSE-1234567890
```

**响应：**
```json
{
  "status": "valid",
  "client": "留澳之道",
  "validUntil": "2026-12-31",
  "features": ["基础功能", "高级分析", "数据导出"]
}
```

### 添加/更新许可证（PUT）
```bash
curl -X PUT https://your-app.vercel.app/api/check \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "your_secret_admin_key_123",
    "licenseKey": "LICENSE-NEW-001",
    "licenseData": {
      "client": "新客户",
      "validUntil": "2025-12-31",
      "features": ["基础功能", "高级分析"],
      "status": "valid"
    }
  }'
```

### 删除许可证（DELETE）
```bash
curl -X DELETE "https://your-app.vercel.app/api/check?adminKey=your_secret_admin_key_123&licenseKey=LICENSE-OLD-001"
```

### 查看所有许可证（GET）
```bash
curl "https://your-app.vercel.app/api/licenses?adminKey=your_secret_admin_key_123"
```

---

## 使用 Turso CLI 管理数据库

### 查看数据库列表
```bash
turso db list
```

### 连接到数据库 Shell
```bash
turso db shell licenses-db
```

在 shell 中可以执行 SQL：
```sql
-- 查看所有许可证
SELECT * FROM licenses;

-- 添加许可证
INSERT INTO licenses (license_key, client, valid_until, features, status)
VALUES ('LICENSE-TEST', '测试客户', '2025-12-31', '["基础功能"]', 'valid');

-- 删除许可证
DELETE FROM licenses WHERE license_key = 'LICENSE-TEST';
```

### 查看数据库统计
```bash
turso db inspect licenses-db
```

---

## 优势对比

| 特性 | 环境变量 | Turso | 付费数据库 |
|------|----------|-------|-----------|
| 成本 | 免费 | 免费 | $$ |
| 实时更新 | ❌ 需重新部署 | ✅ 即时生效 | ✅ 即时生效 |
| API 管理 | ❌ | ✅ | ✅ |
| 容量限制 | 4KB | 9GB | 无限 |
| 查询能力 | 简单 | SQL | SQL |
| 设置难度 | 简单 | 中等 | 中等 |

---

## 常见问题

**Q: Turso 真的免费吗？**
A: 是的，免费额度非常慷慨，足够大多数应用使用。

**Q: 数据会丢失吗？**
A: 不会，Turso 是持久化存储，数据会一直保存。

**Q: 性能如何？**
A: 非常快！Turso 使用边缘网络，延迟通常 < 50ms。

**Q: 可以在本地开发吗？**
A: 可以！使用相同的 URL 和 token 即可。

**Q: 如何备份数据？**
A: 使用 `turso db shell licenses-db .dump > backup.sql` 导出数据。

---

## 总结

**Turso 是目前最好的免费方案！**

✅ 真正的 SQLite（熟悉的 SQL 语法）
✅ 完全免费（无需信用卡）
✅ 实时更新（无需重新部署）
✅ 简单易用（CLI 工具很方便）
✅ 高性能（边缘网络）

推荐用于生产环境！
