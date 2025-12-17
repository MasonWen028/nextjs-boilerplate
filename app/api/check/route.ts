import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@libsql/client';

// 定义许可证数据类型
interface LicenseData {
  client: string;
  validUntil: string;
  features: string[];
  status: 'valid' | 'expired';
}

// 定义响应类型
interface LicenseResponse {
  status: 'valid' | 'expired' | 'invalid';
  client?: string;
  validUntil?: string;
  features?: string[];
  message?: string;
}

// 默认许可证数据库（数据库失败时的后备数据）
const defaultLicenses: Record<string, LicenseData> = {
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
  },
};

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

// 从 Turso 读取许可证，失败则使用默认数据
const getLicense = async (licenseKey: string): Promise<LicenseData | null> => {
  const client = getDbClient();
  
  // 如果数据库客户端创建失败，使用默认数据
  if (!client) {
    console.warn('数据库不可用，使用默认许可证数据');
    return defaultLicenses[licenseKey] || null;
  }

  try {
    const result = await client.execute({
      sql: 'SELECT * FROM licenses WHERE license_key = ?',
      args: [licenseKey],
    });

    if (result.rows.length === 0) {
      // 数据库中没有，尝试使用默认数据
      return defaultLicenses[licenseKey] || null;
    }

    const row = result.rows[0];
    return {
      client: row.client as string,
      validUntil: row.valid_until as string,
      features: JSON.parse(row.features as string),
      status: row.status as 'valid' | 'expired',
    };
  } catch (error) {
    console.error('读取许可证失败，使用默认数据:', error);
    return defaultLicenses[licenseKey] || null;
  }
};

export async function GET(request: NextRequest) {
  // 从URL获取license参数
  const { searchParams } = new URL(request.url);
  const license = searchParams.get('license');

  // 检查license是否提供
  if (!license) {
    return NextResponse.json(
      {
        status: 'invalid',
        message: '未提供许可证密钥',
      } as LicenseResponse,
      { status: 403 }
    );
  }

  // 从数据库读取许可证（失败则使用默认数据）
  const licenseData = await getLicense(license);

  // 如果许可证不存在
  if (!licenseData) {
    return NextResponse.json(
      {
        status: 'invalid',
        message: '无效的许可证密钥',
      } as LicenseResponse,
      { status: 403 }
    );
  }

  // 检查许可证是否过期
  if (licenseData.status === 'expired') {
    return NextResponse.json(
      {
        status: 'expired',
        client: licenseData.client,
        validUntil: licenseData.validUntil,
        message: '许可证已过期',
      } as LicenseResponse,
      { status: 403 }
    );
  }

  // 许可证有效
  return NextResponse.json({
    status: 'valid',
    client: licenseData.client,
    validUntil: licenseData.validUntil,
    features: licenseData.features,
  } as LicenseResponse);
}

export async function POST(request: NextRequest) {
  try {
    // 获取请求体（包含 apiKey 和 requestBody）
    const { apiKey, requestBody } = await request.json();

    // 检查是否提供了 API 密钥
    if (!apiKey) {
      return NextResponse.json(
        { error: '未提供 API 密钥' },
        { status: 400 }
      );
    }

    // 转发请求到 OpenAI
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify(requestBody),
    });

    // 获取 OpenAI 的响应
    const data = await response.json();

    // 如果请求失败，返回错误信息
    if (!response.ok) {
      return NextResponse.json(
        { error: 'OpenAI API 请求失败', details: data },
        { status: response.status }
      );
    }

    // 返回 OpenAI 的响应
    return NextResponse.json(data);
  } catch (error) {
    console.error('OpenAI API 错误:', error);
    return NextResponse.json(
      { error: '请求处理失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

// PUT 端点：添加或更新许可证
export async function PUT(request: NextRequest) {
  try {
    const { adminKey, licenseKey, licenseData } = await request.json();

    // 验证管理员密钥
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: '无效的管理员密钥' },
        { status: 403 }
      );
    }

    // 验证必需字段
    if (!licenseKey || !licenseData) {
      return NextResponse.json(
        { error: '缺少必需字段' },
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
    
    // 插入或更新许可证
    await client.execute({
      sql: `INSERT INTO licenses (license_key, client, valid_until, features, status)
            VALUES (?, ?, ?, ?, ?)
            ON CONFLICT(license_key) DO UPDATE SET
              client = excluded.client,
              valid_until = excluded.valid_until,
              features = excluded.features,
              status = excluded.status`,
      args: [
        licenseKey,
        licenseData.client,
        licenseData.validUntil,
        JSON.stringify(licenseData.features),
        licenseData.status,
      ],
    });

    return NextResponse.json({
      success: true,
      message: '许可证已保存',
      licenseKey,
    });
  } catch (error) {
    console.error('保存许可证错误:', error);
    return NextResponse.json(
      { error: '保存失败', details: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    );
  }
}

// DELETE 端点：删除许可证
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');
    const licenseKey = searchParams.get('licenseKey');

    // 验证管理员密钥
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: '无效的管理员密钥' },
        { status: 403 }
      );
    }

    if (!licenseKey) {
      return NextResponse.json(
        { error: '缺少 licenseKey 参数' },
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
      sql: 'DELETE FROM licenses WHERE license_key = ?',
      args: [licenseKey],
    });

    return NextResponse.json({
      success: true,
      message: '许可证已删除',
      licenseKey,
    });
  } catch (error) {
    console.error('删除许可证错误:', error);
    return NextResponse.json(
      { error: '删除失败' },
      { status: 500 }
    );
  }
} 