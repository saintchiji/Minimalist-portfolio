import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/auth';
import { addInquiry, updateInquiryStatus, deleteInquiry, getDb } from '@/lib/db';

// Public contact inquiry submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, projectType, timeline, budget, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and project message are required.' },
        { status: 400 }
      );
    }

    // Email format basic validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const newInquiry = addInquiry({
      name: name.trim(),
      email: email.trim(),
      company: company?.trim() || '',
      projectType: projectType || 'General Inquiry',
      timeline: timeline || 'Flexible',
      budget: budget || 'To be discussed',
      message: message.trim(),
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry received. We will respond within 24-48 hours.',
      inquiryId: newInquiry.id,
    });
  } catch (error) {
    console.error('Error handling inquiry submission:', error);
    return NextResponse.json({ error: 'Unable to submit inquiry at this time.' }, { status: 500 });
  }
}

// Admin only: list inquiries
export async function GET(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const db = getDb();
  return NextResponse.json({ inquiries: db.contact.inquiries });
}

// Admin only: update inquiry status
export async function PUT(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status required' }, { status: 400 });
    }

    const success = updateInquiryStatus(id, status);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error updating inquiry status:', error);
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 });
  }
}

// Admin only: delete inquiry
export async function DELETE(req: NextRequest) {
  const isAuth = await isAdminAuthenticated(req);
  if (!isAuth) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const success = deleteInquiry(id);
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting inquiry:', error);
    return NextResponse.json({ error: 'Failed to delete inquiry' }, { status: 500 });
  }
}
