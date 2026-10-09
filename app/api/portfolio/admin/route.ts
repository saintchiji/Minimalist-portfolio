import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { getDb } from '@/lib/db';

export async function GET(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const db = getDb();
    const adminData = {
      hero: db.hero,
      projects: [...db.projects].sort((a, b) => a.order - b.order),
      categories: [...db.categories].sort((a, b) => a.order - b.order),
      about: db.about,
      services: [...db.services].sort((a, b) => a.order - b.order),
      workflow: db.workflow,
      contact: db.contact,
      branding: db.branding,
      navigation: db.navigation,
      socials: db.socials,
      appearance: db.appearance,
      general: {
        siteName: db.general.siteName,
        siteDescription: db.general.siteDescription,
        keywords: db.general.keywords,
        adminEmail: db.general.adminEmail,
      },
      media: db.media,
    };

    return NextResponse.json(adminData);
  } catch (error) {
    console.error('Error in admin portfolio data route:', error);
    return NextResponse.json({ error: 'Failed to retrieve admin data' }, { status: 500 });
  }
}
