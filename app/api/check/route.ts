import { NextRequest, NextResponse } from 'next/server';

// 模拟的许可证数据库
const licenseDatabase = new Map([
  ['LICENSE-1234567890', {
    client: '留澳之道',
    validUntil: '2026-12-31',
    features: ['基础功能', '高级分析', '数据导出'],
    status: 'valid',
  }],
  ['LICENSE-DEF-456', {
    client: '公司B',
    validUntil: '2023-12-31',
    features: ['基础功能'],
    status: 'expired',
  }],
  ['LICENSE-GHI-789', {
    client: '公司C',
    validUntil: '2026-06-30',
    features: ['基础功能', '高级分析'],
    status: 'valid',
  }],
]);

// 定义响应类型
interface LicenseResponse {
  status: 'valid' | 'expired' | 'invalid';
  client?: string;
  validUntil?: string;
  features?: string[];
  message?: string;
}

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

  // 在数据库中查找许可证
  const licenseData = licenseDatabase.get(license);

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