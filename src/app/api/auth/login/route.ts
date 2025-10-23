import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();
    console.log('📝 Login request received:', { username, passwordLength: password?.length });

    if (!username || !password) {
      console.error('❌ Missing credentials');
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }

    console.log('🔐 Authenticating with:', username);
    const result = await authenticateAdmin(username, password);
    console.log('🎯 Auth result:', { success: result.success, error: result.error });

    if (!result.success) {
      console.error('❌ Auth failed:', result.error);
      return NextResponse.json({ error: result.error }, { status: 401 });
    }

    console.log('✅ Auth successful, setting cookie');
    const response = NextResponse.json({ success: true, token: result.token });
    response.cookies.set('admin-token', result.token!, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    console.log('✅ Login response sent');
    return response;
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
