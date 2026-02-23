import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/cms/sections?pageId=123
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('pageId');

    if (!pageId) {
      return NextResponse.json({ error: 'Page ID required' }, { status: 400 });
    }

    const { data: sections, error } = await supabaseAdmin
      .from('page_sections')
      .select('*')
      .eq('page_id', pageId)
      .order('display_order', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Error fetching sections:', error);
    return NextResponse.json({ error: 'Failed to fetch sections' }, { status: 500 });
  }
}

// PUT /api/cms/sections - Update section content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, content } = body;

    if (!id || !content) {
      return NextResponse.json({ error: 'Section ID and Content required' }, { status: 400 });
    }

    const { data: updatedSection, error } = await supabaseAdmin
      .from('page_sections')
      .update({ content, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, section: updatedSection });
  } catch (error) {
    console.error('Error updating section:', error);
    return NextResponse.json({ error: 'Failed to update section' }, { status: 500 });
  }
}

// POST /api/cms/sections - Create new section
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { page_id, section_key, title, content, display_order } = body;

    const { data: newSection, error } = await supabaseAdmin
      .from('page_sections')
      .insert({
        page_id,
        section_key,
        title,
        content: content || {},
        display_order: display_order || 0
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, section: newSection }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating section:', error);
    return NextResponse.json({ error: error.message || 'Failed to create section' }, { status: 500 });
  }
}

// DELETE /api/cms/sections - Delete a section
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Section ID required' }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from('page_sections')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting section:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete section' }, { status: 500 });
  }
}
