import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { isAdminAuthenticated } from '@/lib/auth';
import { saveProject, deleteProject, reorderProjects, getProjects } from '@/lib/db';
import { Project } from '@/lib/types';

export async function GET(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const projects = getProjects(true);
  return NextResponse.json(projects);
}

export async function POST(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = (await req.json()) as Project;

    if (!data.title) {
      return NextResponse.json({ error: 'Project title is required' }, { status: 400 });
    }

    const slug =
      data.slug ||
      data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

    const projectToSave: Project = {
      ...data,
      id: data.id || `proj-${Date.now()}`,
      slug,
      status: data.status || 'published',
      featured: !!data.featured,
      order: data.order ?? 999,
      equipment: Array.isArray(data.equipment) ? data.equipment : [],
    };

    const saved = saveProject(projectToSave);
    try {
      revalidatePath('/');
      revalidatePath(`/work/${saved.slug}`);
      revalidatePath('/api/portfolio');
    } catch {}
    return NextResponse.json({ success: true, project: saved });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Check if this is a reorder action
    if (body.action === 'reorder' && Array.isArray(body.orderedIds)) {
      const reordered = reorderProjects(body.orderedIds);
      try {
        revalidatePath('/');
        revalidatePath('/api/portfolio');
      } catch {}
      return NextResponse.json({ success: true, projects: reordered });
    }

    // Standard project update
    const project = body as Project;
    if (!project.id || !project.title) {
      return NextResponse.json({ error: 'Project ID and title are required' }, { status: 400 });
    }

    const saved = saveProject(project);
    try {
      revalidatePath('/');
      revalidatePath(`/work/${saved.slug}`);
      revalidatePath('/api/portfolio');
    } catch {}
    return NextResponse.json({ success: true, project: saved });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await req.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: 'Project ID required' }, { status: 400 });
    }

    const success = deleteProject(id);
    try {
      revalidatePath('/');
      revalidatePath('/api/portfolio');
    } catch {}
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
