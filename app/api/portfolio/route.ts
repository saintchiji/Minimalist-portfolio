import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
  try {
    const db = getDb();

    // Only return published projects sorted by order
    const publishedProjects = db.projects
      .filter((p) => p.status === 'published')
      .sort((a, b) => a.order - b.order);

    // Omit sensitive fields from public payload
    const publicData = {
      hero: db.hero,
      projects: publishedProjects,
      categories: db.categories.filter((c) => c.enabled).sort((a, b) => a.order - b.order),
      about: db.about,
      services: db.services.sort((a, b) => a.order - b.order),
      workflow: db.workflow,
      contact: {
        email: db.contact.email,
        phone: db.contact.phone,
        location: db.contact.location,
        timezone: db.contact.timezone,
        agent: db.contact.agent,
        availabilityStatus: db.contact.availabilityStatus,
      },
      branding: db.branding,
      navigation: db.navigation,
      socials: db.socials.filter((s) => s.enabled),
      appearance: db.appearance,
      general: {
        siteName: db.general.siteName,
        siteDescription: db.general.siteDescription,
        keywords: db.general.keywords,
      },
    };

    return NextResponse.json(publicData);
  } catch (error) {
    console.error('Error fetching public portfolio:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio data' }, { status: 500 });
  }
}
