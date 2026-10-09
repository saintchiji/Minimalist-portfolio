import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import {
  updateHero,
  updateAbout,
  updateServices,
  updateContactSettings,
  updateBranding,
  updateNavigation,
  updateSocials,
  updateAppearance,
  updateCategories,
  updateGeneralSettings,
  resetToDefaults,
  hashPassword,
} from '@/lib/db';

export async function PUT(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { section, data } = await req.json();

    if (!section) {
      return NextResponse.json({ error: 'Section parameter is required' }, { status: 400 });
    }

    switch (section) {
      case 'hero': {
        const updated = updateHero(data);
        return NextResponse.json({ success: true, hero: updated });
      }
      case 'about': {
        const updated = updateAbout(data);
        return NextResponse.json({ success: true, about: updated });
      }
      case 'services': {
        const updated = updateServices(data.services, data.workflow);
        return NextResponse.json({ success: true, ...updated });
      }
      case 'contact': {
        const updated = updateContactSettings(data);
        return NextResponse.json({ success: true, contact: updated });
      }
      case 'branding': {
        const updated = updateBranding(data);
        return NextResponse.json({ success: true, branding: updated });
      }
      case 'navigation': {
        const updated = updateNavigation(data);
        return NextResponse.json({ success: true, navigation: updated });
      }
      case 'socials': {
        const updated = updateSocials(data);
        return NextResponse.json({ success: true, socials: updated });
      }
      case 'appearance': {
        const updated = updateAppearance(data);
        return NextResponse.json({ success: true, appearance: updated });
      }
      case 'categories': {
        const updated = updateCategories(data);
        return NextResponse.json({ success: true, categories: updated });
      }
      case 'general': {
        const updatePayload: Record<string, unknown> = {
          siteName: data.siteName,
          siteDescription: data.siteDescription,
          keywords: data.keywords,
          adminEmail: data.adminEmail,
        };

        // Handle password change if provided
        if (data.newPassword && data.newPassword.trim().length >= 6) {
          const { hash, salt } = hashPassword(data.newPassword.trim());
          updatePayload.adminPasswordHash = hash;
          updatePayload.salt = salt;
        }

        const updated = updateGeneralSettings(updatePayload);
        return NextResponse.json({
          success: true,
          general: {
            siteName: updated.siteName,
            siteDescription: updated.siteDescription,
            keywords: updated.keywords,
            adminEmail: updated.adminEmail,
          },
        });
      }
      case 'reset': {
        const restored = resetToDefaults();
        return NextResponse.json({ success: true, message: 'Restored default portfolio data', data: restored });
      }
      default:
        return NextResponse.json({ error: `Unknown section: ${section}` }, { status: 400 });
    }
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}
