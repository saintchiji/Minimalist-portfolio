import { NextRequest, NextResponse } from 'next/server';
import { authenticateAdmin, createSessionToken, SESSION_COOKIE_NAME } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    const isValid = await authenticateAdmin(password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid admin credentials' }, { status: 401 });
    }

    const db = getDb();
    const token = createSessionToken(db.general.adminEmail);

    const res = NextResponse.json({
      success: true,
      message: 'Authenticated successfully',
      email: db.general.adminEmail,
      token,
    });

    // Set cookie supporting both top-level and cross-site iframe contexts
    res.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: token,
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'none',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
