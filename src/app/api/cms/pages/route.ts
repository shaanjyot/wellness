import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/cms/pages - List all pages
export async function GET(request: NextRequest) {
  try {
    const { data: pages, error } = await supabaseAdmin
      .from('pages')
      .select('*')
      .order('title', { ascending: true });

    if (error) throw error;

    return NextResponse.json({ pages });
  } catch (error) {
    console.error('Error fetching CMS pages:', error);
    return NextResponse.json({ error: 'Failed to fetch pages' }, { status: 500 });
  }
}

// POST /api/cms/pages - Create a new page
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, slug, meta_description } = body;

    const { data, error } = await supabaseAdmin
      .from('pages')
      .insert({
        title,
        slug,
        meta_description
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ page: data }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating page:', error);
    return NextResponse.json({ error: error.message || 'Failed to create page' }, { status: 500 });
  }
}

// DELETE /api/cms/pages - Delete a page
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Page ID required' }, { status: 400 });
    }

    // First delete all sections for this page
    const { error: sectionsError } = await supabaseAdmin
      .from('page_sections')
      .delete()
      .eq('page_id', id);

    if (sectionsError) throw sectionsError;

    // Then delete the page
    const { error: pageError } = await supabaseAdmin
      .from('pages')
      .delete()
      .eq('id', id);

    if (pageError) throw pageError;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting page:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete page' }, { status: 500 });
  }
}
