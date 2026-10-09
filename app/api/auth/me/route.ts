import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const db = getDb();
  return NextResponse.json({
    authenticated: true,
    email: db.general.adminEmail,
  });
}
