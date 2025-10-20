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
    validUntil: '2023-12-31', // 已过期
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