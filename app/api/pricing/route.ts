import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

// 定义价格计划类型
interface PricingPlan {
  id?: number;
  name: string;
  monthlyPrice: number;
  yearlyPrice: number;
  features: string[];
  description: string;
  popular: boolean;
  displayOrder: number;
}

// 默认价格计划（数据库失败时的后备数据）
const defaultPricingPlans: PricingPlan[] = [
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

// 创建 Turso 客户端
const getDbClient = () => {
  try {
    return createClient({
      url: process.env.TURSO_DATABASE_URL || '',
      authToken: process.env.TURSO_AUTH_TOKEN || '',
    });
  } catch (error) {
    console.error('创建数据库客户端失败:', error);
    return null;
  }
};

// GET: 获取所有价格计划
export async function GET() {
  const client = getDbClient();
  
  // 如果数据库客户端创建失败，返回默认数据
  if (!client) {
    console.warn('数据库不可用，返回默认价格计划');
    return NextResponse.json({ plans: defaultPricingPlans });
  }

  try {
    const result = await client.execute(
      'SELECT * FROM pricing_plans ORDER BY display_order ASC'
    );

    // 如果数据库中没有数据，返回默认数据
    if (result.rows.length === 0) {
      console.warn('数据库中没有价格计划，返回默认数据');
      return NextResponse.json({ plans: defaultPricingPlans });
    }

    const plans = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      monthlyPrice: row.monthly_price,
      yearlyPrice: row.yearly_price,
      features: JSON.parse(row.features as string),
      description: row.description,
      popular: row.popular === 1,
      displayOrder: row.display_order,
    }));

    return NextResponse.json({ plans });
  } catch (error) {
    console.error('获取价格计划失败，返回默认数据:', error);
    return NextResponse.json({ plans: defaultPricingPlans });
  }
}

// POST: 添加新价格计划
export async function POST(request: NextRequest) {
  try {
    const { adminKey, plan } = await request.json();

    // 验证管理员密钥
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: '无效的管理员密钥' },
        { status: 403 }
      );
    }

    const client = getDbClient();
    
    if (!client) {
      return NextResponse.json(
        { error: '数据库不可用' },
        { status: 503 }
      );
    }
    
    await client.execute({
      sql: `INSERT INTO pricing_plans 
            (name, monthly_price, yearly_price, features, description, popular, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        plan.name,
        plan.monthlyPrice,
        plan.yearlyPrice,
        JSON.stringify(plan.features),
        plan.description,
        plan.popular ? 1 : 0,
        plan.displayOrder || 0,
      ],
    });

    return NextResponse.json({
      success: true,
      message: '价格计划已添加',
    });
  } catch (error) {
    console.error('添加价格计划失败:', error);
    return NextResponse.json(
      { error: '添加失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

// PUT: 更新价格计划
export async function PUT(request: NextRequest) {
  try {
    const { adminKey, id, plan } = await request.json();

    // 验证管理员密钥
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: '无效的管理员密钥' },
        { status: 403 }
      );
    }

    const client = getDbClient();
    
    if (!client) {
      return NextResponse.json(
        { error: '数据库不可用' },
        { status: 503 }
      );
    }
    
    await client.execute({
      sql: `UPDATE pricing_plans 
            SET name = ?, monthly_price = ?, yearly_price = ?, 
                features = ?, description = ?, popular = ?, display_order = ?
            WHERE id = ?`,
      args: [
        plan.name,
        plan.monthlyPrice,
        plan.yearlyPrice,
        JSON.stringify(plan.features),
        plan.description,
        plan.popular ? 1 : 0,
        plan.displayOrder || 0,
        id,
      ],
    });

    return NextResponse.json({
      success: true,
      message: '价格计划已更新',
    });
  } catch (error) {
    console.error('更新价格计划失败:', error);
    return NextResponse.json(
      { error: '更新失败' },
      { status: 500 }
    );
  }
}

// DELETE: 删除价格计划
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');
    const id = searchParams.get('id');

    // 验证管理员密钥
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: '无效的管理员密钥' },
        { status: 403 }
      );
    }

    if (!id) {
      return NextResponse.json(
        { error: '缺少 id 参数' },
        { status: 400 }
      );
    }

    const client = getDbClient();
    
    if (!client) {
      return NextResponse.json(
        { error: '数据库不可用' },
        { status: 503 }
      );
    }
    
    await client.execute({
      sql: 'DELETE FROM pricing_plans WHERE id = ?',
      args: [id],
    });

    return NextResponse.json({
      success: true,
      message: '价格计划已删除',
    });
  } catch (error) {
    console.error('删除价格计划失败:', error);
    return NextResponse.json(
      { error: '删除失败' },
      { status: 500 }
    );
  }
}
