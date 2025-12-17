import { NextRequest, NextResponse } from 'next/server';

// 定义许可证数据类型
interface LicenseData {
  client: string;
  validUntil: string;
  features: string[];
  status: 'valid' | 'expired';
}

// PUT 端点：通过 Vercel API 更新许可证
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
        { error: '缺少必需字段：licenseKey 和 licenseData' },
        { status: 400 }
      );
    }

    // 获取当前许可证数据库
    const currentLicenses = JSON.parse(process.env.LICENSES_DATABASE || '{}');
    
    // 添加或更新许可证
    currentLicenses[licenseKey] = licenseData;
    
    const newLicensesJson = JSON.stringify(currentLicenses);

    // 使用 Vercel API 更新环境变量
    const vercelToken = process.env.VERCEL_TOKEN;
    const vercelProjectId = process.env.VERCEL_PROJECT_ID;
    const vercelTeamId = process.env.VERCEL_TEAM_ID; // 可选

    if (!vercelToken || !vercelProjectId) {
      return NextResponse.json(
        { 
          error: '未配置 Vercel API',
          message: '需要设置 VERCEL_TOKEN 和 VERCEL_PROJECT_ID 环境变量',
          currentLicense: currentLicenses[licenseKey],
          note: '许可证已在当前会话中更新，但需要重新部署才能持久化'
        },
        { status: 200 }
      );
    }

    // 构建 API URL
    const apiUrl = vercelTeamId
      ? `https://api.vercel.com/v9/projects/${vercelProjectId}/env?teamId=${vercelTeamId}`
      : `https://api.vercel.com/v9/projects/${vercelProjectId}/env`;

    // 首先获取现有的环境变量 ID
    const getResponse = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!getResponse.ok) {
      throw new Error('获取环境变量失败');
    }

    const envVars = await getResponse.json();
    const licensesEnv = envVars.envs?.find((env: any) => env.key === 'LICENSES_DATABASE');

    if (licensesEnv) {
      // 更新现有环境变量
      const updateUrl = vercelTeamId
        ? `https://api.vercel.com/v9/projects/${vercelProjectId}/env/${licensesEnv.id}?teamId=${vercelTeamId}`
        : `https://api.vercel.com/v9/projects/${vercelProjectId}/env/${licensesEnv.id}`;

      const updateResponse = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: newLicensesJson,
        }),
      });

      if (!updateResponse.ok) {
        const error = await updateResponse.json();
        throw new Error(`更新失败: ${JSON.stringify(error)}`);
      }
    } else {
      // 创建新环境变量
      const createResponse = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${vercelToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: 'LICENSES_DATABASE',
          value: newLicensesJson,
          type: 'encrypted',
          target: ['production', 'preview', 'development'],
        }),
      });

      if (!createResponse.ok) {
        const error = await createResponse.json();
        throw new Error(`创建失败: ${JSON.stringify(error)}`);
      }
    }

    return NextResponse.json({
      success: true,
      message: '许可证已更新！需要重新部署才能生效。',
      licenseKey,
      licenseData,
      note: '请在 Vercel 后台触发重新部署，或等待下次自动部署'
    });

  } catch (error) {
    console.error('更新许可证错误:', error);
    return NextResponse.json(
      { 
        error: '更新失败', 
        details: error instanceof Error ? error.message : '未知错误' 
      },
      { status: 500 }
    );
  }
}

// GET 端点：获取所有许可证
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');

    // 验证管理员密钥
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: '无效的管理员密钥' },
        { status: 403 }
      );
    }

    const { createClient } = await import('@libsql/client');
    const client = createClient({
      url: process.env.TURSO_DATABASE_URL || '',
      authToken: process.env.TURSO_AUTH_TOKEN || '',
    });

    // 返回所有许可证
    const result = await client.execute('SELECT * FROM licenses');
    
    const licenses: Record<string, any> = {};
    result.rows.forEach((row) => {
      licenses[row.license_key as string] = {
        client: row.client,
        validUntil: row.valid_until,
        features: JSON.parse(row.features as string),
        status: row.status,
      };
    });

    return NextResponse.json({
      licenses,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('获取许可证列表错误:', error);
    return NextResponse.json(
      { error: '请求处理失败' },
      { status: 500 }
    );
  }
}
