'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { adminFetch, clearAdminToken } from '@/lib/client-auth';
import { PortfolioDatabase, Project, Category, HeroSection, AboutSection, ServiceItem, WorkflowStep, ContactSettings, BrandingSettings, NavigationSettings, SocialLink, AppearanceSettings, GeneralSettings, MediaItem } from '@/lib/types';
import { ThemeToggle } from '@/components/theme-toggle';
import { OverviewTab } from '@/components/admin/overview-tab';
import { HeroTab } from '@/components/admin/hero-tab';
import { ProjectsTab } from '@/components/admin/projects-tab';
import { CategoriesTab } from '@/components/admin/categories-tab';
import { AboutTab } from '@/components/admin/about-tab';
import { ServicesTab } from '@/components/admin/services-tab';
import { ContactTab } from '@/components/admin/contact-tab';
import { BrandingTab } from '@/components/admin/branding-tab';
import { MediaTab } from '@/components/admin/media-tab';
import { NavigationTab } from '@/components/admin/navigation-tab';
import { SocialsTab } from '@/components/admin/socials-tab';
import { AppearanceTab } from '@/components/admin/appearance-tab';
import { GeneralTab } from '@/components/admin/general-tab';
import {
  LayoutDashboard,
  Sparkles,
  Film,
  FolderTree,
  User,
  Layers,
  Mail,
  Sliders,
  HardDrive,
  Compass,
  Share2,
  Palette,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

interface AdminClientProps {
  initialData: PortfolioDatabase;
}

export function AdminClient({ initialData }: AdminClientProps) {
  const router = useRouter();
  const [data, setData] = useState<PortfolioDatabase>(initialData);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [openNewProjectModal, setOpenNewProjectModal] = useState(false);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'hero', label: 'Hero Section', icon: Sparkles },
    { id: 'projects', label: 'Portfolio Projects', icon: Film },
    { id: 'categories', label: 'Categories and Genres', icon: FolderTree },
    { id: 'about', label: 'About Section', icon: User },
    { id: 'services', label: 'Services Section', icon: Layers },
    { id: 'contact', label: 'Contact Information', icon: Mail },
    { id: 'branding', label: 'Logo and Branding', icon: Sliders },
    { id: 'media', label: 'Media Library', icon: HardDrive },
    { id: 'navigation', label: 'Navigation and Footer', icon: Compass },
    { id: 'socials', label: 'Social Links', icon: Share2 },
    { id: 'appearance', label: 'Website Appearance', icon: Palette },
    { id: 'general', label: 'General Settings', icon: Settings },
  ];

  const handleLogout = async () => {
    try {
      await adminFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    } finally {
      clearAdminToken();
      router.push('/admin/login');
      router.refresh();
    }
  };

  // Section Save Handlers
  const handleSaveHero = async (updatedHero: HeroSection) => {
    const res = await adminFetch('/api/portfolio/section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'hero', data: updatedHero }),
    });
    if (!res.ok) throw new Error('Save failed');
    setData((prev) => ({ ...prev, hero: updatedHero }));
    router.refresh();
  };

  const handleSaveProject = async (project: Project) => {
    const res = await adminFetch('/api/portfolio/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });
    const result = await res.json();
    if (!res.ok) throw new Error('Project save failed');

    setData((prev) => {
      const idx = prev.projects.findIndex((p) => p.id === result.project.id);
      const nextProjects = [...prev.projects];
      if (idx >= 0) {
        nextProjects[idx] = result.project;
      } else {
        nextProjects.push(result.project);
      }
      return { ...prev, projects: nextProjects };
    });
    router.refresh();
  };

  const handleDeleteProject = async (id: string) => {
    const res = await adminFetch(`/api/portfolio/projects?id=${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Delete failed');
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((p) => p.id !== id),
    }));
    router.refresh();
  };

  const handleReorderProjects = async (orderedIds: string[]) => {
    const res = await adminFetch('/api/portfolio/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'reorder', orderedIds }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error('Reorder failed');
    setData((prev) => ({ ...prev, projects: result.projects }));
    router.refresh();
  };

  const handleSaveCategories = async (categories: Category[]) => {
    const res = await adminFetch('/api/portfolio/section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'categories', data: categories }),
    });
    if (!res.ok) throw new Error('Save failed');
    setData((prev) => ({ ...prev, categories }));
    router.refresh();
  };

  const handleSaveAbout = async (about: AboutSection) => {
    const res = await adminFetch('/api/portfolio/section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'about', data: about }),
    });
    if (!res.ok) throw new Error('Save failed');
    setData((prev) => ({ ...prev, about }));
    router.refresh();
  };

  const handleSaveServices = async (services: ServiceItem[], workflow: WorkflowStep[]) => {
    const res = await adminFetch('/api/portfolio/section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'services', data: { services, workflow } }),
    });
    if (!res.ok) throw new Error('Save failed');
    setData((prev) => ({ ...prev, services, workflow }));
    router.refresh();
  };

  const handleSaveContact = async (contactSettings: Partial<ContactSettings>) => {
    const res = await adminFetch('/api/portfolio/section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'contact', data: contactSettings }),
    });
    if (!res.ok) throw new Error('Save failed');
    setData((prev) => ({
      ...prev,
      contact: { ...prev.contact, ...contactSettings },
    }));
    router.refresh();
  };

  const handleUpdateInquiryStatus = async (id: string, status: 'unread' | 'read' | 'archived') => {
    const res = await adminFetch('/api/inquiries', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    });
    if (!res.ok) throw new Error('Status update failed');
    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        inquiries: prev.contact.inquiries.map((i) => (i.id === id ? { ...i, status } : i)),
      },
    }));
    router.refresh();
  };

  const handleDeleteInquiry = async (id: string) => {
    const res = await adminFetch(`/api/inquiries?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    setData((prev) => ({
      ...prev,
      contact: {
        ...prev.contact,
        inquiries: prev.contact.inquiries.filter((i) => i.id !== id),
      },
    }));
    router.refresh();
  };

  const handleSaveBranding = async (branding: BrandingSettings) => {
    const res = await adminFetch('/api/portfolio/section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'branding', data: branding }),
    });
    if (!res.ok) throw new Error('Save failed');
    setData((prev) => ({ ...prev, branding }));
    router.refresh();
  };

  const handleUploadMediaSuccess = (item: MediaItem) => {
    setData((prev) => ({
      ...prev,
      media: [item, ...(prev.media || [])],
    }));
    router.refresh();
  };

  const handleDeleteMedia = async (id: string) => {
    const res = await adminFetch(`/api/media?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
    setData((prev) => ({
      ...prev,
      media: (prev.media || []).filter((m) => m.id !== id),
    }));
    router.refresh();
  };

  const handleSaveNavigation = async (nav: NavigationSettings) => {
    const res = await adminFetch('/api/portfolio/section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'navigation', data: nav }),
    });
    if (!res.ok) throw new Error('Save failed');
    setData((prev) => ({ ...prev, navigation: nav }));
    router.refresh();
  };

  const handleSaveSocials = async (socials: SocialLink[]) => {
    const res = await adminFetch('/api/portfolio/section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'socials', data: socials }),
    });
    if (!res.ok) throw new Error('Save failed');
    setData((prev) => ({ ...prev, socials }));
    router.refresh();
  };

  const handleSaveAppearance = async (app: AppearanceSettings) => {
    const res = await adminFetch('/api/portfolio/section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'appearance', data: app }),
    });
    if (!res.ok) throw new Error('Save failed');
    setData((prev) => ({ ...prev, appearance: app }));
    router.refresh();
  };

  const handleSaveGeneral = async (gen: Partial<GeneralSettings> & { newPassword?: string }) => {
    const res = await adminFetch('/api/portfolio/section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'general', data: gen }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.error || 'Save failed');
    setData((prev) => ({
      ...prev,
      general: { ...prev.general, ...result.general },
    }));
    router.refresh();
  };

  const handleResetDefaults = async () => {
    const res = await adminFetch('/api/portfolio/section', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ section: 'reset' }),
    });
    const result = await res.json();
    if (!res.ok) throw new Error('Reset failed');
    setData(result.data);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-black dark:text-white flex">
      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-neutral-50 dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-900 flex flex-col justify-between transition-transform duration-200 md:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-neutral-200 dark:border-neutral-900 flex items-center justify-between">
          <div>
            <span className="font-mono text-xs font-bold border border-black dark:border-white px-2 py-0.5 tracking-widest uppercase">
              {data.branding.monogram || 'C // K'}
            </span>
            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-neutral-500 mt-2">
              Admin Portal
            </p>
          </div>
          <button
            onClick={() => setMobileSidebarOpen(false)}
            className="md:hidden p-1 text-neutral-400 hover:text-black dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs List */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-mono uppercase tracking-wider transition-colors text-left cursor-pointer ${
                  isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black font-bold'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200/50 dark:hover:bg-neutral-900 hover:text-black dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-neutral-200 dark:border-neutral-900 space-y-2">
          <Link
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono uppercase text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white border border-neutral-300 dark:border-neutral-800"
          >
            <span>View Live Site</span>
            <ExternalLink className="w-3 h-3" />
          </Link>

          <button
            onClick={handleLogout}
            type="button"
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono uppercase text-neutral-500 hover:text-red-500 hover:border-red-500 border border-transparent transition-colors cursor-pointer"
          >
            <span>Log Out</span>
            <LogOut className="w-3 h-3" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white/95 dark:bg-black/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-900 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-1.5 border border-neutral-300 dark:border-neutral-800 text-black dark:text-white"
            >
              <Menu className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-mono uppercase tracking-[0.2em] font-bold">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <div className="hidden sm:block text-[11px] font-mono text-neutral-500 border-l border-neutral-200 dark:border-neutral-800 pl-3">
              {data.general.adminEmail}
            </div>
          </div>
        </header>

        {/* Active Tab Screen */}
        <main className="p-6 md:p-10 flex-1">
          {activeTab === 'overview' && (
            <OverviewTab
              data={data}
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenNewProject={() => {
                setActiveTab('projects');
                setOpenNewProjectModal(true);
              }}
            />
          )}

          {activeTab === 'hero' && <HeroTab hero={data.hero} onSave={handleSaveHero} />}

          {activeTab === 'projects' && (
            <ProjectsTab
              projects={data.projects}
              categories={data.categories}
              onSaveProject={handleSaveProject}
              onDeleteProject={handleDeleteProject}
              onReorder={handleReorderProjects}
              isModalOpenInitially={openNewProjectModal}
            />
          )}

          {activeTab === 'categories' && (
            <CategoriesTab categories={data.categories} onSave={handleSaveCategories} />
          )}

          {activeTab === 'about' && <AboutTab about={data.about} onSave={handleSaveAbout} />}

          {activeTab === 'services' && (
            <ServicesTab
              services={data.services}
              workflow={data.workflow}
              onSave={handleSaveServices}
            />
          )}

          {activeTab === 'contact' && (
            <ContactTab
              contact={data.contact}
              onSaveSettings={handleSaveContact}
              onUpdateInquiryStatus={handleUpdateInquiryStatus}
              onDeleteInquiry={handleDeleteInquiry}
            />
          )}

          {activeTab === 'branding' && (
            <BrandingTab branding={data.branding} onSave={handleSaveBranding} />
          )}

          {activeTab === 'media' && (
            <MediaTab
              media={data.media || []}
              onUploadSuccess={handleUploadMediaSuccess}
              onDeleteMedia={handleDeleteMedia}
            />
          )}

          {activeTab === 'navigation' && (
            <NavigationTab navigation={data.navigation} onSave={handleSaveNavigation} />
          )}

          {activeTab === 'socials' && (
            <SocialsTab socials={data.socials} onSave={handleSaveSocials} />
          )}

          {activeTab === 'appearance' && (
            <AppearanceTab appearance={data.appearance} onSave={handleSaveAppearance} />
          )}

          {activeTab === 'general' && (
            <GeneralTab
              general={{
                siteName: data.general.siteName,
                siteDescription: data.general.siteDescription,
                keywords: data.general.keywords,
                adminEmail: data.general.adminEmail,
              }}
              onSave={handleSaveGeneral}
              onResetDefaults={handleResetDefaults}
            />
          )}
        </main>
      </div>
    </div>
  );
}
