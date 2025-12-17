# 许可证存储设置指南

## 使用环境变量（完全免费，无需外部服务）

这是最简单的方案，不需要任何外部数据库或服务。

### 优点
✅ **完全免费** - 无需任何付费服务
✅ **零配置** - 不需要注册任何账户
✅ **快速** - 直接从内存读取
✅ **安全** - 数据存储在 Vercel 环境变量中

### 缺点
⚠️ 修改许可证需要在 Vercel 后台更新环境变量并重新部署

---

## 设置步骤

### 1. 本地开发配置

创建 `.env.local` 文件：

```bash
# 许可证数据库（JSON 格式，一行）
LICENSES_DATABASE={"LICENSE-1234567890":{"client":"留澳之道","validUntil":"2026-12-31","features":["基础功能","高级分析","数据导出"],"status":"valid"},"LICENSE-ABC-123":{"client":"测试公司","validUntil":"2025-12-31","features":["基础功能"],"status":"valid"}}

# 管理员密钥
ADMIN_KEY=my_secret_admin_key_123
```

### 2. Vercel 部署配置

1. 进入 Vercel 项目设置
2. 点击 "Environment Variables"
3. 添加以下变量：

**LICENSES_DATABASE**
```json
{"LICENSE-1234567890":{"client":"留澳之道","validUntil":"2026-12-31","features":["基础功能","高级分析","数据导出"],"status":"valid"},"LICENSE-ABC-123":{"client":"测试公司","validUntil":"2025-12-31","features":["基础功能"],"status":"valid"}}
```

**ADMIN_KEY**
```
my_secret_admin_key_123
```

4. 重新部署项目

---

## 许可证 JSON 格式

```json
{
  "LICENSE-KEY-HERE": {
    "client": "客户名称",
    "validUntil": "2026-12-31",
    "features": ["基础功能", "高级分析", "数据导出"],
    "status": "valid"
  },
  "ANOTHER-LICENSE": {
    "client": "另一个客户",
    "validUntil": "2025-06-30",
    "features": ["基础功能"],
    "status": "valid"
  }
}
```

**注意：** 在环境变量中必须是一行，不能有换行！

---

## API 使用方法

### 检查许可证（GET）
```bash
GET /api/check?license=LICENSE-1234567890
```

**响应示例（有效）：**
```json
{
  "status": "valid",
  "client": "留澳之道",
  "validUntil": "2026-12-31",
  "features": ["基础功能", "高级分析", "数据导出"]
}
```

**响应示例（无效）：**
```json
{
  "status": "invalid",
  "message": "无效的许可证密钥"
}
```

### 查看所有许可证（DELETE - 管理员）
```bash
DELETE /api/check?adminKey=my_secret_admin_key_123
```

**响应示例：**
```json
{
  "licenses": {
    "LICENSE-1234567890": {
      "client": "留澳之道",
      "validUntil": "2026-12-31",
      "features": ["基础功能", "高级分析", "数据导出"],
      "status": "valid"
    }
  },
  "count": 1
}
```

---

## 如何添加新许可证

### 方法 1：在线 JSON 格式化工具

1. 复制当前的 `LICENSES_DATABASE` 值
2. 访问 https://jsonformatter.org/
3. 粘贴并格式化
4. 添加新许可证
5. 压缩回一行（Remove white space）
6. 更新 Vercel 环境变量
7. 重新部署

### 方法 2：使用代码生成

创建一个临时文件 `generate-licenses.js`：

```javascript
const licenses = {
  "LICENSE-1234567890": {
    client: "留澳之道",
    validUntil: "2026-12-31",
    features: ["基础功能", "高级分析", "数据导出"],
    status: "valid"
  },
  "LICENSE-NEW-001": {
    client: "新客户",
    validUntil: "2025-12-31",
    features: ["基础功能"],
    status: "valid"
  }
};

console.log(JSON.stringify(licenses));
```

运行：
```bash
node generate-licenses.js
```

复制输出并更新到 Vercel 环境变量。

---

## 常见问题

**Q: 如何快速添加许可证？**
A: 修改环境变量后需要重新部署，大约需要 1-2 分钟。

**Q: 可以存储多少许可证？**
A: Vercel 环境变量限制为 4KB，大约可以存储 50-100 个许可证。

**Q: 如果需要更多许可证怎么办？**
A: 可以考虑使用付费数据库服务，或者将许可证分组到多个环境变量中。

**Q: 这样安全吗？**
A: 是的，环境变量只在服务器端访问，不会暴露给客户端。

---

---

## 通过 API 更新许可证（可选）

如果你想通过 API 端点更新许可证，需要配置 Vercel API：

### 1. 获取 Vercel Token

1. 访问 https://vercel.com/account/tokens
2. 创建新 Token
3. 复制 Token

### 2. 获取 Project ID

1. 进入你的 Vercel 项目
2. 点击 Settings
3. 在 General 中找到 Project ID

### 3. 添加环境变量

在 Vercel 和 `.env.local` 中添加：

```bash
VERCEL_TOKEN=your_vercel_token_here
VERCEL_PROJECT_ID=your_project_id_here
# 如果使用 Team，还需要：
VERCEL_TEAM_ID=your_team_id_here
```

### 4. 使用 API 更新许可证

**添加/更新许可证：**
```bash
curl -X PUT https://your-app.vercel.app/api/licenses \
  -H "Content-Type: application/json" \
  -d '{
    "adminKey": "test_admin_key_123",
    "licenseKey": "LICENSE-NEW-001",
    "licenseData": {
      "client": "新客户",
      "validUntil": "2025-12-31",
      "features": ["基础功能"],
      "status": "valid"
    }
  }'
```

**查看所有许可证：**
```bash
curl https://your-app.vercel.app/api/licenses?adminKey=test_admin_key_123
```

**注意：** 更新后需要重新部署才能生效！API 会更新环境变量，但不会自动触发部署。

---

## 总结

### 方案对比

| 方案 | 成本 | 实时更新 | 复杂度 |
|------|------|----------|--------|
| 环境变量（手动） | 免费 | 需要重新部署 | 简单 |
| 环境变量 + Vercel API | 免费 | 需要重新部署 | 中等 |
| 付费数据库 | 付费 | 实时 | 中等 |

**推荐：**
- **少量许可证，不常修改** → 环境变量（手动）
- **需要 API 管理** → 环境变量 + Vercel API
- **大量许可证，频繁修改** → 付费数据库服务


---

# 认证系统设置

## NextAuth.js + Google OAuth

项目已集成 NextAuth.js 进行用户认证。

### 快速开始

详细设置步骤请查看 **[AUTH_SETUP.md](./AUTH_SETUP.md)**

### 简要步骤

1. **生成 NextAuth Secret**
   ```bash
   openssl rand -base64 32
   ```

2. **设置 Google OAuth**
   - 访问 [Google Cloud Console](https://console.cloud.google.com/)
   - 创建 OAuth 2.0 凭据
   - 添加回调 URL: `http://localhost:3000/api/auth/callback/google`

3. **更新 .env.local**
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-generated-secret
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   ```

4. **重启开发服务器**
   ```bash
   npm run dev
   ```

### 功能

- ✅ Google OAuth 登录
- ✅ 用户会话管理
- ✅ 导航栏集成（显示用户头像和名称）
- ✅ 美观的登录页面
- ✅ 保护路由和 API 的能力

### 访问

- 登录页面: `http://localhost:3000/auth/signin`
- 点击导航栏的 "Sign In" 按钮

完整文档请参考 **[AUTH_SETUP.md](./AUTH_SETUP.md)**
