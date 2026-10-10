import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getDb, saveDb } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { PortfolioDatabase } from '@/lib/types';

// Export complete portfolio data snapshot as JSON
export async function GET(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  // Return with download attachment header
  const dataString = JSON.stringify(db, null, 2);
  const filename = `portfolio-snapshot-${new Date().toISOString().split('T')[0]}.json`;

  return new NextResponse(dataString, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}

// Import / restore portfolio data from uploaded JSON snapshot
export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const importedData = (await req.json()) as PortfolioDatabase;

    if (!importedData.projects || !importedData.hero || !importedData.general) {
      return NextResponse.json(
        { error: 'Invalid portfolio JSON structure. Missing core sections.' },
        { status: 400 }
      );
    }

    saveDb(importedData);

    try {
      revalidatePath('/');
      revalidatePath('/api/portfolio');
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Portfolio snapshot restored successfully!',
      data: importedData,
    });
  } catch (error) {
    console.error('Error importing portfolio snapshot:', error);
    return NextResponse.json(
      { error: 'Failed to import snapshot. Ensure it is valid JSON.' },
      { status: 500 }
    );
  }
}
