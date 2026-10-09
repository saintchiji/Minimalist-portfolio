import { getDb } from '@/lib/db';
import { Navbar } from '@/components/public/navbar';
import { Hero } from '@/components/public/hero';
import { PortfolioSection } from '@/components/public/portfolio-section';
import { AboutSection } from '@/components/public/about-section';
import { ServicesSection } from '@/components/public/services-section';
import { ContactSection } from '@/components/public/contact-section';
import { Footer } from '@/components/public/footer';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const db = getDb();

  // Only published projects for public view, sorted by order
  const publishedProjects = db.projects
    .filter((p) => p.status === 'published')
    .sort((a, b) => a.order - b.order);

  const activeCategories = db.categories
    .filter((c) => c.enabled)
    .sort((a, b) => a.order - b.order);

  // Dynamic Section Ordering & Visibility Hierarchy
  const configuredSections = (db.appearance?.sections || [
    { id: 'sec-hero', key: 'hero', label: 'Hero Section', enabled: true, order: 1 },
    { id: 'sec-work', key: 'work', label: 'Work Portfolio Gallery', enabled: true, order: 2 },
    { id: 'sec-about', key: 'about', label: 'About Section', enabled: true, order: 3 },
    { id: 'sec-services', key: 'services', label: 'Services Section', enabled: true, order: 4 },
    { id: 'sec-contact', key: 'contact', label: 'Contact Information', enabled: true, order: 5 },
  ])
    .filter((s) => s.enabled)
    .sort((a, b) => a.order - b.order);

  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        return <Hero key="hero" hero={db.hero} />;
      case 'work':
        return (
          <PortfolioSection
            key="work"
            projects={publishedProjects}
            categories={activeCategories}
          />
        );
      case 'about':
        return <AboutSection key="about" about={db.about} />;
      case 'services':
        return (
          <ServicesSection
            key="services"
            services={db.services}
            workflow={db.workflow}
          />
        );
      case 'contact':
        return (
          <ContactSection
            key="contact"
            contact={{
              email: db.contact.email,
              phone: db.contact.phone,
              location: db.contact.location,
              timezone: db.contact.timezone,
              agent: db.contact.agent,
              availabilityStatus: db.contact.availabilityStatus,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <Navbar branding={db.branding} navItems={db.navigation.items} />

      <main>{configuredSections.map((sec) => renderSection(sec.key))}</main>

      <Footer
        branding={{ siteTitle: db.branding.siteTitle, monogram: db.branding.monogram }}
        navigation={{
          footerCopyright: db.navigation.footerCopyright,
          footerStatement: db.navigation.footerStatement,
          items: db.navigation.items,
        }}
        contact={{
          email: db.contact.email,
          phone: db.contact.phone,
          location: db.contact.location,
        }}
        socials={db.socials}
      />
    </div>
  );
}
