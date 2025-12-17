// 初始化 Turso 数据库脚本
import 'dotenv/config';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

console.log('连接到数据库:', process.env.TURSO_DATABASE_URL);

async function initDatabase() {
  try {
    console.log('创建 licenses 表...');
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS licenses (
        license_key TEXT PRIMARY KEY,
        client TEXT NOT NULL,
        valid_until TEXT NOT NULL,
        features TEXT NOT NULL,
        status TEXT NOT NULL
      )
    `);

    console.log('✅ 表创建成功！');

    // 插入示例数据
    console.log('\n插入示例许可证...');
    
    const sampleLicenses = [
      {
        key: 'LICENSE-1234567890',
        client: '留澳之道',
        validUntil: '2026-12-31',
        features: ['基础功能', '高级分析', '数据导出'],
        status: 'valid',
      },
      {
        key: 'LICENSE-DEF-456',
        client: '公司B',
        validUntil: '2023-12-31',
        features: ['基础功能'],
        status: 'expired',
      },
      {
        key: 'LICENSE-GHI-789',
        client: '公司C',
        validUntil: '2026-06-30',
        features: ['基础功能', '高级分析'],
        status: 'valid',
      },
    ];

    for (const license of sampleLicenses) {
      await client.execute({
        sql: `INSERT OR REPLACE INTO licenses (license_key, client, valid_until, features, status)
              VALUES (?, ?, ?, ?, ?)`,
        args: [
          license.key,
          license.client,
          license.validUntil,
          JSON.stringify(license.features),
          license.status,
        ],
      });
      console.log(`✅ 已添加: ${license.key}`);
    }

    console.log('\n🎉 数据库初始化完成！');
    
    // 验证数据
    console.log('\n验证数据...');
    const result = await client.execute('SELECT * FROM licenses');
    console.log(`总共 ${result.rows.length} 个许可证:`);
    result.rows.forEach((row) => {
      console.log(`  - ${row.license_key}: ${row.client} (${row.status})`);
    });

  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

initDatabase();
