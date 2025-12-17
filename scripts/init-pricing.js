// 初始化价格计划表
import 'dotenv/config';
import { createClient } from '@libsql/client';

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || '',
  authToken: process.env.TURSO_AUTH_TOKEN || '',
});

const pricingPlans = [
  {
    name: 'Standard',
    monthlyPrice: 33,
    yearlyPrice: 26,
    features: [
      'Mass email',
      'Custom modules',
      'Workflows',
      'Cadences',
      'Sales forecasting',
      'Lookup fields',
      'Canvas',
      'Office 365 integration',
      'Zoho Marketplace'
    ],
    description: 'All the essentials:',
    popular: false,
    displayOrder: 1
  },
  {
    name: 'Professional',
    monthlyPrice: 55,
    yearlyPrice: 43,
    features: [
      'Blueprint',
      'CPQ',
      'SalesSignals',
      'Inventory management',
      'Webhooks',
      'Assignment rules',
      'Validation rules',
      'Kiosk Studio',
      'Google Ads integration'
    ],
    description: 'Everything in Standard +',
    popular: false,
    displayOrder: 2
  },
  {
    name: 'Enterprise',
    monthlyPrice: 77,
    yearlyPrice: 60,
    features: [
      'Zia - AI assistant',
      'Territory management',
      'Custom functions',
      'Journey orchestration',
      'Multi-user portals',
      'Page layouts',
      'Client scripts',
      'Approval process',
      'Sandbox'
    ],
    description: 'Everything in Professional +',
    popular: true,
    displayOrder: 3
  },
  {
    name: 'Ultimate',
    monthlyPrice: 100.10,
    yearlyPrice: 78,
    features: [
      'Enhanced feature limits',
      'Custom AI/ML platform',
      'Advanced customization',
      'Data preparation',
      'Augmented analytics',
      'Data storytelling',
      'Unified business insights',
      'Advanced administration'
    ],
    description: 'Everything in Enterprise +',
    popular: false,
    displayOrder: 4
  }
];

async function initPricingTable() {
  try {
    console.log('创建 pricing_plans 表...');
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS pricing_plans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        monthly_price REAL NOT NULL,
        yearly_price REAL NOT NULL,
        features TEXT NOT NULL,
        description TEXT NOT NULL,
        popular INTEGER DEFAULT 0,
        display_order INTEGER DEFAULT 0
      )
    `);

    console.log('✅ 表创建成功！');

    // 插入价格计划
    console.log('\n插入价格计划...');
    
    for (const plan of pricingPlans) {
      await client.execute({
        sql: `INSERT OR REPLACE INTO pricing_plans 
              (name, monthly_price, yearly_price, features, description, popular, display_order)
              VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [
          plan.name,
          plan.monthlyPrice,
          plan.yearlyPrice,
          JSON.stringify(plan.features),
          plan.description,
          plan.popular ? 1 : 0,
          plan.displayOrder,
        ],
      });
      console.log(`✅ 已添加: ${plan.name}`);
    }

    console.log('\n🎉 价格计划初始化完成！');
    
    // 验证数据
    console.log('\n验证数据...');
    const result = await client.execute('SELECT * FROM pricing_plans ORDER BY display_order');
    console.log(`总共 ${result.rows.length} 个价格计划:`);
    result.rows.forEach((row) => {
      console.log(`  - ${row.name}: $${row.monthly_price}/月 (${row.popular ? 'POPULAR' : 'standard'})`);
    });

  } catch (error) {
    console.error('❌ 初始化失败:', error);
    process.exit(1);
  }
}

initPricingTable();
